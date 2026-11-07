#!/usr/bin/env python3
"""
Fill / recompute champion mastery overrides from gol.gg  (v2).

Usage:
  python fill_champion_mastery_from_golgg.py \
    --champions app/data/champions \
    --players /path/to/players.ts \
    --overrides /path/to/championMasteryOverrides.ts \
    --out /path/to/championMasteryOverrides.updated.ts \
    --cache-dir .golgg_cache --report-csv report.csv

What it does:
  - Reads champion ids/names/roles from app/data/champions/ (one <id>.ts file per champion;
    index.ts and _helpers.ts are ignored) and player names/slugs/roles from players.ts.
  - Downloads gol.gg player pages (season=ALL, split=ALL, tournament=ALL).
  - RECOMPUTES the grade of every role-valid champion found on gol.gg, including
    the grades that already exist in championMasteryOverrides.ts.
      * existing "SS" grades are kept (the script never produces SS); use --overwrite-ss to recompute them too
      * existing champions that gol.gg has no data for are kept as they are
      * use --fill-missing-only to get the old behaviour (never touch existing grades)
  - Quotes champion slugs that contain '-'.

How the grade is computed (see grade_player_pool):
  1. Performance is measured RELATIVE to the player's own baseline (overall win rate / KDA),
     not against fixed thresholds. A star on a dominant team and a player on a weak team
     are judged against themselves, so team strength stops dominating the grade.
  2. Win rate and KDA are shrunk toward the player's baseline with few games
     (bayesian shrinkage), so 3 games at 100% do not look like mastery.
  3. Familiarity (games played, share of the player's pool) sets the base tier,
     performance moves it up or down.
  4. Hard gates on sample size (<5 games -> max C, <8 -> max B, <18 -> max A).
  5. Per-player quotas: at most --max-s S and --max-a A, and at least --min-a A/S
     (the best B's are promoted if they are good enough).
  6. Floor rule kept from v1: top-8 most played champions (>18 games) are at least B.

Other options:
  --calibrate        dry run: write nothing, only print how the new grades compare to the existing ones
  --report-csv FILE  one row per graded champion (games, WR, KDA, old grade, new grade, score)
  --cache-dir DIR    cache downloaded pages on disk (tuning runs do not hit gol.gg again)
  --ids FILE         JSON {"player_id": golgg_numeric_id} to pin players whose name is ambiguous
  --write-ids FILE   write the gol.gg ids that were used, to review/pin them
  --recent-seasons S16,S15  also fetch these seasons and count their games extra (--recent-weight)

Player matching:
  Candidates with the same name are compared by how much of their pool is valid for the
  player's role. Wrong-role or ambiguous matches are skipped and listed in the report
  instead of being guessed; pin them with --ids.

Notes:
  - This script needs normal internet access to gol.gg.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import html
import json
import math
import re
import sys
import time
from collections import Counter, defaultdict
from dataclasses import dataclass, replace
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

GOLGG_BASE = "https://gol.gg/"
PLAYERS_LIST_URL = "https://gol.gg/players/list/season-ALL/split-ALL/tournament-ALL/"
GRADE_ORDER = {"F": 0, "D": 1, "C": 2, "B": 3, "A": 4, "S": 5, "SS": 6}
ORDER_GRADE = {v: k for k, v in GRADE_ORDER.items()}

MIN_ROLE_FIT = 0.50        # share of a candidate's games that must be on champions valid for the player's role
AMBIGUITY_MARGIN = 0.15    # two plausible candidates closer than this -> ambiguous, skip


# --------------------------------------------------------------------------- data classes
@dataclass(frozen=True)
class ChampionStat:
    slug: str
    games: int
    winrate: float
    kda: Optional[float]
    rank: int
    # recency-weighted values (only set when --recent-seasons is used)
    w_games: Optional[float] = None
    w_winrate: Optional[float] = None
    w_kda: Optional[float] = None


@dataclass(frozen=True)
class PlayerInfo:
    id: str
    slug: str
    name: str
    role: str


@dataclass
class Params:
    wr_prior_games: float = 12.0   # how strongly WR is pulled toward the player's baseline
    kda_prior_games: float = 10.0  # same for KDA
    wr_scale_pp: float = 10.0      # +10pp over own baseline == +1.0 performance
    kda_scale_log: float = 0.30    # +35% KDA over own baseline == +1.0 performance
    fam_weight: float = 2.6
    perf_weight: float = 1.2
    conf_full_games: float = 15.0  # performance counts fully from this many games
    max_s: int = 2
    max_a: int = 6
    min_a: int = 3
    keep_ss: bool = True


@dataclass
class GradeRow:
    st: ChampionStat
    score: float
    grade: str


@dataclass
class Resolved:
    url: str
    html: str
    pool: List[ChampionStat]
    unresolved: List[str]
    fit: float


# --------------------------------------------------------------------------- small helpers
def normalize_key(text: str) -> str:
    return re.sub(r"[^a-z0-9]", "", text.lower())


def quote_key(slug: str) -> str:
    return f'"{slug}"' if "-" in slug else slug


def player_url(golgg_id: str, season: str = "ALL") -> str:
    return f"https://gol.gg/players/player-stats/{golgg_id}/season-{season}/split-ALL/tournament-ALL/champion-ALL/"


def golgg_id_from_url(url: str) -> Optional[str]:
    m = re.search(r"player-stats/(\d+)/", url)
    return m.group(1) if m else None


def http_get(session: requests.Session, url: str, cache_dir: Optional[Path], timeout: int = 30) -> Tuple[str, bool]:
    """Returns (text, from_cache)."""
    cache_file: Optional[Path] = None
    if cache_dir:
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = cache_dir / (hashlib.sha1(url.encode("utf-8")).hexdigest() + ".html")
        if cache_file.exists():
            return cache_file.read_text(encoding="utf-8"), True
    r = session.get(url, timeout=timeout)
    r.raise_for_status()
    if cache_file:
        cache_file.write_text(r.text, encoding="utf-8")
    return r.text, False


# --------------------------------------------------------------------------- parsing of the repo files
CHAMPION_FOLDER_SKIP = {"index.ts", "_helpers.ts"}


def parse_champions(path: Path) -> Tuple[Dict[str, set], Dict[str, str]]:
    """Read champion ids, names and roles from the folder with one <id>.ts file per champion."""
    if not path.is_dir():
        raise SystemExit(
            f"--champions must be the champion folder (e.g. app/data/champions), got: {path}"
        )
    roles_by_slug: Dict[str, set] = {}
    slug_by_norm_name: Dict[str, str] = {}

    # One file = one champion; the top-level `id:` / `name:` / `roles:` keys appear once per file.
    for file in sorted(path.glob("*.ts")):
        if file.name in CHAMPION_FOLDER_SKIP:
            continue
        text = file.read_text(encoding="utf-8")
        id_m = re.search(r'^\s*id:\s*"([^"]+)"', text, flags=re.M)
        roles_m = re.search(r"^\s*roles:\s*\[([^\]]*)\]", text, flags=re.M | re.S)
        if not id_m or not roles_m:
            print(f"warning: {file.name}: no id/roles found, skipped", file=sys.stderr)
            continue
        slug = id_m.group(1)
        roles = set(re.findall(r'"([^"]+)"', roles_m.group(1)))
        roles_by_slug[slug] = roles
        name_m = re.search(r'^\s*name:\s*"([^"]+)"', text, flags=re.M)
        if name_m:
            slug_by_norm_name[normalize_key(name_m.group(1))] = slug
        slug_by_norm_name[normalize_key(slug)] = slug

    # gol.gg display aliases.
    aliases = {
        "ksante": "ksante",
        "ksanté": "ksante",
        "kogmaw": "kogmaw",
        "khazix": "khazix",
        "chogath": "chogath",
        "drmundo": "dr-mundo",
        "jarvaniv": "jarvan-iv",
        "missfortune": "miss-fortune",
        "renataglasc": "renata-glasc",
        "tahmkench": "tahm-kench",
        "twistedfate": "twisted-fate",
        "aurelionsol": "aurelion-sol",
        "masteryi": "master-yi",
        "velkoz": "velkoz",
        "reksai": "reksai",
        "belveth": "belveth",
    }
    slug_by_norm_name.update(aliases)
    return roles_by_slug, slug_by_norm_name


def parse_players(path: Path) -> List[PlayerInfo]:
    text = path.read_text(encoding="utf-8")
    players: List[PlayerInfo] = []
    # parse each createPlayer object; permissive and line-order independent.
    for block in re.findall(r"createPlayer\(\{(.*?)\}\),", text, flags=re.S):
        id_m = re.search(r'id:\s*"([^"]+)"', block)
        slug_m = re.search(r'slug:\s*"([^"]+)"', block)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        role_m = re.search(r'role:\s*"([^"]+)"', block)
        if id_m and slug_m and name_m and role_m:
            players.append(PlayerInfo(id_m.group(1), slug_m.group(1), name_m.group(1), role_m.group(1)))
    return players


def parse_existing_overrides(text: str) -> Dict[str, Dict[str, str]]:
    """Parse existing override entries safely.

    The first script version accidentally read through one-line empty blocks like
    `aiming: {},` until the next multi-line block. That caused champs from another
    player to be preserved as if they belonged to the empty player. This parser is
    line-based so `player: {},` is always treated as truly empty.
    Supports both player: {...} and "369": {...}.
    """
    out: Dict[str, Dict[str, str]] = {}
    lines = text.splitlines()
    i = 0
    key_re = re.compile(r'^\s{4}(?:"([^"\n]+)"|([A-Za-z_][A-Za-z0-9_-]*|[0-9][A-Za-z0-9_-]*)):\s*(\{.*)$')
    entry_re = re.compile(r'^\s{8}(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*"(SS|S|A|B|C|D|F)"')
    while i < len(lines):
        m = key_re.match(lines[i])
        if not m:
            i += 1
            continue
        player = m.group(1) or m.group(2)
        rest = m.group(3).strip()
        entries: Dict[str, str] = {}
        if rest.startswith('{}'):
            out[player] = entries
            i += 1
            continue
        i += 1
        while i < len(lines):
            if re.match(r'^\s{4}\},\s*$', lines[i]):
                break
            em = entry_re.match(lines[i])
            if em:
                slug = em.group(1) or em.group(2)
                entries[slug] = em.group(3)
            i += 1
        out[player] = entries
        i += 1
    return out


def ts_player_key_pattern(player_id: str) -> str:
    # Player IDs can be normal identifiers (clear) or quoted keys ("369").
    escaped = re.escape(player_id)
    if re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', player_id):
        return rf'(?:{escaped}|"{escaped}")'
    return rf'"{escaped}"'


# --------------------------------------------------------------------------- gol.gg scraping
def build_player_link_index(session: requests.Session, cache_dir: Optional[Path]) -> Dict[str, List[str]]:
    text, _ = http_get(session, PLAYERS_LIST_URL, cache_dir)
    soup = BeautifulSoup(text, "html.parser")
    links: Dict[str, List[str]] = {}
    for a in soup.find_all("a", href=True):
        href = a.get("href", "")
        name = a.get_text(" ", strip=True)
        if "player-stats" not in href or not name:
            continue
        url = urljoin(GOLGG_BASE + "players/list/season-ALL/split-ALL/tournament-ALL/", href)
        # Convert season-specific hrefs to all seasons/all tournaments/champion ALL.
        pid = golgg_id_from_url(url)
        if not pid:
            continue
        links.setdefault(normalize_key(name), []).append(player_url(pid))
    return links


def parse_float(text: str) -> Optional[float]:
    text = text.strip().replace("%", "")
    if text == "-" or not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def parse_overall_stats(page_text: str) -> Tuple[Optional[float], Optional[float]]:
    # Works on soup text with newlines; also tolerates compact HTML text.
    wr = None
    kda = None
    m = re.search(r"Win Rate:\s*\n?\s*([\d.]+)%", page_text)
    if m:
        wr = float(m.group(1))
    m = re.search(r"KDA:\s*([\d.]+)", page_text)
    if m:
        kda = float(m.group(1))
    return wr, kda


def parse_champion_pool(html_text: str, slug_by_norm_name: Dict[str, str]) -> Tuple[List[ChampionStat], List[str]]:
    soup = BeautifulSoup(html_text, "html.parser")
    text_lines = [html.unescape(x.strip()) for x in soup.get_text("\n").splitlines() if x.strip()]
    unresolved: List[str] = []
    stats: List[ChampionStat] = []

    # Find start of champion pool. gol.gg renders this as one line like:
    # "Player champion pool. Champion Nb games Win Rate KDA".
    start = None
    for i, line in enumerate(text_lines):
        low = line.lower()
        if "champion pool" in low or ("champion" in low and "nb games" in low and "win rate" in low and "kda" in low):
            start = i + 1
            break
    if start is None:
        return [], ["champion_pool_not_found"]

    def extract_name_games(line: str) -> Optional[Tuple[str, int]]:
        cleaned = re.sub(r"\s+", " ", line).strip()
        # Sometimes the web rendering/debug output contains link markers or image alt text.
        cleaned = re.sub(r"^Image:\s*", "", cleaned, flags=re.I).strip()
        # Common case from gol.gg text extraction: "Xin Zhao 58" or "Dr. Mundo 2".
        m = re.match(r"^(.+?)\s+(\d+)$", cleaned)
        if m:
            name = m.group(1).strip()
            games = int(m.group(2))
            if normalize_key(name) in slug_by_norm_name:
                return name, games
        # Alternate case: champion name alone; games appears on the next line.
        if normalize_key(cleaned) in slug_by_norm_name:
            return cleaned, -1
        return None

    rank = 1
    i = start
    seen_slugs = set()
    while i < len(text_lines):
        line = text_lines[i]
        low = line.lower()
        if "vision stats" in low or "match list" in low or "personal best" in low or "©" in line or "games of legends" in low:
            break

        ng = extract_name_games(line)
        if not ng:
            i += 1
            continue

        name, games = ng
        j = i + 1
        if games == -1:
            # Find immediate numeric games line after champion name.
            if j >= len(text_lines) or not re.fullmatch(r"\d+", text_lines[j]):
                i += 1
                continue
            games = int(text_lines[j])
            j += 1

        # Find next winrate line and KDA line. gol.gg often has blank/table artifacts,
        # so scan forward a few lines rather than assuming fixed offsets.
        wr_val: Optional[float] = None
        kda_val: Optional[float] = None
        scan_limit = min(len(text_lines), j + 8)
        while j < scan_limit and wr_val is None:
            if "%" in text_lines[j]:
                wr_val = parse_float(text_lines[j])
            j += 1
        while j < scan_limit and kda_val is None:
            cand = text_lines[j].strip()
            if cand == "-" or re.fullmatch(r"\d+(?:\.\d+)?", cand):
                kda_val = parse_float(cand)
            j += 1

        norm = normalize_key(name)
        slug = slug_by_norm_name.get(norm)
        if not slug:
            unresolved.append(name)
            i += 1
            continue
        if wr_val is None:
            i += 1
            continue
        if slug in seen_slugs:
            i += 1
            continue
        seen_slugs.add(slug)
        stats.append(ChampionStat(slug=slug, games=games, winrate=wr_val, kda=kda_val, rank=rank))
        rank += 1
        i = j
    return stats, unresolved


# --------------------------------------------------------------------------- player matching
def role_fit(pool: List[ChampionStat], role: str, roles_by_slug: Dict[str, set]) -> float:
    """Share of the player's games that were played on champions valid for `role`."""
    total = sum(s.games for s in pool)
    if total <= 0:
        return 0.0
    ok = sum(s.games for s in pool if role in roles_by_slug.get(s.slug, set()))
    return ok / total


