import { champions } from "@/app/data/champions";
import { players } from "@/app/data/players";
import { teams } from "@/app/data/teams";
import type { Role } from "@/app/types/champion";
import type {
  ActiveDraftSeries,
  DraftGameState,
  DraftSave,
  DraftSimulationResult,
} from "./draftTypes";
import {
  evaluatePlayerPower,
  evaluateTeamDraft,
  getChampionById,
  getPlayerById,
} from "./draftEvaluator";
import { resolveRoleAssignments } from "./draftRoleResolver";
import { ROLE_ORDER } from "./draftTypes";
import type { MatchProfile, PhaseBreakdown, PlayerGameScore, TeamPhaseScores } from "./matchSimulationTypes";
import { computeTendencyEvents } from "./tendencyEventSystem";
import { computeTeamChemistry, getPlayerPersonalityModifiers } from "./personalitySystem";
import { evaluateTeamfight } from "./teamfightSystem";
import { getChampionRoleProfile } from "./championProfileSystem";
import { evaluateLanePhase } from "./laneEvaluator";
import {
  average,
  championExecutionDifficulty,
  championMetaPower,
  clamp,
  getChampionByIdSafe,
  getTeamPhaseStrength,
  getTeamChampionPhasePower,
  getPhaseIdentityAlignment,
  lateGameScore,
  objectiveControlScore,
  playerChampionArchetypeFit,
  playerChampionDraftFit,
  playerClutchScore,
  playerConsistencyScore,
  playerExecutionScore,
  playerLaningScore,
  playerMacroScore,
  playerTeamfightScore,
  round1,
  seededNoise,
  teamAssignmentQuality,
} from "./matchSimulationUtils";
import {
  getPlayerChampionHistoryBonus,
  getPlayerChampionMatchupHistoryBonus,
} from "./playerHistoryEvaluator";
import { updatePlayerHistoryFromResolvedGame } from "./playerHistoryStorage";
import { recordGames } from "./playerSeasonStorage";
import {
  computeLaneSnowball,
  getChampionPowerSpikeMultiplier,
  simulateObjectiveFights,
  rollMacroMistake,
  getChampionMasteryBonus,
} from "./simulationEventsSystem";
import {
  simulateJunglePathing,
  computeDraftSpikeWindows,
  checkComebackReversal,
} from "./advancedDraftReading";

const teamsBySlug = new Map(teams.map((team) => [team.slug, team]));
const playersById = new Map(players.map((player) => [player.id, player]));
const championMap = new Map(champions.map((champion) => [champion.id, champion]));

type MatchSimulationInput = {
  game: DraftGameState;
  series: ActiveDraftSeries;
  save: DraftSave | null;
};

function getTeamRoster(teamSlug: string, save: DraftSave | null): Partial<Record<Role, string>> {
  const team = teamsBySlug.get(teamSlug) ?? null;

  const typedTeam = team as
    | {
      slug?: string;
      roster?: Partial<Record<Role, string>>;
    }
    | null;

  const baseRoster =
    typedTeam?.roster && typeof typedTeam.roster === "object" ? typedTeam.roster : {};

  if (!save) return baseRoster;
  if (save.updatedTeamRosters?.[teamSlug]) return save.updatedTeamRosters[teamSlug];
  if (save.controlledTeamSlug === teamSlug && save.roster) return save.roster;
  return baseRoster;
}

function getGameTeamSlugsForGameNumber(series: ActiveDraftSeries, gameNumber: number) {
  const blueTeamSlug = series.games[0]?.number === 1 ? series.blueTeamSlug : series.blueTeamSlug;
  const redTeamSlug = series.games[0]?.number === 1 ? series.redTeamSlug : series.redTeamSlug;

  const swapCountFromCurrent = Math.max(0, series.currentGameNumber - gameNumber);
  if (swapCountFromCurrent % 2 === 1) {
    return {
      blueTeamSlug: series.redTeamSlug,
      redTeamSlug: series.blueTeamSlug,
    };
  }

  return {
    blueTeamSlug,
    redTeamSlug,
  };
}

function computeSeriesScoreAfterGame(input: MatchSimulationInput, winnerSide: "blue" | "red") {
  let blueWins = 0;
  let redWins = 0;

  for (const game of input.series.games) {
    if (game.number === input.game.number) continue;
    if (!game.completed || !game.winnerSide) continue;

    const gameTeams = getGameTeamSlugsForGameNumber(input.series, game.number);
    const winnerTeamSlug =
      game.winnerSide === "blue" ? gameTeams.blueTeamSlug : gameTeams.redTeamSlug;

    if (winnerTeamSlug === input.series.blueTeamSlug) blueWins += 1;
    if (winnerTeamSlug === input.series.redTeamSlug) redWins += 1;
  }

  const currentWinnerTeamSlug =
    winnerSide === "blue" ? input.series.blueTeamSlug : input.series.redTeamSlug;

  if (currentWinnerTeamSlug === input.series.blueTeamSlug) blueWins += 1;
  if (currentWinnerTeamSlug === input.series.redTeamSlug) redWins += 1;

  return { blueWins, redWins };
}

// ─── FIX MOMENTUM: bonus psihologic bazat pe victoriile anterioare din serie ─
// O echipa care conduce 2-0 are un mic avantaj de moral/incredere.
// O echipa care pierde 0-2 are o mica penalitate (presiune).
// Efectul e intentionat mic (max ±0.45) ca sa nu domine, dar sa existe.
function computeSeriesMomentum(
  series: ActiveDraftSeries,
  side: "blue" | "red",
  currentGameNumber: number
): number {
  let wins = 0;
  let losses = 0;

  for (const game of series.games) {
    if (game.number >= currentGameNumber) continue;
    if (!game.completed || !game.winnerSide) continue;

    const gameTeams = getGameTeamSlugsForGameNumber(series, game.number);
    const winnerTeamSlug =
      game.winnerSide === "blue" ? gameTeams.blueTeamSlug : gameTeams.redTeamSlug;
    const sideTeamSlug =
      side === "blue" ? series.blueTeamSlug : series.redTeamSlug;

    if (winnerTeamSlug === sideTeamSlug) wins += 1;
    else losses += 1;
  }

  // Net wins * 0.15 per joc: 2-0 → +0.30, 0-2 → -0.30, 1-1 → 0
  return clamp((wins - losses) * 0.15, -0.45, 0.45);
}

