#!/usr/bin/env python3
"""
Fill missing champion mastery overrides from gol.gg.

Usage from repo root or any folder:
  python fill_champion_mastery_from_golgg.py \
    --champions /path/to/champions.ts \
    --players /path/to/players.ts \
    --overrides /path/to/championMasteryOverrides.ts \
    --out /path/to/championMasteryOverrides.updated.ts

What it does:
  - Reads champion roles from champions.ts.
  - Reads player names/slugs/roles from players.ts.
  - Preserves existing grades in championMasteryOverrides.ts.
  - Downloads gol.gg player pages with season=ALL, split=ALL, tournament=ALL.
  - Adds only missing champion entries, and only if the champion is valid for that player's role.
  - Includes all role-valid champions found on gol.gg, including low-sample picks.
  - Quotes champion slugs that contain '-'.

Notes:
  - This script needs normal internet access. The ChatGPT sandbox used to prepare it
    could not resolve gol.gg via Python/curl, so run it locally or in CI.
  - Player-name ambiguity can happen on gol.gg. Skipped or ambiguous players are
    written to the report printed at the end.
"""
from __future__ import annotations

import argparse
import html
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

GOLGG_BASE = "https://gol.gg/"
PLAYERS_LIST_URL = "https://gol.gg/players/list/season-ALL/split-ALL/tournament-ALL/"
GRADE_ORDER = {"F": 0, "D": 1, "C": 2, "B": 3, "A": 4, "S": 5, "SS": 6}


@dataclass(frozen=True)
class ChampionStat:
    slug: str
    games: int
    winrate: float
    kda: Optional[float]
    rank: int


@dataclass(frozen=True)
class PlayerInfo:
    id: str
    slug: str
    name: str
    role: str


def normalize_key(text: str) -> str:
    return re.sub(r"[^a-z0-9]", "", text.lower())


def quote_key(slug: str) -> str:
    return f'"{slug}"' if "-" in slug else slug