def resolve_player(
    session: requests.Session,
    index: Dict[str, List[str]],
    player: PlayerInfo,
    roles_by_slug: Dict[str, set],
    slug_by_norm_name: Dict[str, str],
    pinned: Dict[str, str],
    cache_dir: Optional[Path],
    sleep: float,
) -> Tuple[Optional[Resolved], Optional[str]]:
    """Find the gol.gg page of `player`. Never guesses: wrong-role / ambiguous -> (None, reason)."""
    pin = pinned.get(player.id)
    if pin:
        url = player_url(pin)
        try:
            text, cached = http_get(session, url, cache_dir)
        except Exception as e:  # noqa: BLE001
            return None, f"pinned_fetch_failed({e})"
        if not cached:
            time.sleep(sleep)
        pool, unresolved = parse_champion_pool(text, slug_by_norm_name)
        return Resolved(url, text, pool, unresolved, role_fit(pool, player.role, roles_by_slug)), None

    raw = index.get(normalize_key(player.name), []) or index.get(normalize_key(player.slug), [])
    candidates = list(dict.fromkeys(raw))  # de-duplicate, keep order
    if not candidates:
        return None, "not_found_in_player_list"

    fitted: List[Resolved] = []
    for url in candidates:
        try:
            text, cached = http_get(session, url, cache_dir)
        except Exception:  # noqa: BLE001
            continue
        if not cached:
            time.sleep(sleep)
        pool, unresolved = parse_champion_pool(text, slug_by_norm_name)
        if not pool:
            continue
        fitted.append(Resolved(url, text, pool, unresolved, role_fit(pool, player.role, roles_by_slug)))
    if not fitted:
        return None, "all_candidates_failed_or_empty_pool"

    fitted.sort(key=lambda r: r.fit, reverse=True)
    best = fitted[0]
    if best.fit < MIN_ROLE_FIT:
        return None, f"role_mismatch(best_fit={best.fit:.2f}, role={player.role}) {best.url}"
    plausible = [r for r in fitted if r.fit >= MIN_ROLE_FIT]
    if len(plausible) > 1 and plausible[0].fit - plausible[1].fit < AMBIGUITY_MARGIN:
        urls = ", ".join(r.url for r in plausible[:3])
        return None, f"ambiguous({len(plausible)} candidates, pin with --ids): {urls}"
    return best, None