function computeExecutionTeamScore(
  roster: Partial<Record<Role, string>>,
  assignments: Partial<Record<Role, string>>
) {
  const values = ROLE_ORDER.map((role) => {
    const playerId = roster[role] ?? null;
    const championId = assignments[role] ?? null;
    const playerExec = playerExecutionScore(playerId);
    const archetypeFit = playerChampionArchetypeFit(playerId, championId);
    const champDifficulty = championExecutionDifficulty(getChampionByIdSafe(championId));
    return clamp(playerExec * 0.58 + archetypeFit * 0.16 + (10 - champDifficulty) * 0.26, 0, 10);
  });

  return round1(average(values));
}

function computeClutchTeamScore(roster: Partial<Record<Role, string>>) {
  return round1(
    average(
      ROLE_ORDER.map((role) => {
        const playerId = roster[role] ?? null;
        return clamp(
          playerClutchScore(playerId) * 0.62 +
          playerConsistencyScore(playerId) * 0.2 +
          playerTeamfightScore(playerId) * 0.18,
          0,
          10
        );
      })
    )
  );
}

function computeMetaAverage(assignments: Partial<Record<Role, string>>) {
  return round1(average(ROLE_ORDER.map((role) => championMetaPower(assignments[role] ?? null))));
}

function computeStarPower(playerId: string | null) {
  const player = playerId ? getPlayerById(playerId) : null;
  if (!player) return 5;

  const stats = player.stats;
  const advanced = player.advancedProfile?.primary;
  const advancedStar = advanced
    ? (advanced.mechanics * 0.14 +
      advanced.teamfighting * 0.16 +
      advanced.mapAwareness * 0.12 +
      advanced.clutchFactor * 0.2 +
      advanced.currentForm * 0.18 +
      advanced.metaReadiness * 0.2) /
    10
    : 5;

  const legacyStar =
    stats.mec * 0.2 +
    stats.mac * 0.15 +
    stats.tfg * 0.15 +
    stats.con * 0.15 +
    stats.iq * 0.15 +
    stats.clt * 0.2;

  return clamp(legacyStar * 0.38 + advancedStar * 0.62, 0, 10);
}

function determineMatchProfile(args: {
  blueAssignments: Partial<Record<Role, string>>;
  redAssignments: Partial<Record<Role, string>>;
  blueDraft: ReturnType<typeof evaluateTeamDraft>;
  redDraft: ReturnType<typeof evaluateTeamDraft>;
  laneVolatility: number;
}): MatchProfile {
  const allBlue = ROLE_ORDER.map((role) => args.blueAssignments[role] ?? null).filter(
    Boolean
  ) as string[];
  const allRed = ROLE_ORDER.map((role) => args.redAssignments[role] ?? null).filter(
    Boolean
  ) as string[];

  const blueLanePrio = allBlue
    .map((id) => getChampionById(id))
    .filter(Boolean)
    .flatMap((champion) => champion?.offers ?? [])
    .filter((offer) =>
      ["earlyPrio", "roamPressure", "objectiveControl"].includes(String(offer.type))
    )
    .reduce((sum, offer) => sum + offer.strength, 0);

  const redLanePrio = allRed
    .map((id) => getChampionById(id))
    .filter(Boolean)
    .flatMap((champion) => champion?.offers ?? [])
    .filter((offer) =>
      ["earlyPrio", "roamPressure", "objectiveControl"].includes(String(offer.type))
    )
    .reduce((sum, offer) => sum + offer.strength, 0);

  const maxPrio = Math.max(blueLanePrio, redLanePrio);
  const maxScaling = Math.max(
    args.blueDraft.rangeProfileScore +
    args.blueDraft.protectionScore +
    args.blueDraft.frontlineScore,
    args.redDraft.rangeProfileScore +
    args.redDraft.protectionScore +
    args.redDraft.frontlineScore
  );

  if (maxPrio >= 12 || args.laneVolatility >= 6.8) return "snowball";
  if (maxScaling >= 20 && args.laneVolatility <= 5.4) return "scaling";
  return "standard";
}

function getProfileWeights(profile: MatchProfile) {
  switch (profile) {
    case "snowball":
      return { lane: 1.18, objectives: 1.18, execution: 1.05, late: 0.82, clutch: 0.94 };
    case "scaling":
      return { lane: 0.88, objectives: 0.94, execution: 0.96, late: 1.22, clutch: 1.14 };
    default:
      return { lane: 1, objectives: 1, execution: 1, late: 1, clutch: 1 };
  }
}