def parse_champions(path: Path) -> Tuple[Dict[str, set], Dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    roles_by_slug: Dict[str, set] = {}
    slug_by_norm_name: Dict[str, str] = {}

    # Split by createChampion blocks; keep this permissive for TS formatting changes.
    for block in re.findall(r"createChampion\(\{(.*?)\}\),", text, flags=re.S):
        id_m = re.search(r'id:\s*"([^"]+)"', block)
        roles_m = re.search(r"roles:\s*\[([^\]]*)\]", block, flags=re.S)
        if not id_m or not roles_m:
            continue
        slug = id_m.group(1)
        roles = set(re.findall(r'"([^"]+)"', roles_m.group(1)))
        roles_by_slug[slug] = roles
        name_m = re.search(r'name:\s*"([^"]+)"', block)
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


def build_player_link_index(session: requests.Session) -> Dict[str, List[str]]:
    r = session.get(PLAYERS_LIST_URL, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    links: Dict[str, List[str]] = {}
    for a in soup.find_all("a", href=True):
        href = a.get("href", "")
        name = a.get_text(" ", strip=True)
        if "player-stats" not in href or not name:
            continue
        url = urljoin(GOLGG_BASE + "players/list/season-ALL/split-ALL/tournament-ALL/", href)
        # Convert season-specific hrefs to all seasons/all tournaments/champion ALL.
        pid_m = re.search(r"player-stats/(\d+)/", url)
        if not pid_m:
            continue
        all_url = f"https://gol.gg/players/player-stats/{pid_m.group(1)}/season-ALL/split-ALL/tournament-ALL/champion-ALL/"
        links.setdefault(normalize_key(name), []).append(all_url)
    return links


def fetch_player_page_by_name(session: requests.Session, index: Dict[str, List[str]], player: PlayerInfo) -> Tuple[Optional[str], Optional[str]]:
    candidates = index.get(normalize_key(player.name), []) or index.get(normalize_key(player.slug), [])
    if not candidates:
        return None, "not_found_in_player_list"

    # Try candidates and pick the page whose H1-ish text matches the player name.
    for url in candidates:
        try:
            r = session.get(url, timeout=30)
            r.raise_for_status()
        except Exception:
            continue
        soup = BeautifulSoup(r.text, "html.parser")
        page_text = soup.get_text("\n", strip=True)
        if normalize_key(player.name) in normalize_key(page_text[:500]):
            return r.text, url
        # Some player names contain punctuation or casing differences; first candidate is usually correct.
        return r.text, url
    return None, "all_candidates_failed"


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


def grade_missing(stat: ChampionStat, overall_wr: Optional[float], overall_kda: Optional[float]) -> str:
    kda = stat.kda if stat.kda is not None else 0.0
    score = 0.0

    # Sample confidence.
    if stat.games >= 80: score += 2.0
    elif stat.games >= 50: score += 1.7
    elif stat.games >= 30: score += 1.35
    elif stat.games >= 18: score += 1.0
    elif stat.games >= 10: score += 0.55
    elif stat.games >= 5: score += 0.15
    else: score -= 0.45

    # Performance.
    if stat.winrate >= 75: score += 1.8
    elif stat.winrate >= 65: score += 1.3
    elif stat.winrate >= 58: score += 0.9
    elif stat.winrate >= 52: score += 0.45
    elif stat.winrate >= 45: score += 0.05
    elif stat.winrate < 25: score -= 1.1
    elif stat.winrate < 35: score -= 0.6

    if kda >= 7.0: score += 1.4
    elif kda >= 5.0: score += 1.0
    elif kda >= 4.0: score += 0.55
    elif kda >= 3.0: score += 0.2
    elif kda and kda < 1.5: score -= 0.7
    elif kda and kda < 2.2: score -= 0.35

    # Overall player context from left-side stats.
    if overall_wr is not None and overall_kda is not None:
        if overall_wr >= 60 and overall_kda >= 4.0: score += 0.35
        elif overall_wr < 40 and overall_kda < 2.7: score -= 0.35

    # User floor rule for top 6-8 most played champions.
    floor = None
    if stat.rank <= 8 and stat.games > 18 and (stat.winrate >= 29 or kda >= 2.9):
        floor = "B"

    if score >= 4.4 and stat.games >= 20:
        grade = "S"
    elif score >= 2.7:
        grade = "A"
    elif score >= 1.1:
        grade = "B"
    elif score >= -0.1:
        grade = "C"
    else:
        grade = "D"

    if stat.games <= 2 and GRADE_ORDER[grade] > GRADE_ORDER["C"]:
        grade = "C"
    if stat.games == 1 and stat.winrate == 0 and kda < 3:
        grade = "D"
    if floor and GRADE_ORDER[grade] < GRADE_ORDER[floor]:
        grade = floor
    return grade


def format_body(entries: Dict[str, str]) -> str:
    lines = []
    for slug in sorted(entries):
        lines.append(f'        {quote_key(slug)}: "{entries[slug]}",')
    return "\n".join(lines)


def replace_player_block(overrides_text: str, player_id: str, entries: Dict[str, str]) -> str:
    # Handles player: {}, "369": {}, and multi-line blocks.
    key_pat = ts_player_key_pattern(player_id)
    empty_pat = re.compile(rf"(\n\s{{4}}{key_pat}:\s*)\{{\s*\}}", re.S)
    m = empty_pat.search(overrides_text)
    if m:
        repl = f'{m.group(1)}{{\n{format_body(entries)}\n    }}'
        return overrides_text[:m.start()] + repl + overrides_text[m.end():]

    pat = re.compile(rf"(\n\s{{4}}{key_pat}:\s*\{{)(.*?)(\n\s{{4}}\}},)", re.S)
    m = pat.search(overrides_text)
    if not m:
        return overrides_text
    repl = f'{m.group(1)}\n{format_body(entries)}{m.group(3)}'
    return overrides_text[:m.start()] + repl + overrides_text[m.end():]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--champions", required=True, type=Path)
    ap.add_argument("--players", required=True, type=Path)
    ap.add_argument("--overrides", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--sleep", default=0.35, type=float, help="delay between gol.gg requests")
    ap.add_argument("--clean-invalid-existing", action="store_true", help="remove existing override champs that are not valid for the player role before adding new ones; useful if a previous run polluted the file")
    args = ap.parse_args()

    roles_by_slug, slug_by_norm_name = parse_champions(args.champions)
    players = parse_players(args.players)
    overrides_text = args.overrides.read_text(encoding="utf-8")
    existing = parse_existing_overrides(overrides_text)

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 champion-mastery-fill/1.0"})
    print("Downloading gol.gg player list...", file=sys.stderr)
    index = build_player_link_index(session)

    report = {"updated": [], "skipped": [], "unresolved_champions": []}
    for idx, player in enumerate(players, 1):
        html_text, url_or_err = fetch_player_page_by_name(session, index, player)
        if not html_text:
            report["skipped"].append((player.id, url_or_err))
            continue
        soup = BeautifulSoup(html_text, "html.parser")
        page_text = soup.get_text("\n", strip=True)
        overall_wr, overall_kda = parse_overall_stats(page_text)
        pool, unresolved = parse_champion_pool(html_text, slug_by_norm_name)
        if unresolved:
            report["unresolved_champions"].append((player.id, sorted(set(unresolved))))

        entries = dict(existing.get(player.id, {}))
        if args.clean_invalid_existing:
            entries = {slug: grade for slug, grade in entries.items() if player.role in roles_by_slug.get(slug, set())}
        before = len(entries)
        valid_added = 0
        for st in pool:
            if player.role not in roles_by_slug.get(st.slug, set()):
                continue
            if st.slug not in entries:
                entries[st.slug] = grade_missing(st, overall_wr, overall_kda)
                valid_added += 1
        cleaned_count = 0
        if args.clean_invalid_existing:
            original_entries = existing.get(player.id, {})
            cleaned_count = len(original_entries) - len(entries)
        if valid_added or cleaned_count:
            overrides_text = replace_player_block(overrides_text, player.id, entries)
            existing[player.id] = entries
            report["updated"].append((player.id, valid_added, before, len(entries), url_or_err))
        suffix = f", -{cleaned_count} invalid" if cleaned_count else ""
        print(f"[{idx}/{len(players)}] {player.id}: +{valid_added}{suffix}", file=sys.stderr)
        time.sleep(args.sleep)

    args.out.write_text(overrides_text, encoding="utf-8")
    print("\nDONE")
    print(f"Wrote: {args.out}")
    print(f"Updated players: {len(report['updated'])}")
    print(f"Skipped players: {len(report['skipped'])}")
    if report["skipped"]:
        print("Skipped:")
        for item in report["skipped"]:
            print("  ", item)
    if report["unresolved_champions"]:
        print("Unresolved champion names:")
        for item in report["unresolved_champions"]:
            print("  ", item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