# --------------------------------------------------------------------------- recency
def merge_recent(all_pool: List[ChampionStat], recent_pools: List[List[ChampionStat]], weight: float) -> List[ChampionStat]:
    """Count games from the recent seasons `weight` times (the career pool already contains them once)."""
    if not recent_pools or weight <= 1.0:
        return all_pool
    extra = weight - 1.0
    r_games: Counter = Counter()
    r_wins: Dict[str, float] = defaultdict(float)
    r_kda_sum: Dict[str, float] = defaultdict(float)
    r_kda_games: Dict[str, float] = defaultdict(float)
    for pool in recent_pools:
        for s in pool:
            r_games[s.slug] += s.games
            r_wins[s.slug] += s.games * s.winrate / 100.0
            if s.kda is not None:
                r_kda_sum[s.slug] += s.games * s.kda
                r_kda_games[s.slug] += s.games

    out: List[ChampionStat] = []
    for s in all_pool:
        rg = r_games.get(s.slug, 0)
        if rg <= 0:
            out.append(s)
            continue
        cap = min(1.0, s.games / rg)  # recent games can never exceed career games
        rg *= cap
        wins_recent = r_wins[s.slug] * cap
        w_games = s.games + extra * rg
        w_wr = (s.games * s.winrate / 100.0 + extra * wins_recent) / w_games * 100.0
        kda_num = (s.games * s.kda if s.kda is not None else 0.0) + extra * r_kda_sum.get(s.slug, 0.0) * cap
        kda_den = (s.games if s.kda is not None else 0.0) + extra * r_kda_games.get(s.slug, 0.0) * cap
        w_kda = kda_num / kda_den if kda_den > 0 else None
        out.append(replace(s, w_games=w_games, w_winrate=w_wr, w_kda=w_kda))
    return out