function computePhaseBreakdown(args: {
  roster: Partial<Record<Role, string>>;
  assignments: Partial<Record<Role, string>>;
  laneScore: number;
  draftPower: number;
  matchProfile: MatchProfile;
  momentum: number;
  seedRoot: string;
  side: "blue" | "red";
  tendencyBonus?: { earlyBonus: number; midBonus: number; lateBonus: number };
  teamfightEdge?: number;
}): PhaseBreakdown {

  const { roster, assignments, laneScore, draftPower, matchProfile, momentum, seedRoot, side, tendencyBonus, teamfightEdge } = args;

  // ─── EARLY (0-15 min): lane + early player/champion power ─────────────
  const earlyPlayerStr = getTeamPhaseStrength(roster, assignments, "early");
  const earlyChampPower = getTeamChampionPhasePower(assignments, "early");
  const earlyTotal = clamp(
    laneScore * 0.38 + earlyPlayerStr * 0.28 + earlyChampPower * 0.22 +
    draftPower * 0.08 + momentum * 0.5 +
    seededNoise(`${seedRoot}:${side}:early`, 0.3) +
    (tendencyBonus?.earlyBonus ?? 0),
    0, 10
  );

  // ─── MID (15-25 min): objectives + carry-over from early ──────────────
  const midPlayerStr = getTeamPhaseStrength(roster, assignments, "mid");
  const midChampPower = getTeamChampionPhasePower(assignments, "mid");
  const earlyCarryOver = (earlyTotal - 5) * 0.2;
  const midTotal = clamp(
    midPlayerStr * 0.30 + midChampPower * 0.24 + draftPower * 0.14 +
    earlyCarryOver + momentum * 0.3 +
    seededNoise(`${seedRoot}:${side}:mid`, 0.28) +
    (tendencyBonus?.midBonus ?? 0) +
    (teamfightEdge ?? 0) * 0.35,
    0, 10
  );

  // ─── LATE (25+ min): teamfight + clutch + carry-over from mid ─────────
  const latePlayerStr = getTeamPhaseStrength(roster, assignments, "late");
  const lateChampPower = getTeamChampionPhasePower(assignments, "late");
  const midCarryOver = (midTotal - 5) * 0.15;
  const lateTotal = clamp(
    latePlayerStr * 0.32 + lateChampPower * 0.26 + draftPower * 0.12 +
    midCarryOver + momentum * 0.2 +
    seededNoise(`${seedRoot}:${side}:late`, 0.32) +
    (tendencyBonus?.lateBonus ?? 0) +
    (teamfightEdge ?? 0) * 0.65,
    0, 10

  );

  return {
    early: { playerStrength: round1(earlyPlayerStr), championPower: round1(earlyChampPower), phaseTotal: round1(earlyTotal) },
    mid: { playerStrength: round1(midPlayerStr), championPower: round1(midChampPower), phaseTotal: round1(midTotal) },
    late: { playerStrength: round1(latePlayerStr), championPower: round1(lateChampPower), phaseTotal: round1(lateTotal) },
  };
}

function getPhaseWeights(profile: MatchProfile) {
  switch (profile) {
    case "snowball": return { early: 0.45, mid: 0.35, late: 0.20 };
    case "scaling": return { early: 0.20, mid: 0.30, late: 0.50 };
    default: return { early: 0.30, mid: 0.35, late: 0.35 };
  }
}


function buildTeamPhaseScores(args: {
  draft: number;
  playerPower: number;
  assignment: number;
  lane: number;
  objectives: number;
  execution: number;
  clutch: number;
  late: number;
  rng: number;
  momentum: number;
  profile?: MatchProfile;
  phases: PhaseBreakdown;
}): TeamPhaseScores {
  const weights = getProfileWeights(args.profile ?? "standard");
  const phaseW = getPhaseWeights(args.profile ?? "standard");

  const phaseComposite = clamp(
    args.phases.early.phaseTotal * phaseW.early +
    args.phases.mid.phaseTotal * phaseW.mid +
    args.phases.late.phaseTotal * phaseW.late,
    0, 10
  );

  const categoryTotal = clamp(
    args.draft * 0.19 +
    args.playerPower * 0.12 +
    args.assignment * 0.08 +
    args.lane * 0.10 * weights.lane +
    args.objectives * 0.08 * weights.objectives +
    args.execution * 0.08 * weights.execution +
    args.clutch * 0.06 * weights.clutch +
    args.late * 0.05 * weights.late +
    args.momentum +
    args.rng,
    0, 10
  );

  const total = clamp(categoryTotal * 0.60 + phaseComposite * 0.40, 0, 10);

  return {
    draft: round1(args.draft),
    playerPower: round1(args.playerPower),
    assignment: round1(args.assignment),
    lane: round1(args.lane),
    objectives: round1(args.objectives),
    execution: round1(args.execution),
    clutch: round1(args.clutch),
    late: round1(args.late),
    total: round1(total),
    phases: args.phases,
  };
}


function determineFlow(
  blueTotal: number,
  redTotal: number,
  laneGap: number,
  volatility: number,
  bluePhases?: PhaseBreakdown,
  redPhases?: PhaseBreakdown
) {
  const diff = Math.abs(blueTotal - redTotal);

  if (bluePhases && redPhases) {
    const earlyGap = Math.abs(bluePhases.early.phaseTotal - redPhases.early.phaseTotal);
    const lateGap = Math.abs(bluePhases.late.phaseTotal - redPhases.late.phaseTotal);
    const earlyWinner = bluePhases.early.phaseTotal > redPhases.early.phaseTotal ? "blue" : "red";
    const lateWinner = bluePhases.late.phaseTotal > redPhases.late.phaseTotal ? "blue" : "red";

    if (earlyGap >= 1.5 && lateGap >= 1.0 && earlyWinner !== lateWinner) return "comeback" as const;
    if (earlyGap >= 1.8 && diff >= 1.2) return "stomp" as const;
    if (earlyGap <= 0.4 && lateGap <= 0.4 && diff <= 0.5) return "late-decider" as const;
  }

  if (diff >= 1.8 && laneGap >= 1.2) return "stomp" as const;
  if (diff >= 1.1) return "controlled" as const;
  if (volatility >= 6.5 && diff <= 0.8) return "comeback" as const;
  if (diff <= 0.45) return "late-decider" as const;
  return "back-and-forth" as const;
}


