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
import type { MatchProfile, PlayerGameScore, TeamPhaseScores } from "./matchSimulationTypes";
import { evaluateLanePhase } from "./laneEvaluator";
import {
  average,
  championExecutionDifficulty,
  championMetaPower,
  clamp,
  getChampionByIdSafe,
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
}): TeamPhaseScores {
  const weights = getProfileWeights(args.profile ?? "standard");
  const total = clamp(
    args.draft * 0.19 +
      args.playerPower * 0.2 +
      args.assignment * 0.08 +
      args.lane * 0.15 * weights.lane +
      args.objectives * 0.1 * weights.objectives +
      args.execution * 0.1 * weights.execution +
      args.clutch * 0.1 * weights.clutch +
      args.late * 0.08 * weights.late +
      // FIX MOMENTUM: contribuie direct la scorul total al echipei
      args.momentum +
      args.rng,
    0,
    10
  );

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
  };
}

function determineFlow(
  blueTotal: number,
  redTotal: number,
  laneGap: number,
  volatility: number
) {
  const diff = Math.abs(blueTotal - redTotal);
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
      const clutch = playerClutchScore(entry.playerId);
      const execution = playerExecutionScore(entry.playerId);
      const laning = playerLaningScore(entry.playerId);
      const macro = playerMacroScore(entry.playerId);
      const teamfight = playerTeamfightScore(entry.playerId);
      const consistency = playerConsistencyScore(entry.playerId);
      const archetypeFit = playerChampionArchetypeFit(entry.playerId, entry.championId);
      const starPower = computeStarPower(entry.playerId);

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
      const closeGameModifier = args.closeness * (clutch - 5) * 0.09;
      const starModifier = (starPower - 5) * 0.14;

      // FIX SCORE BASE: seed include si gameNumber → scoruri diferite intre
      // jocuri chiar daca acelasi jucator joaca acelasi campion
      const rng = seededNoise(
        `${args.seriesId}:g${args.gameNumber}:${role}:${entry.side}:${entry.playerId}:${entry.championId}`,
        0.55  // crescut de la 0.35 → mai multa variatie realista
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
          archetypeFit * 0.12,
        0,
        10
      );
      const mistakeRisk = clamp(
        10 -
          (execution * 0.3 + fit * 0.22 + clutch * 0.16 + consistency * 0.2 + macro * 0.12),
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

  const blueScores = buildTeamPhaseScores({
    draft: blueDraftComposite,
    playerPower: bluePlayerPower,
    assignment: blueAssignment,
    lane: lane.blueScore,
    objectives: blueObjectives,
    execution: blueExecution,
    clutch: blueClutch,
    late: blueLate,
    rng: blueRng,
    momentum: blueMomentum,
    profile: matchProfile,
  });

  const redScores = buildTeamPhaseScores({
    draft: redDraftComposite,
    playerPower: redPlayerPower,
    assignment: redAssignment,
    lane: lane.redScore,
    objectives: redObjectives,
    execution: redExecution,
    clutch: redClutch,
    late: redLate,
    rng: redRng,
    momentum: redMomentum,
    profile: matchProfile,
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
    volatility
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