# --------------------------------------------------------------------------- grading
def effective(st: ChampionStat) -> Tuple[float, float, Optional[float]]:
    if st.w_games is not None and st.w_winrate is not None:
        return st.w_games, st.w_winrate, st.w_kda
    return float(st.games), st.winrate, st.kda


def pool_baseline(pool: List[ChampionStat]) -> Tuple[Optional[float], Optional[float]]:
    """Games-weighted average WR / KDA of the whole pool (fallback when the page header can't be parsed)."""
    g_total = sum(s.games for s in pool)
    if g_total <= 0:
        return None, None
    wr = sum(s.games * s.winrate for s in pool) / g_total
    kda_pool = [s for s in pool if s.kda is not None]
    kda_games = sum(s.games for s in kda_pool)
    kda = sum(s.games * s.kda for s in kda_pool) / kda_games if kda_games > 0 else None  # type: ignore[operator]
    return wr, kda


def raw_score(st: ChampionStat, total_games: float, base_wr: Optional[float], base_kda: Optional[float], p: Params) -> Tuple[float, float, float]:
    """Returns (score, performance, familiarity)."""
    g, wr, kda = effective(st)
    bwr = base_wr if base_wr is not None else 50.0

    wr_s = (wr * g + bwr * p.wr_prior_games) / (g + p.wr_prior_games)
    wr_edge = (wr_s - bwr) / p.wr_scale_pp

    if kda is not None and base_kda and base_kda > 0:
        kda_s = (kda * g + base_kda * p.kda_prior_games) / (g + p.kda_prior_games)
        kda_edge = math.log(max(kda_s, 0.3) / base_kda) / p.kda_scale_log
        perf = 0.6 * wr_edge + 0.4 * kda_edge
    else:
        perf = wr_edge
    perf = max(-2.0, min(2.0, perf))

    conf = min(1.0, g / p.conf_full_games)
    share = g / max(total_games, 1.0)
    fam = min(1.0, math.log1p(g) / math.log1p(40)) * 0.7 + min(1.0, share / 0.12) * 0.3

    return fam * p.fam_weight + perf * conf * p.perf_weight, perf, fam