function buildReason(args: {
  winnerSide: "blue" | "red";
  blueScores: TeamPhaseScores;
  redScores: TeamPhaseScores;
}) {
  const winner = args.winnerSide === "blue" ? args.blueScores : args.redScores;
  const loser = args.winnerSide === "blue" ? args.redScores : args.blueScores;

  const deltas = [
    { value: winner.draft - loser.draft, label: "better draft value" },
    { value: winner.playerPower - loser.playerPower, label: "stronger player level" },
    { value: winner.lane - loser.lane, label: "stronger lane phase" },
    { value: winner.objectives - loser.objectives, label: "cleaner objective setup" },
    { value: winner.execution - loser.execution, label: "easier execution" },
    { value: winner.clutch - loser.clutch, label: "better clutch under pressure" },
    { value: winner.late - loser.late, label: "stronger late-game closeout" },
    { value: winner.phases.early.phaseTotal - loser.phases.early.phaseTotal, label: "early game dominance" },
    { value: winner.phases.mid.phaseTotal - loser.phases.mid.phaseTotal, label: "mid game control" },
    { value: winner.phases.late.phaseTotal - loser.phases.late.phaseTotal, label: "late game scaling advantage" },
  ].sort((a, b) => b.value - a.value);

  return deltas
    .slice(0, 2)
    .map((entry) => entry.label)
    .join(" + ");
}


