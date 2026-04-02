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
  // FIX SCORE BASE: game number adaugat la seed pentru variatie intre jocuri
  gameNumber: number;
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

      // FIX SCORE BASE: base redus de la 6.1 la 5.0 + modificatori mai mari
      // → distributie mai larga: perdantii pot face 3-4, castigatorii pot face 9-10
      // winModifier crescut: +1.4 win / -1.0 loss (vs +1.0 / -0.7 original)
      const winModifier = entry.side === args.winnerSide ? 1.4 : -1.0;
      const laneModifier = (entry.laneScore - 5) * 0.22;
      const draftModifier = (entry.draftScore - 5) * 0.12;
      const fitModifier = (fit - 5) * 0.18;
      const executionModifier = (execution - 5) * 0.11;
      const clutchModifier = (clutch - 5) * 0.09;
      const laneSkillModifier = (laning - 5) * 0.09;
      const macroModifier = (macro - 5) * 0.07;
      const teamfightModifier = (teamfight - 5) * 0.08;
      const consistencyModifier = (consistency - 5) * 0.06;
      const archetypeModifier = (archetypeFit - 5) * 0.09;
      const closeGameModifier = args.closeness * (clutch - 5) * 0.09 * personality.composureClutchScale;
      const starModifier = (starPower - 5) * 0.14;

      // FIX SCORE BASE: seed include si gameNumber → scoruri diferite intre
      // jocuri chiar daca acelasi jucator joaca acelasi campion
      const rng = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${role}:${entry.side}:${entry.playerId}:${entry.championId}`,
        0.55 * personality.volatilityRngScale
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

      // FIX SCORE BASE: 5.0 in loc de 6.1
      const score = clamp(
        5.0 +
        winModifier +
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
        rng,
        1,
        10
      );

      let note = "solid game";
      if (score >= 9.0) note = "hard carry";
      else if (score >= 8.2) note = "high impact";
      else if (score >= 7.2) note = "stable performance";
      else if (score <= 4.9) note = "rough game";

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

  const assignmentsBlue =
    Object.keys(input.game.assignmentsBlue).length > 0
      ? input.game.assignmentsBlue
      : resolveRoleAssignments(input.game.picksBlue, blueRoster);
  const assignmentsRed =
    Object.keys(input.game.assignmentsRed).length > 0
      ? input.game.assignmentsRed
      : resolveRoleAssignments(input.game.picksRed, redRoster);

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

  // ─── FIX WINNER PROBABILISTIC ─────────────────────────────────────────────
  // In loc de "cel mai mare total castiga mereu", transformam diferenta de
  // scor intr-o probabilitate prin functia sigmoid.
  // La 0 diferenta: 50/50. La diferenta de 2+: ~92% favorit.
  // Astfel, echipe mai slabe pot castiga meciuri strinse — ca in realitate.
  const scoreDiff = blueScores.total - redScores.total;
  const winProb = 1 / (1 + Math.exp(-scoreDiff * 1.4));
  // Seed include numarul jocului si seriesId pentru a nu fi fix
  const winRoll = seededNoise(`${seedRoot}:winner:outcome`, 1) * 0.5 + 0.5;
  const winnerSide: "blue" | "red" = winRoll < winProb ? "blue" : "red";
  // ──────────────────────────────────────────────────────────────────────────

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
    winnerSide,
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
  });

  const mvp = [...playerScores].sort((a, b) => b.score - a.score)[0] ?? null;
  const seriesScore = computeSeriesScoreAfterGame(input, winnerSide);
  const reason = buildReason({ winnerSide, blueScores, redScores });

  const gameTeamSlugs = getGameTeamSlugsForGameNumber(input.series, input.game.number);

  recordGames(
    playerScores.map((playerScore) => ({
      playerId: playerScore.playerId,
      teamSlug:
        playerScore.side === "blue" ? gameTeamSlugs.blueTeamSlug : gameTeamSlugs.redTeamSlug,
      role: playerScore.role,
      score: playerScore.score,
      side: playerScore.side,
      result: playerScore.side === winnerSide ? "win" : "loss",
      bestOf: input.series.bo,
    }))
  );

  updatePlayerHistoryFromResolvedGame({
    winnerSide,
    blueRoster,
    redRoster,
    assignmentsBlue,
    assignmentsRed,
    playerScores: playerScores.map((entry) => ({ playerId: entry.playerId, score: entry.score })),
    gameNumber: input.game.number,
  });

  return {
    winnerSide,
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
