// Memoria sezonului (DRAFT_THINKING §7.3 / §7.4): „ori îl banezi, ori îți faci plan să-l bați”.

import { champions, championsById } from "@/app/data/champions";
import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import { GRADE_RANK, getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMatchupRelations } from "./championMatchups";
import { COMP_COUNTER_MATRIX, COMP_IDENTITIES, type CompIdentity } from "./compIdentity";
import { isLaneCounter, isStrongCounter } from "./matchupGrades";
import { getEnemySeasonSignatureThreat, historyConfidenceScale, smoothPlayerHistoryWinRate } from "./playerHistoryEvaluator";
import { DRAFT_THINKING_CONFIG } from "./draftThinkingConfig";
import { ROLE_ORDER } from "./draftTypes";
import { readTeamSeasonStore, type TeamChampionLine } from "./teamSeasonStorage";

const SEASON = DRAFT_THINKING_CONFIG.season;
const playersById = new Map(players.map((player) => [player.id, player]));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type SeasonChampionThreat = {
  /** 0..10 */
  threat: number;
  games: number;
  wins: number;
  /** Jucătorul actual care îl joacă (rolul cel mai jucat + roster). */
  playerId: string | null;
  role: Role | null;
};

function mainRole(line: TeamChampionLine): Role | null {
  let best: Role | null = null;
  for (const role of ROLE_ORDER) if ((line.byRole[role] ?? 0) > (best ? line.byRole[best] ?? 0 : 0)) best = role;
  return best;
}

/**
 * §7.3 — amenințarea de sezon a unei echipe pe un campion:
 * clamp((WR netezit − 0.5) × 16 × încredere + pickShare × 3 + formă × 1.5, 0, 10),
 * combinată cu amenințarea jucătorului (`getEnemySeasonSignatureThreat` × 0.8).
 */
export function getSeasonChampionThreat(
  teamSlug: string,
  championId: string,
  roster: Partial<Record<Role, string>>,
): SeasonChampionThreat {
  const record = readTeamSeasonStore()[teamSlug];
  const line = record?.champions[championId];
  const role = line ? mainRole(line) : null;
  const playerId = role ? roster[role] ?? null : null;
  const playerThreat = playerId ? getEnemySeasonSignatureThreat(playerId, championId) * SEASON.playerThreatFactor : 0;
  if (!record || !line || line.games < SEASON.minGames) {
    return { threat: clamp(playerThreat, 0, 10), games: line?.games ?? 0, wins: line?.wins ?? 0, playerId, role };
  }
  const smoothed = smoothPlayerHistoryWinRate(line.wins, line.games);
  const confidence = historyConfidenceScale(line.games);
  const pickShare = record.games ? line.games / record.games : 0;
  const recentForm = line.recentResults.length
    ? line.recentResults.reduce((sum, result) => sum + result, 0) / line.recentResults.length - 0.5
    : 0;
  const teamThreat = clamp((smoothed - 0.5) * 16 * confidence + pickShare * 3 + recentForm * 1.5, 0, 10);
  return { threat: Math.max(teamThreat, playerThreat), games: line.games, wins: line.wins, playerId, role };
}

/** Top campioni de sezon ai unei echipe (pentru scouting în UI și decizii). */
export function getSeasonFavorites(
  teamSlug: string,
  roster: Partial<Record<Role, string>>,
  limit = 3,
  isAvailable: (championId: string) => boolean = () => true,
): ({ championId: string } & SeasonChampionThreat)[] {
  const record = readTeamSeasonStore()[teamSlug];
  if (!record) return [];
  return Object.keys(record.champions)
    .filter(isAvailable)
    .map((championId) => ({ championId, ...getSeasonChampionThreat(teamSlug, championId, roster) }))
    .filter((entry) => entry.threat > 0)
    .sort((a, b) => b.threat - a.threat || b.games - a.games)
    .slice(0, limit);
}