function buildPlayerScores(args: {
  winnerSide: "blue" | "red";
  blueRoster: Partial<Record<Role, string>>;
  redRoster: Partial<Record<Role, string>>;
  assignmentsBlue: Partial<Record<Role, string>>;
  assignmentsRed: Partial<Record<Role, string>>;
  blueDraftScore: number;
  redDraftScore: number;
  lane: ReturnType<typeof evaluateLanePhase>;
  closeness: number;
  seriesId: string;
  gameNumber: number;
  // UPGRADE 10+11: team totals for win dominance + bad team performance
  scoreDiff: number;
  blueTeamTotal: number;
  redTeamTotal: number;
}): PlayerGameScore[] {
  const result: PlayerGameScore[] = [];

  for (const role of ROLE_ORDER) {
    const laneData = args.lane.roles.find((entry) => entry.role === role) ?? null;

    const entries = [
      {
        side: "blue" as const,
        playerId: args.blueRoster[role] ?? null,
        championId: args.assignmentsBlue[role] ?? null,
        laneScore: laneData?.blueScore ?? 5,
        draftScore: args.blueDraftScore,
      },
      {
        side: "red" as const,
        playerId: args.redRoster[role] ?? null,
        championId: args.assignmentsRed[role] ?? null,
        laneScore: laneData?.redScore ?? 5,
        draftScore: args.redDraftScore,
      },
    ];

    for (const entry of entries) {
      if (!entry.playerId || !entry.championId) continue;

      const player = getPlayerById(entry.playerId);
      const champion = getChampionById(entry.championId);
      if (!player || !champion) continue;

      const fit = playerChampionDraftFit(entry.playerId, entry.championId);
      const champRoleProfile = getChampionRoleProfile(getChampionById(entry.championId), role);
      const clutch = playerClutchScore(entry.playerId);
      const execution = playerExecutionScore(entry.playerId);
      const laning = playerLaningScore(entry.playerId);
      const macro = playerMacroScore(entry.playerId);
      const teamfight = playerTeamfightScore(entry.playerId);
      const consistency = playerConsistencyScore(entry.playerId);
      const archetypeFit = playerChampionArchetypeFit(entry.playerId, entry.championId);
      const earlyAlign = getPhaseIdentityAlignment(entry.playerId, entry.championId, role, "early");
      const midAlign = getPhaseIdentityAlignment(entry.playerId, entry.championId, role, "mid");
      const lateAlign = getPhaseIdentityAlignment(entry.playerId, entry.championId, role, "late");
      const phaseAlignMod = (earlyAlign * 0.3 + midAlign * 0.35 + lateAlign * 0.35) * 0.12;
      const starPower = computeStarPower(entry.playerId);
      const champProfile = getChampionRoleProfile(getChampionById(entry.championId), role);
      const champTags = new Set(champProfile?.tags ?? []);
      const personality = getPlayerPersonalityModifiers(entry.playerId, champTags, args.closeness);

      // ═══ UPGRADE 11: Tight realistic distribution ═══════════════════
      // Goal: average pro game most players 5.5-7.5
      //       stars 7.5-8.5, hard carry (rare) 8.5-9.3
      //       10.0 reserved ONLY for perfect storm (carry event + lucky RNG + dominant win)

      // Per-player variance — each player rolls own day
      const personalRng = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${role}:${entry.side}:${entry.playerId}:personal`,
        1.3 * personality.volatilityRngScale
      );

      // Win dominance scaling — close wins ≠ stomps
      const dominance = clamp(Math.abs(args.scoreDiff) / 3, 0, 1);
      // REDUCED: 0.8 / -0.7 (was 1.0 / -0.8)
      const baseWinSwing = entry.side === args.winnerSide ? 0.8 : -0.7;
      // Close games: 50% swing. Stomps: 115% swing.
      const winModifier = baseWinSwing * (0.5 + dominance * 0.65);

      // Standard modifiers — further reduced
      const laneModifier = (entry.laneScore - 5) * 0.16;
      const draftModifier = (entry.draftScore - 5) * 0.09;
      const fitModifier = (fit - 5) * 0.12;
      const executionModifier = (execution - 5) * 0.08;
      const clutchModifier = (clutch - 5) * 0.06;
      const laneSkillModifier = (laning - 5) * 0.06;
      const macroModifier = (macro - 5) * 0.05;
      const teamfightModifier = (teamfight - 5) * 0.06;
      const consistencyModifier = (consistency - 5) * 0.04;
      const archetypeModifier = (archetypeFit - 5) * 0.06;
      const closeGameModifier = args.closeness * (clutch - 5) * 0.06 * personality.composureClutchScale;
      const starModifier = (starPower - 5) * 0.10;

      // Champion RNG — small, most variance is in personalRng
      const rng = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${role}:${entry.side}:${entry.playerId}:${entry.championId}`,
        0.30 * personality.volatilityRngScale
      );

      const impact = clamp(
        entry.laneScore * 0.2 +
        fit * 0.18 +
        clutch * 0.12 +
        execution * 0.15 +
        teamfight * 0.15 +
        macro * 0.08 +
        starPower * 0.12,
        0,
        10
      );
      const stability = clamp(
        fit * 0.26 + execution * 0.22 + clutch * 0.18 + consistency * 0.22 + archetypeFit * 0.12,
        0,
        10
      );
      const carryFactor = clamp(
        impact * 0.42 +
        starPower * 0.16 +
        laning * 0.14 +
        teamfight * 0.16 +
        archetypeFit * 0.12 +
        personality.greedCarryAmplifier * 3,
        0,
        10
      );
      const mistakeRisk = clamp(
        10 -
        (execution * 0.3 + fit * 0.22 + clutch * 0.16 + consistency * 0.2 + macro * 0.12) +
        personality.greedRiskAmplifier * 3,
        0,
        10
      );

      // Carry/throw events — reduced magnitudes
      let carryEventBonus = 0;
      let throwEventPenalty = 0;

      // Stricter threshold: needs carryFactor >= 8 AND very lucky RNG
      const isCarryEvent = carryFactor >= 8.0 && personalRng > 0.55;
      // Stricter threshold: needs mistakeRisk >= 6.5 AND very unlucky RNG
      const isThrowEvent = mistakeRisk >= 6.5 && personalRng < -0.55;

      if (isCarryEvent) {
        // Reduced: 0.8 win / 0.4 loss (was 1.2 / 0.6)
        carryEventBonus = entry.side === args.winnerSide ? 0.8 : 0.4;
      }
      if (isThrowEvent) {
        // Reduced: -0.8 win / -1.3 loss (was -1.0 / -1.6)
        throwEventPenalty = entry.side === args.winnerSide ? -0.8 : -1.3;
      }

      // Bad team game modifier — if whole team underperformed, individuals feel it
      const teamTotal = entry.side === "blue" ? args.blueTeamTotal : args.redTeamTotal;
      const teamPerformanceMod = clamp((teamTotal - 5.5) * 0.14, -0.55, 0.55);

      // UPGRADE 12: Macro mistake event (12-18% chance per player)
      const macroMistake = rollMacroMistake({
        player,
        playerId: entry.playerId,
        seriesId: args.seriesId,
        gameNumber: args.gameNumber,
        role,
        side: entry.side,
      });
      const macroMistakePenalty = macroMistake.occurred ? -macroMistake.severity : 0;

      // UPGRADE 12: Champion mastery bonus (up to +1.0 for deep signature)
      const masteryBonus = getChampionMasteryBonus(entry.playerId, entry.championId);

      // BASE LOWERED: 4.2 (was 4.6)
      const rawScore =
        4.2 +
        winModifier +
        teamPerformanceMod +
        laneModifier +
        draftModifier +
        fitModifier +
        executionModifier +
        clutchModifier +
        laneSkillModifier +
        macroModifier +
        teamfightModifier +
        consistencyModifier +
        archetypeModifier +
        phaseAlignMod +
        closeGameModifier +
        starModifier +
        personalRng +
        carryEventBonus +
        throwEventPenalty +
        macroMistakePenalty +
        masteryBonus +
        rng;

      // ─── CRITICAL FIX: Soft cap above 9.0 ──────────────────────────
      // Without compression, rawScore values of 10.2, 10.5, 11.0 all become
      // exactly 10.0 after clamp → that's why everyone scored 10.0.
      // With compression, rawScore 10.5 becomes ~9.4, 11.5 becomes ~9.6.
      // 10.0 is now reserved only for truly exceptional games.
      let finalScore = rawScore;
      if (rawScore > 9.0 && !isCarryEvent) {
        // No carry event: heavy compression above 9.0
        const excess = rawScore - 9.0;
        finalScore = 9.0 + Math.log(1 + excess) * 0.3;
      } else if (rawScore > 9.3 && isCarryEvent) {
        // With carry event: compression above 9.3 (hard carries can still hit 9.5+)
        const excess = rawScore - 9.3;
        finalScore = 9.3 + Math.log(1 + excess) * 0.45;
      } else if (rawScore < 2.5) {
        // Symmetric floor compression
        const deficit = 2.5 - rawScore;
        finalScore = 2.5 - Math.log(1 + deficit) * 0.6;
      }

      const score = clamp(finalScore, 1, 10);

      // ─── Note thresholds — calibrated for tight distribution ────────
      let note: string = "solid game";
      if (macroMistake.occurred && macroMistake.affectsTeam) note = "cost the team";
      else if (macroMistake.occurred) note = "macro mistake";
      else if (isCarryEvent && score >= 9.0) note = "hard carry";
      else if (isThrowEvent && score <= 4.2) note = "threw the game";
      else if (score >= 9.0) note = "exceptional";
      else if (score >= 8.0) note = "high impact";
      else if (score >= 7.0) note = "strong performance";
      else if (score >= 6.0) note = "stable";
      else if (score >= 5.0) note = "quiet game";
      else if (score >= 4.0) note = "struggled";
      else note = "major liability";

      result.push({
        side: entry.side,
        role,
        playerId: entry.playerId,
        playerName: player.name,
        championId: entry.championId,
        championName: champion.name,
        score: round1(score),
        laneScore: round1(entry.laneScore),
        draftFit: round1(fit),
        clutch: round1(clutch),
        impact: round1(impact),
        stability: round1(stability),
        carryFactor: round1(carryFactor),
        mistakeRisk: round1(mistakeRisk),
        note,
      });
    }
  }

  return result.sort((a, b) => {
    const sideOrder = a.side.localeCompare(b.side);
    if (sideOrder !== 0) return sideOrder;
    return ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role);
  });
}