def tier_from_score(score: float) -> str:
    if score >= 3.5:
        return "S"
    if score >= 2.6:
        return "A"
    if score >= 1.6:
        return "B"
    if score >= 0.8:
        return "C"
    return "D"


def games_cap(games: int) -> str:
    """Highest grade a champion can get with this many (real) games."""
    if games < 5:
        return "C"
    if games < 8:
        return "B"
    if games < 18:
        return "A"
    return "S"


def grade_player_pool(
    role_stats: List[ChampionStat],
    total_games: float,
    base_wr: Optional[float],
    base_kda: Optional[float],
    p: Params,
    reserved_top: int = 0,
) -> Dict[str, GradeRow]:
    """Grade all role-valid champions of ONE player together (needed for the quotas).

    `role_stats` must be ordered by games played (gol.gg order); `reserved_top` is the number of
    manually kept SS grades, which count against the S quota.
    """
    rows: List[GradeRow] = []
    for i, st in enumerate(role_stats, 1):
        st = replace(st, rank=i)  # rank among the champions that are valid for the role
        score, _perf, _fam = raw_score(st, total_games, base_wr, base_kda, p)
        grade = tier_from_score(score)
        cap = games_cap(st.games)
        if GRADE_ORDER[grade] > GRADE_ORDER[cap]:
            grade = cap
        if st.games == 1 and st.winrate == 0 and (st.kda or 0.0) < 3:
            grade = "D"
        rows.append(GradeRow(st, score, grade))

    # Quotas: too many S -> demote the weakest to A; too many A -> demote the weakest to B.
    s_slots = max(0, p.max_s - reserved_top)
    s_rows = sorted((r for r in rows if r.grade == "S"), key=lambda r: -r.score)
    for r in s_rows[s_slots:]:
        r.grade = "A"
    a_rows = sorted((r for r in rows if r.grade == "A"), key=lambda r: -r.score)
    for r in a_rows[p.max_a:]:
        r.grade = "B"

    # Too few A/S -> promote the best B's, but only if they really earned it.
    top_count = reserved_top + sum(1 for r in rows if r.grade in ("S", "A"))
    if top_count < p.min_a:
        cand = sorted((r for r in rows if r.grade == "B" and r.score >= 2.0 and r.st.games >= 10), key=lambda r: -r.score)
        for r in cand[: p.min_a - top_count]:
            r.grade = "A"

    # Floor rule (from v1): the player's most played champions are at least B.
    for r in rows:
        st = r.st
        if st.rank <= 8 and st.games > 18 and (st.winrate >= 29 or (st.kda or 0.0) >= 2.9):
            if GRADE_ORDER[r.grade] < GRADE_ORDER["B"]:
                r.grade = "B"

    return {r.st.slug: r for r in rows}