/** Campionul e un favorit de sezon al echipei (contează la priority pick, §4.2)? */
export function isSeasonFavorite(teamSlug: string, championId: string, roster: Partial<Record<Role, string>>): boolean {
  return getSeasonChampionThreat(teamSlug, championId, roster).threat >= SEASON.threatThreshold;
}

export type SeasonThreatResponse =
  | { kind: "ban"; championId: string; threat: number; games: number; wins: number }
  | { kind: "plan"; championId: string; threat: number; games: number; wins: number; counterIds: string[]; counterGrades: Record<string, string> }
  | { kind: "ignore" };

/** Counterii noștri disponibili (strong / lane counter pe rolul lui), pe care jucătorul nostru îi are la ≥ B. */
export function getSeasonCounters(
  championId: string,
  role: Role | null,
  ownRoster: Partial<Record<Role, string>>,
  unavailable: ReadonlySet<string>,
): { counterIds: string[]; counterGrades: Record<string, string> } {
  const counterIds: string[] = [];
  const counterGrades: Record<string, string> = {};
  if (!role) return { counterIds, counterGrades };
  const player = ownRoster[role] ? playersById.get(ownRoster[role]!) : undefined;
  for (const champion of champions) {
    if (unavailable.has(champion.id) || champion.id === championId || !champion.roles.includes(role)) continue;
    const good = getMatchupRelations(champion.id, role, championId, role).good;
    if (!good || !(isStrongCounter(good) || isLaneCounter(good))) continue;
    const grade = player ? getChampionGrade(player, champion.id) : null;
    if (grade && GRADE_RANK[grade] < SEASON.counterMinGradeRank) continue;
    counterIds.push(champion.id);
    if (grade) counterGrades[champion.id] = grade;
  }
  return { counterIds, counterGrades };
}

/**
 * §7.4 — pentru fiecare campion inamic cu amenințare ≥ prag (încă disponibil), sortați desc:
 * `plan` dacă avem un counter disponibil cu jucătorul nostru ≥ B, altfel `ban`.
 */
export function getSeasonThreatResponse(args: {
  enemyTeamSlug: string;
  enemyRoster: Partial<Record<Role, string>>;
  ownRoster: Partial<Record<Role, string>>;
  unavailable: ReadonlySet<string>;
}): SeasonThreatResponse[] {
  const favorites = getSeasonFavorites(args.enemyTeamSlug, args.enemyRoster, 20, (id) => !args.unavailable.has(id));
  return favorites
    .filter((entry) => entry.threat >= SEASON.threatThreshold)
    .map((entry): SeasonThreatResponse => {
      const { counterIds, counterGrades } = getSeasonCounters(entry.championId, entry.role, args.ownRoster, args.unavailable);
      const base = { championId: entry.championId, threat: entry.threat, games: entry.games, wins: entry.wins };
      return counterIds.length ? { kind: "plan", ...base, counterIds, counterGrades } : { kind: "ban", ...base };
    });
}

/** Identitatea cu cel mai bun winrate a unei echipe în sezon (minim `identityMinGames` jocuri). */
export function getSeasonBestIdentity(teamSlug: string): CompIdentity | null {
  const identities = readTeamSeasonStore()[teamSlug]?.identities ?? {};
  let best: { identity: CompIdentity; rate: number } | null = null;
  for (const identity of COMP_IDENTITIES) {
    const stats = identities[identity];
    if (!stats || stats.games < SEASON.identityMinGames) continue;
    const rate = smoothPlayerHistoryWinRate(stats.wins, stats.games);
    if (!best || rate > best.rate) best = { identity, rate };
  }
  return best?.identity ?? null;
}

/** §7.4 (plan) — cât de bine bate planul identitatea preferată a inamicului în sezon (0..1). */
export function getSeasonEnemyIdentityFactor(plan: CompIdentity, enemyBest: CompIdentity | null): number {
  if (!enemyBest) return 0;
  return clamp((COMP_COUNTER_MATRIX[plan][enemyBest] + 1) / 2, 0, 1);
}

export const championName = (championId: string) => championsById[championId]?.name ?? championId;