export function simulateFullMatch(input: MatchSimulationInput): DraftSimulationResult {
  const blueRoster = getTeamRoster(input.series.blueTeamSlug, input.save);
  const redRoster = getTeamRoster(input.series.redTeamSlug, input.save);

  const assignmentsBlue = resolveRoleAssignments(input.game.picksBlue, blueRoster);
  const assignmentsRed = resolveRoleAssignments(input.game.picksRed, redRoster);

  const blueChampionIds = Object.values(assignmentsBlue).filter(Boolean) as string[];
  const redChampionIds = Object.values(assignmentsRed).filter(Boolean) as string[];

  const blueDraftEval = evaluateTeamDraft({
    side: "blue",
    team: teamsBySlug.get(input.series.blueTeamSlug) ?? null,
    roster: blueRoster,
    playersById,
    championIds: blueChampionIds,
    enemyChampionIds: redChampionIds,
    championMap,
  });

  const redDraftEval = evaluateTeamDraft({
    side: "red",
    team: teamsBySlug.get(input.series.redTeamSlug) ?? null,
    roster: redRoster,
    playersById,
    championIds: redChampionIds,
    enemyChampionIds: blueChampionIds,
    championMap,
  });

  const bluePlayerPower = evaluatePlayerPower(blueRoster, assignmentsBlue);
  const redPlayerPower = evaluatePlayerPower(redRoster, assignmentsRed);

  const lane = evaluateLanePhase({
    blueRoster,
    redRoster,
    assignmentsBlue,
    assignmentsRed,
  });

  // UPGRADE 13: Jungle pathing events — discrete ganks modify lane scores
  const jungleEvents = simulateJunglePathing({
    blueJunglerId: assignmentsBlue.jungle ?? null,
    redJunglerId: assignmentsRed.jungle ?? null,
    blueLaneScores: {
      top: lane.roles.find((r) => r.role === "top")?.blueScore ?? 5,
      mid: lane.roles.find((r) => r.role === "mid")?.blueScore ?? 5,
      bot: lane.roles.find((r) => r.role === "adc")?.blueScore ?? 5,
    },
    redLaneScores: {
      top: lane.roles.find((r) => r.role === "top")?.redScore ?? 5,
      mid: lane.roles.find((r) => r.role === "mid")?.redScore ?? 5,
      bot: lane.roles.find((r) => r.role === "adc")?.redScore ?? 5,
    },
    blueJunglerMacro: playerMacroScore(blueRoster.jungle ?? null),
    redJunglerMacro: playerMacroScore(redRoster.jungle ?? null),
    seriesId: input.series.seriesId,
    gameNumber: input.game.number,
  });

  // Apply gank swings to lane roles
  for (const entry of lane.roles) {
    if (entry.role === "top") {
      entry.blueScore = clamp(entry.blueScore + jungleEvents.blueTopSwing, 0, 10);
      entry.redScore = clamp(entry.redScore + jungleEvents.redTopSwing, 0, 10);
    } else if (entry.role === "mid") {
      entry.blueScore = clamp(entry.blueScore + jungleEvents.blueMidSwing, 0, 10);
      entry.redScore = clamp(entry.redScore + jungleEvents.redMidSwing, 0, 10);
    } else if (entry.role === "adc" || entry.role === "support") {
      // Bot = adc + support share the swing
      entry.blueScore = clamp(entry.blueScore + jungleEvents.blueBotSwing * 0.5, 0, 10);
      entry.redScore = clamp(entry.redScore + jungleEvents.redBotSwing * 0.5, 0, 10);
    }
  }

  // Recompute lane totals from updated role scores
  lane.blueScore = round1((lane.roles.reduce((s, r) => s + r.blueScore, 0)) / lane.roles.length);
  lane.redScore = round1((lane.roles.reduce((s, r) => s + r.redScore, 0)) / lane.roles.length);

  const blueAssignment = teamAssignmentQuality(blueRoster, assignmentsBlue);
  const redAssignment = teamAssignmentQuality(redRoster, assignmentsRed);

  const blueObjectives = objectiveControlScore(blueChampionIds);
  const redObjectives = objectiveControlScore(redChampionIds);

  const blueExecution = computeExecutionTeamScore(blueRoster, assignmentsBlue);
  const redExecution = computeExecutionTeamScore(redRoster, assignmentsRed);

  const blueClutch = computeClutchTeamScore(blueRoster);
  const redClutch = computeClutchTeamScore(redRoster);

  const blueLate = lateGameScore(
    blueChampionIds,
    Object.values(blueRoster).filter(Boolean) as string[]
  );
  const redLate = lateGameScore(
    redChampionIds,
    Object.values(redRoster).filter(Boolean) as string[]
  );

  const blueDraftComposite = clamp(
    blueDraftEval.draftPower * 0.68 +
    computeMetaAverage(assignmentsBlue) * 0.22 +
    bluePlayerPower * 0.1,
    0,
    10
  );
  const redDraftComposite = clamp(
    redDraftEval.draftPower * 0.68 +
    computeMetaAverage(assignmentsRed) * 0.22 +
    redPlayerPower * 0.1,
    0,
    10
  );

  const seedRoot = `${input.series.seriesId}:${input.game.number}`;
  const volatility = round1(
    clamp(lane.volatility * 0.55 + Math.abs(blueExecution - redExecution) * 0.45, 1, 10)
  );
  const blueRng = seededNoise(`${seedRoot}:blue`, 0.42 + volatility * 0.022);
  const redRng = seededNoise(`${seedRoot}:red`, 0.42 + volatility * 0.022);
  const matchProfile = determineMatchProfile({
    blueAssignments: assignmentsBlue,
    redAssignments: assignmentsRed,
    blueDraft: blueDraftEval,
    redDraft: redDraftEval,
    laneVolatility: volatility,
  });

  // FIX MOMENTUM: calculam bonusul psihologic bazat pe jocurile anterioare
  const blueMomentum = computeSeriesMomentum(input.series, "blue", input.game.number);
  const redMomentum = computeSeriesMomentum(input.series, "red", input.game.number);
  const blueChemistry = computeTeamChemistry(blueRoster);
  const redChemistry = computeTeamChemistry(redRoster);

  // UPGRADE 4: chemistry adjusts objectives and clutch
  const blueObjectivesAdj = round1(clamp(blueObjectives + blueChemistry.leadershipBonus, 0, 10));
  const redObjectivesAdj = round1(clamp(redObjectives + redChemistry.leadershipBonus, 0, 10));
  const blueClutchAdj = round1(clamp(blueClutch + blueChemistry.communicationBonus, 0, 10));
  const redClutchAdj = round1(clamp(redClutch + redChemistry.communicationBonus, 0, 10));
  const teamfight = evaluateTeamfight({
    blueAssignments: assignmentsBlue,
    redAssignments: assignmentsRed,
  });

  const blueTendencyEvents = computeTendencyEvents({
    roster: blueRoster,
    assignments: assignmentsBlue,
    enemyRoster: redRoster,
    enemyAssignments: assignmentsRed,
    seedRoot,
    side: "blue",
  });

  const redTendencyEvents = computeTendencyEvents({
    roster: redRoster,
    assignments: assignmentsRed,
    enemyRoster: blueRoster,
    enemyAssignments: assignmentsBlue,
    seedRoot,
    side: "red",
  });

  const bluePhases = computePhaseBreakdown({
    roster: blueRoster,
    assignments: assignmentsBlue,
    laneScore: lane.blueScore,
    draftPower: blueDraftComposite,
    matchProfile,
    momentum: blueMomentum,
    seedRoot,
    side: "blue",
    tendencyBonus: blueTendencyEvents,
    teamfightEdge: teamfight.blueTeamfightEdge
  });

  const redPhases = computePhaseBreakdown({
    roster: redRoster,
    assignments: assignmentsRed,
    laneScore: lane.redScore,
    draftPower: redDraftComposite,
    matchProfile,
    momentum: redMomentum,
    seedRoot,
    side: "red",
    tendencyBonus: redTendencyEvents,
    teamfightEdge: teamfight.redTeamfightEdge
  });

  const blueScores = buildTeamPhaseScores({
    draft: blueDraftComposite,
    playerPower: bluePlayerPower,
    assignment: blueAssignment,
    lane: lane.blueScore,
    objectives: blueObjectivesAdj,
    execution: blueExecution,
    clutch: blueClutchAdj,
    late: blueLate,
    rng: blueRng,
    momentum: blueMomentum,
    profile: matchProfile,
    phases: bluePhases,
  });

  const redScores = buildTeamPhaseScores({
    draft: redDraftComposite,
    playerPower: redPlayerPower,
    assignment: redAssignment,
    lane: lane.redScore,
    objectives: redObjectivesAdj,
    execution: redExecution,
    clutch: redClutchAdj,
    late: redLate,
    rng: redRng,
    momentum: redMomentum,
    profile: matchProfile,
    phases: redPhases,
  });

  // UPGRADE 12: Lane snowball — early advantage carries into mid/late (capped)
  const snowball = computeLaneSnowball({
    blueEarlyScore: bluePhases.early.phaseTotal,
    redEarlyScore: redPhases.early.phaseTotal,
    blueMidScore: bluePhases.mid.phaseTotal,
    redMidScore: redPhases.mid.phaseTotal,
  });

  // Apply snowball swings to mid/late phase totals
  bluePhases.mid.phaseTotal += snowball.midSwing.blue;
  redPhases.mid.phaseTotal += snowball.midSwing.red;
  bluePhases.late.phaseTotal += snowball.lateSwing.blue;
  redPhases.late.phaseTotal += snowball.lateSwing.red;

  // Simplified version: team-level average power spike multiplier
  const applyPowerSpikes = (assignments: Partial<Record<Role, string>>, phase: "early" | "mid" | "late") => {
    const multipliers = ROLE_ORDER.map((role) => {
      const champId = assignments[role];
      return champId ? getChampionPowerSpikeMultiplier(champId, phase) : 1.0;
    });
    const avgMult = multipliers.reduce((sum, m) => sum + m, 0) / multipliers.length;
    return avgMult;
  };

  // UPGRADE 13: Draft spike windows — team with bigger spike in phase gains
  const spikes = computeDraftSpikeWindows(assignmentsBlue, assignmentsRed);
  bluePhases.early.phaseTotal += spikes.earlySpikeAdvantage.blue;
  redPhases.early.phaseTotal += spikes.earlySpikeAdvantage.red;
  bluePhases.mid.phaseTotal += spikes.midSpikeAdvantage.blue;
  redPhases.mid.phaseTotal += spikes.midSpikeAdvantage.red;
  bluePhases.late.phaseTotal += spikes.lateSpikeAdvantage.blue;
  redPhases.late.phaseTotal += spikes.lateSpikeAdvantage.red;

  const blueEarlyMult = applyPowerSpikes(assignmentsBlue, "early");
  const blueMidMult = applyPowerSpikes(assignmentsBlue, "mid");
  const blueLateMult = applyPowerSpikes(assignmentsBlue, "late");
  const redEarlyMult = applyPowerSpikes(assignmentsRed, "early");
  const redMidMult = applyPowerSpikes(assignmentsRed, "mid");
  const redLateMult = applyPowerSpikes(assignmentsRed, "late");

  // Apply multipliers to phase totals (scaled gently so they don't dominate)
  bluePhases.early.phaseTotal *= (1 + (blueEarlyMult - 1) * 0.4);
  bluePhases.mid.phaseTotal *= (1 + (blueMidMult - 1) * 0.4);
  bluePhases.late.phaseTotal *= (1 + (blueLateMult - 1) * 0.4);
  redPhases.early.phaseTotal *= (1 + (redEarlyMult - 1) * 0.4);
  redPhases.mid.phaseTotal *= (1 + (redMidMult - 1) * 0.4);
  redPhases.late.phaseTotal *= (1 + (redLateMult - 1) * 0.4);


  // ─── FIX WINNER PROBABILISTIC ─────────────────────────────────────────────
  // In loc de "cel mai mare total castiga mereu", transformam diferenta de
  // scor intr-o probabilitate prin functia sigmoid.
  // La 0 diferenta: 50/50. La diferenta de 2+: ~92% favorit.
  // Astfel, echipe mai slabe pot castiga meciuri strinse — ca in realitate.
  const scoreDiff = blueScores.total - redScores.total;
  // UPGRADE 11: steeper sigmoid — better teams win more reliably (1.4 → 2.2)
  const winProb = 1 / (1 + Math.exp(-scoreDiff * 2.2));
  // Seed include numarul jocului si seriesId pentru a nu fi fix
  const winRoll = seededNoise(`${seedRoot}:winner:outcome`, 1) * 0.5 + 0.5;
  const winnerSide: "blue" | "red" = winRoll < winProb ? "blue" : "red";
  // ──────────────────────────────────────────────────────────────────────────

  // UPGRADE 13: Comeback mechanics — close games can reverse (8-10%)
  let finalWinnerSide = winnerSide;
  const blueMacroAvg = (playerMacroScore(blueRoster.top ?? null) +
    playerMacroScore(blueRoster.jungle ?? null) +
    playerMacroScore(blueRoster.mid ?? null) +
    playerMacroScore(blueRoster.adc ?? null) +
    playerMacroScore(blueRoster.support ?? null)) / 5;
  const redMacroAvg = (playerMacroScore(redRoster.top ?? null) +
    playerMacroScore(redRoster.jungle ?? null) +
    playerMacroScore(redRoster.mid ?? null) +
    playerMacroScore(redRoster.adc ?? null) +
    playerMacroScore(redRoster.support ?? null)) / 5;

  const shouldReverse = checkComebackReversal({
    currentWinner: winnerSide,
    blueLateScore: bluePhases.late.phaseTotal,
    redLateScore: redPhases.late.phaseTotal,
    blueMacroAvg,
    redMacroAvg,
    scoreDiff,
    seriesId: input.series.seriesId,
    gameNumber: input.game.number,
  });

  if (shouldReverse) {
    finalWinnerSide = winnerSide === "blue" ? "red" : "blue";
  }

  const closeness = round1(1 - clamp(Math.abs(blueScores.total - redScores.total) / 3, 0, 1));
  const flow = determineFlow(
    blueScores.total,
    redScores.total,
    Math.abs(lane.blueScore - lane.redScore),
    volatility,
    bluePhases,
    redPhases
  );


  const playerScores = buildPlayerScores({
    winnerSide: finalWinnerSide,
    blueRoster,
    redRoster,
    assignmentsBlue,
    assignmentsRed,
    blueDraftScore: blueDraftComposite,
    redDraftScore: redDraftComposite,
    lane,
    closeness,
    seriesId: input.series.seriesId,
    gameNumber: input.game.number,
    scoreDiff: blueScores.total - redScores.total,
    blueTeamTotal: blueScores.total,
    redTeamTotal: redScores.total,
  });

  const mvp = [...playerScores].sort((a, b) => b.score - a.score)[0] ?? null;
  const seriesScore = computeSeriesScoreAfterGame(input, finalWinnerSide);
  const reason = buildReason({ winnerSide: finalWinnerSide, blueScores, redScores });

  const gameTeamSlugs = getGameTeamSlugsForGameNumber(input.series, input.game.number);

  recordGames(
    playerScores.map((playerScore) => ({
      playerId: playerScore.playerId,
      teamSlug:
        playerScore.side === "blue" ? gameTeamSlugs.blueTeamSlug : gameTeamSlugs.redTeamSlug,
      role: playerScore.role,
      score: playerScore.score,
      side: playerScore.side,
      result: playerScore.side === finalWinnerSide ? "win" : "loss",
      bestOf: input.series.bo,
    }))
  );

  updatePlayerHistoryFromResolvedGame({
    winnerSide: finalWinnerSide,
    blueRoster,
    redRoster,
    assignmentsBlue,
    assignmentsRed,
    playerScores: playerScores.map((entry) => ({ playerId: entry.playerId, score: entry.score })),
    gameNumber: input.game.number,
  });

  return {
    winnerSide: finalWinnerSide,
    blueTeamSlug: input.series.blueTeamSlug,
    redTeamSlug: input.series.redTeamSlug,
    seriesScoreBlue: seriesScore.blueWins,
    seriesScoreRed: seriesScore.redWins,
    blueDraftScore: round1(blueDraftComposite),
    redDraftScore: round1(redDraftComposite),
    bluePlayerPower: round1(bluePlayerPower),
    redPlayerPower: round1(redPlayerPower),
    blueTotal: blueScores.total,
    redTotal: redScores.total,
    bluePhaseScores: blueScores,
    redPhaseScores: redScores,
    closeness,
    volatility,
    flow,
    matchProfile,
    reason,
    lane,
    playerScores,
    mvpPlayerId: mvp?.playerId ?? null,
  };
}