# --------------------------------------------------------------------------- writing the .ts file
def format_body(entries: Dict[str, str]) -> str:
    lines = []
    for slug in sorted(entries, key=lambda s: (-GRADE_ORDER[entries[s]], s)):
        lines.append(f'        {quote_key(slug)}: "{entries[slug]}",')
    return "\n".join(lines)


def replace_player_block(overrides_text: str, player_id: str, entries: Dict[str, str]) -> Tuple[str, bool]:
    """Returns (new_text, matched). Handles player: {}, "369": {}, and multi-line blocks."""
    key_pat = ts_player_key_pattern(player_id)
    empty_pat = re.compile(rf"(\n\s{{4}}{key_pat}:\s*)\{{\s*\}}", re.S)
    m = empty_pat.search(overrides_text)
    if m:
        repl = f'{m.group(1)}{{\n{format_body(entries)}\n    }}'
        return overrides_text[:m.start()] + repl + overrides_text[m.end():], True

    pat = re.compile(rf"(\n\s{{4}}{key_pat}:\s*\{{)(.*?)(\n\s{{4}}\}},)", re.S)
    m = pat.search(overrides_text)
    if not m:
        return overrides_text, False
    repl = f'{m.group(1)}\n{format_body(entries)}{m.group(3)}'
    return overrides_text[:m.start()] + repl + overrides_text[m.end():], True


# --------------------------------------------------------------------------- reporting
def print_comparison(pairs: List[Tuple[str, str]]) -> None:
    """pairs = (old_grade, new_grade) for champions that already had a grade (SS excluded)."""
    if not pairs:
        print("\nNo existing grades to compare with.")
        return
    n = len(pairs)
    diffs = [GRADE_ORDER[new] - GRADE_ORDER[old] for old, new in pairs]
    same = sum(1 for d in diffs if d == 0)
    within1 = sum(1 for d in diffs if abs(d) <= 1)
    up = sum(1 for d in diffs if d > 0)
    down = sum(1 for d in diffs if d < 0)
    print(f"\nExisting grades vs new grades ({n} champions that had a grade, SS excluded):")
    print(f"  identical: {same} ({same / n:.0%}) | within 1 tier: {within1} ({within1 / n:.0%}) | up: {up} | down: {down}")
    print(f"  mean absolute difference: {sum(abs(d) for d in diffs) / n:.2f} tiers")
    cols = ["S", "A", "B", "C", "D", "F"]
    matrix = Counter(pairs)
    print("\n  rows = existing, columns = new")
    print("       " + "".join(f"{c:>6}" for c in cols))
    for old in cols:
        if not any(matrix.get((old, new)) for new in cols):
            continue
        print(f"  {old:>4} " + "".join(f"{matrix.get((old, new), 0):>6}" for new in cols))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--champions", required=True, type=Path)
    ap.add_argument("--players", required=True, type=Path)
    ap.add_argument("--overrides", required=True, type=Path)
    ap.add_argument("--out", type=Path, help="output .ts file (not needed with --calibrate)")
    ap.add_argument("--sleep", default=0.35, type=float, help="delay between gol.gg requests")
    ap.add_argument("--cache-dir", type=Path, help="cache downloaded gol.gg pages here")
    ap.add_argument("--ids", type=Path, help='JSON {"player_id": golgg_id} to pin ambiguous players')
    ap.add_argument("--write-ids", type=Path, help="write the gol.gg ids that were used (JSON)")
    ap.add_argument("--report-csv", type=Path, help="write one CSV row per graded champion")
    ap.add_argument("--calibrate", action="store_true", help="dry run: write nothing, only compare new vs existing grades")
    ap.add_argument("--fill-missing-only", action="store_true", help="v1 behaviour: never change existing grades, only add missing champions")
    ap.add_argument("--overwrite-ss", action="store_true", help="also recompute existing SS grades (kept by default)")
    ap.add_argument("--clean-invalid-existing", action="store_true", help="remove existing override champs that are not valid for the player role")
    ap.add_argument("--recent-seasons", default="", help="comma separated gol.gg season codes to weigh extra, e.g. S16,S15")
    ap.add_argument("--recent-weight", default=2.0, type=float, help="how many times recent-season games count (default 2.0)")
    ap.add_argument("--max-s", default=2, type=int)
    ap.add_argument("--max-a", default=6, type=int)
    ap.add_argument("--min-a", default=3, type=int)
    ap.add_argument("--fam-weight", default=2.6, type=float)
    ap.add_argument("--perf-weight", default=1.2, type=float)
    args = ap.parse_args()
    if not args.calibrate and not args.out:
        ap.error("--out is required unless --calibrate is used")

    params = Params(
        fam_weight=args.fam_weight,
        perf_weight=args.perf_weight,
        max_s=args.max_s,
        max_a=args.max_a,
        min_a=args.min_a,
        keep_ss=not args.overwrite_ss,
    )
    recent_seasons = [s.strip() for s in args.recent_seasons.split(",") if s.strip()]
    pinned: Dict[str, str] = {}
    if args.ids:
        pinned = {str(k): str(v) for k, v in json.loads(args.ids.read_text(encoding="utf-8")).items()}

    roles_by_slug, slug_by_norm_name = parse_champions(args.champions)
    players = parse_players(args.players)
    overrides_text = args.overrides.read_text(encoding="utf-8")
    existing = parse_existing_overrides(overrides_text)

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 champion-mastery-fill/2.0"})
    print("Downloading gol.gg player list...", file=sys.stderr)
    index = build_player_link_index(session, args.cache_dir)

    report: Dict[str, list] = {"updated": [], "skipped": [], "unresolved_champions": [], "no_block": []}
    pairs: List[Tuple[str, str]] = []
    csv_rows: List[list] = []
    used_ids: Dict[str, str] = {}
    new_dist: Counter = Counter()

    for idx, player in enumerate(players, 1):
        res, err = resolve_player(session, index, player, roles_by_slug, slug_by_norm_name, pinned, args.cache_dir, args.sleep)
        if not res:
            report["skipped"].append((player.id, err))
            print(f"[{idx}/{len(players)}] {player.id}: SKIPPED ({err.split(' ')[0] if err else '?'})", file=sys.stderr)
            continue
        gid = golgg_id_from_url(res.url)
        if gid:
            used_ids[player.id] = gid
        if res.unresolved:
            report["unresolved_champions"].append((player.id, sorted(set(res.unresolved))))

        pool = res.pool
        if recent_seasons and gid:
            recent_pools: List[List[ChampionStat]] = []
            for season in recent_seasons:
                try:
                    text, cached = http_get(session, player_url(gid, season), args.cache_dir)
                except Exception:  # noqa: BLE001
                    continue
                if not cached:
                    time.sleep(args.sleep)
                rp, _ = parse_champion_pool(text, slug_by_norm_name)
                if rp:
                    recent_pools.append(rp)
            pool = merge_recent(pool, recent_pools, args.recent_weight)

        page_text = BeautifulSoup(res.html, "html.parser").get_text("\n", strip=True)
        base_wr, base_kda = parse_overall_stats(page_text)
        fb_wr, fb_kda = pool_baseline(pool)
        base_wr = base_wr if base_wr is not None else fb_wr
        base_kda = base_kda if base_kda is not None else fb_kda
        total_games = sum(effective(s)[0] for s in pool)

        old_entries = dict(existing.get(player.id, {}))
        entries = dict(old_entries)
        if args.clean_invalid_existing:
            entries = {slug: grade for slug, grade in entries.items() if player.role in roles_by_slug.get(slug, set())}

        ss_slugs = {slug for slug, grade in entries.items() if grade == "SS"} if params.keep_ss else set()
        role_stats = [s for s in pool if player.role in roles_by_slug.get(s.slug, set()) and s.slug not in ss_slugs]
        graded = grade_player_pool(role_stats, total_games, base_wr, base_kda, params, reserved_top=len(ss_slugs))

        added = changed = 0
        for slug, row in graded.items():
            old = entries.get(slug)
            if old is not None and args.fill_missing_only:
                continue
            entries[slug] = row.grade
            if player.id in existing:
                new_dist[row.grade] += 1
            if old is None:
                added += 1
            else:
                if old != row.grade:
                    changed += 1
                if old != "SS":
                    pairs.append((old, row.grade))
            csv_rows.append([player.id, slug, row.st.games, row.st.winrate, row.st.kda if row.st.kda is not None else "",
                             old or "", row.grade, f"{row.score:.2f}", res.url])

        removed = len(old_entries) - len([s for s in old_entries if s in entries])
        if entries != old_entries:
            if player.id not in existing:
                report["no_block"].append(player.id)
            else:
                if not args.calibrate:
                    overrides_text, matched = replace_player_block(overrides_text, player.id, entries)
                    if not matched:
                        report["no_block"].append(player.id)
                        print(f"[{idx}/{len(players)}] {player.id}: block not found in overrides file", file=sys.stderr)
                        continue
                report["updated"].append((player.id, added, changed, removed, res.url))
        suffix = f", -{removed} invalid" if removed else ""
        print(f"[{idx}/{len(players)}] {player.id}: +{added} new, ~{changed} changed{suffix}", file=sys.stderr)

    if args.report_csv:
        with args.report_csv.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["player", "champion", "games", "winrate", "kda", "old_grade", "new_grade", "score", "golgg_url"])
            w.writerows(csv_rows)
    if args.write_ids:
        args.write_ids.write_text(json.dumps(used_ids, indent=2, ensure_ascii=False), encoding="utf-8")
    if not args.calibrate:
        args.out.write_text(overrides_text, encoding="utf-8")

    print("\nDONE")
    if args.calibrate:
        print("Dry run (--calibrate): nothing was written.")
    else:
        print(f"Wrote: {args.out}")
    print(f"Updated players: {len(report['updated'])}")
    print(f"Skipped players: {len(report['skipped'])}")
    print("New grades given: " + ", ".join(f"{g}={new_dist.get(g, 0)}" for g in ("S", "A", "B", "C", "D", "F")))
    print_comparison(pairs)
    if report["skipped"]:
        print("\nSkipped (fix with --ids if needed):")
        for item in report["skipped"]:
            print("  ", item)
    if report["no_block"]:
        print("\nPlayers with no block in the overrides file (not written):")
        for pid in report["no_block"]:
            print("  ", pid)
    if report["unresolved_champions"]:
        print("\nUnresolved champion names:")
        for item in report["unresolved_champions"]:
            print("  ", item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())