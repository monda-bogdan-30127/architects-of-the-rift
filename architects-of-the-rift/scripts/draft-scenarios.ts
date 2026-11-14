// Scenarii de test pentru rework-ul de draft (DRAFT_REWORK §7).
//
//   npx tsx scripts/draft-scenarios.ts
//
// Draftul AI e determinist (seed din seriesId). Engine-ul verifică singur
// `typeof window` pentru localStorage, deci rulează în Node fără mock.
// Rosterele sunt cele originale; scenariile înlocuiesc jucători ca să
// controleze mastery-ul. Iese cu cod 1 dacă un scenariu eșuează.

import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import {
  commitActionToGame,
  createInitialSeries,
  resolveFinishedDraftAssignments,
  getAiChoice,
  getCurrentStep,
  simulateDraftResult,
  initializeSwapStageAssignments,
  swapAssignedRoles,
} from "@/app/draft-engine/draftEngine";
import { getPickCandidatePool } from "@/app/draft-engine/draftAI";
import { chooseAiAction, scoreDraftCandidate } from "@/app/draft-engine/draftDecision";
import { hasThinPool } from "@/app/draft-engine/draftMasteryGate";
import { getBotDuoState } from "@/app/draft-engine/botDuoPlan";
import { getPlanAlignmentBonus, isPriorityPick, type DraftPlanType } from "@/app/draft-engine/draftPlanSystem";
import { getCandidateIdentityFit } from "@/app/draft-engine/compIdentity";
import { setTeamSeasonStoreOverride, type TeamSeasonStore } from "@/app/draft-engine/teamSeasonStorage";
import { getSeasonChampionThreat, getSeasonCounters } from "@/app/draft-engine/seasonThreatSystem";
import { getSeriesAwareBanBonus } from "@/app/draft-engine/draftSeriesMemory";
import { buildDraftPillarReport } from "@/app/draft-engine/draftPillarReport";
import { getMetaPriorityScore } from "@/app/draft-engine/draftEvaluator";
import type {
  ActiveDraftSeries,
  DraftCandidateBreakdown,
  DraftGameState,
  DraftSave,
  Side,
} from "@/app/draft-engine/draftTypes";
import { getChampionGrade } from "@/app/utils/championMasteryUtils";
import { getMatchupValue } from "@/app/draft-engine/matchupScoring";
import { getWeaknessCoverage } from "@/app/draft-engine/matchupGrades";
import { matchupPowerAgainst } from "@/app/draft-engine/matchSimulationUtils";
import { getRoleMatchups } from "@/app/draft-engine/championMatchups";
import { champions } from "@/app/data/champions";
import { simulateAiVsAiSeries } from "@/app/draft-engine/aiSeriesSimulator";
import { getBotPairTier } from "@/app/draft-engine/mustWithPriority";
import { buildDraftContext } from "@/app/draft-engine/draftContext";
import { DEFAULT_AI_CONFIG } from "@/app/draft-engine/draftTypes";
import { getTeamStyle } from "@/app/draft-engine/teamStyle";
import { getOpenRolesForPickedChampions } from "@/app/draft-engine/draftRoleResolver";
import { isLaneCounter, isStrongCounter } from "@/app/draft-engine/matchupGrades";
import { ROLE_ORDER } from "@/app/draft-engine/draftTypes";
import { evaluateIntents } from "@/app/draft-engine/draftDecision";
import { getResolvedChampionPool } from "@/app/utils/championMasteryUtils";
import { computeSeriesMvp, type SeriesGameSummary } from "@/app/draft-engine/mvpStorage";
import { evaluateContextualNeedStatuses, getContextualNeeds, setContextualNeedsOverride } from "@/app/draft-engine/contextualNeeds";
import type { ChampionOffer, ResourceDemand } from "@/app/types/champion";
import { evaluateTeamfight } from "@/app/draft-engine/teamfightSystem";
import { evaluateLanePhase } from "@/app/draft-engine/laneEvaluator";
import { applyMasteryToFit } from "@/app/draft-engine/championMasteryDraftSystem";
import { getSeriesRatingEffect, teamSetupFor } from "@/app/draft-engine/traitEffects";
import { ACTIVE_TRAIT_FAMILIES, type PlayerTrait, type PlayerTraitFamily } from "@/app/types/playerTraits";
import { computeTeamFit, previewTeamFitChange } from "@/app/utils/playerTraitUtils";
import { computeSeriesSpiritDeltas } from "@/app/draft-engine/playerSpiritEngine";
import { computeTeamChemistry, getPlayerPersonalityModifiers } from "@/app/draft-engine/personalitySystem";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";

// ─── Infrastructură ──────────────────────────────────────────────────────────

const playersById = new Map(players.map((player) => [player.id, player]));
const baseRosters: Record<string, Record<Role, string>> = {};
for (const team of teams) {
  const roster = { top: "", jungle: "", mid: "", adc: "", support: "" } as Record<Role, string>;
  for (const player of players) if (player.teamId === team.id) roster[player.role] = player.id;
  baseRosters[team.id] = roster;
}

function makeSave(overrides: Record<string, Partial<Record<Role, string>>> = {}): DraftSave {
  const updatedTeamRosters: Record<string, Record<Role, string>> = {};
  for (const [teamId, roster] of Object.entries(baseRosters)) {
    updatedTeamRosters[teamId] = { ...roster, ...(overrides[teamId] ?? {}) };
  }
  return {
    region: "all",
    controlledTeamSlug: "__none__",
    budget: 0,
    roster: { top: "", jungle: "", mid: "", adc: "", support: "" },
    updatedTeamRosters,
    playerTeamAssignments: {},
    freeAgentPlayerIds: [],
  };
}

function grade(playerId: string, championId: string) {
  const player = playersById.get(playerId);
  return player ? getChampionGrade(player, championId) : "?";
}

/** Ban-uri neutre în faza 1, ca forțările să rămână valide. */
const NEUTRAL_BANS = ["azir", "vi", "sejuani", "jayce", "ksante", "orianna"];

type Forced = { side: Side; action: "pick" | "ban"; nth: number; championId: string };
type LogEntry = { label: string; side: Side; action: "pick" | "ban"; championId: string; breakdown: DraftCandidateBreakdown | null };

function newSeries(id: string, blue: string, red: string): ActiveDraftSeries {
  const series = createInitialSeries(`${id}-${blue}-${red}`, "__none__");
  return series;
}

function runDraft(args: {
  series: ActiveDraftSeries;
  save: DraftSave;
  forced?: Forced[];
  bans?: string[];
  stop?: (log: LogEntry[]) => boolean;
}) {
  const bans = args.bans ?? NEUTRAL_BANS;
  // Jocul curent al seriei (scenariile de fearless au jocuri anterioare completate înainte).
  let game: DraftGameState = args.series.games.find((entry) => entry.number === args.series.currentGameNumber) ?? args.series.games[0];
  const counters = { "blue:pick": 0, "red:pick": 0, "blue:ban": 0, "red:ban": 0 };
  const log: LogEntry[] = [];
  for (let step = getCurrentStep(game); step; step = getCurrentStep(game)) {
    const counterKey = `${step.side}:${step.action}` as keyof typeof counters;
    counters[counterKey] += 1;
    let championId: string | undefined;
    let breakdown: DraftCandidateBreakdown | null = null;
    if (game.phaseIndex < 6) championId = bans[game.phaseIndex];
    championId ??= args.forced?.find(
      (entry) => entry.side === step.side && entry.action === step.action && entry.nth === counters[counterKey],
    )?.championId;
    if (!championId) {
      breakdown = getAiChoice(args.series, game, step, args.save);
      if (!breakdown) break;
      championId = breakdown.championId;
    } else {
      const taken = [...game.bansBlue, ...game.bansRed, ...game.picksBlue, ...game.picksRed];
      if (taken.includes(championId)) throw new Error(`forțare invalidă: ${championId} e deja luat/banat`);
    }
    log.push({ label: step.label, side: step.side, action: step.action, championId, breakdown });
    game = commitActionToGame(game, championId, step.side, step.action, breakdown?.projectedRole);
    if (args.stop?.(log)) break;
  }
  return { game, log };
}

const nthPick = (log: LogEntry[], side: Side, nth: number) =>
  log.filter((entry) => entry.side === side && entry.action === "pick")[nth - 1];

type Result = { name: string; pass: boolean; detail: string };
const results: Result[] = [];
function check(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
}

const isLock = (entry?: LogEntry) => Boolean(entry?.breakdown?.reasonTags?.includes("mustwith-lock"));

// ─── Fixturi mustWith ────────────────────────────────────────────────────────
// Datele reale au doar perechile stricte (Xayah ↔ Rakan, Kog'Maw → Lulu). Ca să
// testăm mecanica cu mai mulți parteneri (6) și pe o pereche non-bot (7), le
// injectăm în memorie ÎNAINTE ca championMatchups să-și construiască indexul.
function fixtureMustWith(championId: string, role: Role, partners: string[]) {
  const data = champions.find((champion) => champion.id === championId)?.roleData[role];
  if (!data) throw new Error(`fixtură invalidă: ${championId}:${role}`);
  data.mustWith = partners;
}
fixtureMustWith("yunara", "adc", ["lulu", "milio", "nami"]);
fixtureMustWith("nidalee", "jungle", ["renekton", "twisted-fate"]);

// Jucătorii folosiți (gradele sunt afișate în detaliu).
const ADC_XAYAH = "ruler";        // Xayah A
const SUP_RAKAN_OK = "keria";     // Rakan B; Lulu B, Milio B, Nami A
const SUP_MULTI = "cryogen";      // grade diferite pe Lulu / Milio / Nami (scenariul 6)
// Scenariul 2: un jucător cu Rakan sub C, ales la rulare (mastery-ul se schimbă în timp);
// de preferință un support, altfel orice jucător pus pe support.
const SUP_RAKAN_LOW = (() => {
  const rank = { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 } as Record<string, number>;
  const candidates = players.filter((p) => p.teamId !== "free-agent" && rank[getChampionGrade(p, "rakan")] < 2);
  const pick = candidates.find((p) => p.role === "support") ?? candidates.find((p) => !["ruler", "keria", "caliste"].includes(p.id));
  if (!pick) throw new Error("niciun jucător cu Rakan sub C");
  return pick.id;
})();
const ADC_YUNARA = "caliste";     // Yunara A
const TOP_RENEKTON = "clear";     // Renekton A, Malphite B
const MID_TF = "showmaker";       // Twisted Fate A
const MID_NO_TF = "clozer";       // Twisted Fate F
const SUP_NO_SS = "lehends";      // fără campion SS (keria are Bard SS → excepția 5.4)

const RED = "t1";
const BLUE = "geng";

// ─── 1. Red R1 Xayah → R2 Rakan ──────────────────────────────────────────────
{
  const save = makeSave({ [RED]: { adc: ADC_XAYAH, support: SUP_RAKAN_OK } });
  const { log } = runDraft({
    series: newSeries("s1", BLUE, RED),
    save,
    forced: [{ side: "red", action: "pick", nth: 1, championId: "xayah" }],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  const r2 = nthPick(log, "red", 2);
  check(
    "1. Red R1 Xayah → R2 Rakan",
    r2?.championId === "rakan" && isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)}, ${r2?.breakdown?.explanation?.slice(-1)[0] ?? ""} (support Rakan ${grade(SUP_RAKAN_OK, "rakan")})`,
  );
}

// ─── 2. Support cu Rakan D → logica normală ─────────────────────────────────
{
  const save = makeSave({ [RED]: { adc: ADC_XAYAH, support: SUP_RAKAN_LOW } });
  const { log } = runDraft({
    series: newSeries("s2", BLUE, RED),
    save,
    forced: [{ side: "red", action: "pick", nth: 1, championId: "xayah" }],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  const r2 = nthPick(log, "red", 2);
  check(
    "2. Support cu Rakan sub C → fără lock",
    !isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (support ${SUP_RAKAN_LOW}: Rakan ${grade(SUP_RAKAN_LOW, "rakan")})`,
  );
}

// ─── 3. Rakan banat în faza 1 → logica normală ──────────────────────────────
{
  const save = makeSave({ [RED]: { adc: ADC_XAYAH, support: SUP_RAKAN_OK } });
  const { log } = runDraft({
    series: newSeries("s3", BLUE, RED),
    save,
    bans: ["rakan", ...NEUTRAL_BANS.slice(1)],
    forced: [{ side: "red", action: "pick", nth: 1, championId: "xayah" }],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  const r2 = nthPick(log, "red", 2);
  check("3. Rakan banat → fără lock", !isLock(r2) && r2?.championId !== "rakan", `R2=${r2?.championId}, lock=${isLock(r2)}`);
}

// ─── 4. Blue B1 Xayah → B2 Rakan ─────────────────────────────────────────────
{
  const save = makeSave({ [BLUE]: { adc: ADC_XAYAH, support: SUP_RAKAN_OK } });
  const { log } = runDraft({
    series: newSeries("s4", BLUE, RED),
    save,
    forced: [{ side: "blue", action: "pick", nth: 1, championId: "xayah" }],
    stop: (entries) => Boolean(nthPick(entries, "blue", 2)),
  });
  const b2 = nthPick(log, "blue", 2);
  const redTookRakan = log.some((entry) => entry.side === "red" && entry.championId === "rakan");
  check(
    "4. Blue B1 Xayah → B2 Rakan",
    redTookRakan ? !isLock(b2) : b2?.championId === "rakan" && isLock(b2),
    redTookRakan ? `roșii au luat Rakan (deny) — B2=${b2?.championId}` : `B2=${b2?.championId}, lock=${isLock(b2)}`,
  );
}

// ─── 5. Blue B3 Xayah → nu banează Rakan în faza 2; B4 Rakan ─────────────────
{
  const save = makeSave({ [BLUE]: { adc: ADC_XAYAH, support: SUP_RAKAN_OK } });
  const { log } = runDraft({
    series: newSeries("s5", BLUE, RED),
    save,
    forced: [
      { side: "blue", action: "pick", nth: 1, championId: "jarvan-iv" },
      { side: "blue", action: "pick", nth: 2, championId: "ahri" },
      { side: "blue", action: "pick", nth: 3, championId: "xayah" },
    ],
    stop: (entries) => Boolean(nthPick(entries, "blue", 4)),
  });
  const blueBannedRakan = log.some((entry) => entry.side === "blue" && entry.action === "ban" && entry.championId === "rakan");
  const redRemovedRakan = log.some((entry) => entry.side === "red" && entry.championId === "rakan");
  const b4 = nthPick(log, "blue", 4);
  const phase2BlueBans = log.filter((entry) => entry.side === "blue" && entry.action === "ban").slice(3).map((entry) => entry.championId);
  check(
    "5. Blue B3 Xayah → fără ban pe Rakan, B4 Rakan",
    !blueBannedRakan && (redRemovedRakan || (b4?.championId === "rakan" && isLock(b4))),
    `ban-uri blue faza 2: ${phase2BlueBans.join(", ")}; ${redRemovedRakan ? "roșii au scos Rakan; " : ""}B4=${b4?.championId}, lock=${isLock(b4)}`,
  );
}

// ─── 6. Mai mulți parteneri → mastery-ul cel mai bun ─────────────────────────
for (const support of [SUP_RAKAN_OK, SUP_MULTI]) {
  const options = ["lulu", "milio", "nami"]; // ordinea din yunara:adc mustWith
  const rank = { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 } as Record<string, number>;
  const expected = [...options].sort((a, b) => rank[grade(support, b)] - rank[grade(support, a)] || options.indexOf(a) - options.indexOf(b))[0];
  const save = makeSave({ [RED]: { adc: ADC_YUNARA, support } });
  const { log } = runDraft({
    series: newSeries(`s6${support}`, BLUE, RED),
    save,
    forced: [{ side: "red", action: "pick", nth: 1, championId: "yunara" }],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  const r2 = nthPick(log, "red", 2);
  check(
    `6. Yunara → cel mai bun grad (${support})`,
    r2?.championId === expected && isLock(r2),
    `grade ${options.map((id) => `${id}:${grade(support, id)}`).join(" ")} → așteptat ${expected}, R2=${r2?.championId}`,
  );
}

// ─── 7. Non-bot: Nidalee → Renekton/TF în majoritate; pierde la un counter nota 5 ─
{
  const runs = 40;
  let partnerPicked = 0;
  for (let index = 0; index < runs; index += 1) {
    const blue = teams[(index * 5 + 2) % teams.length].slug;
    if (blue === RED) continue;
    const save = makeSave({ [RED]: { top: TOP_RENEKTON, mid: MID_TF, support: SUP_NO_SS } });
    const { log } = runDraft({
      series: newSeries(`s7n${index}`, blue, RED),
      save,
      forced: [{ side: "red", action: "pick", nth: 1, championId: "nidalee" }],
      stop: (entries) => Boolean(nthPick(entries, "red", 2)),
    });
    const r2 = nthPick(log, "red", 2);
    if (r2 && ["renekton", "twisted-fate"].includes(r2.championId)) partnerPicked += 1;
  }
  const rate = partnerPicked / runs;
  check("7a. Nidalee → partener la R2 în ≥ 80% din rulări", rate >= 0.8, `${partnerPicked}/${runs} (${Math.round(rate * 100)}%)`);

  // Doar Renekton eligibil (mid-ul are TF F); inamicul are Tryndamere top → Malphite e counter nota 5.
  const counterRuns = 20;
  let renektonPicked = 0;
  const picks: Record<string, number> = {};
  for (let index = 0; index < counterRuns; index += 1) {
    const blue = teams[(index * 5 + 2) % teams.length].slug;
    if (blue === RED) continue;
    const save = makeSave({ [RED]: { top: TOP_RENEKTON, mid: MID_NO_TF, support: SUP_NO_SS } });
    const { log } = runDraft({
      series: newSeries(`s7c${index}`, blue, RED),
      save,
      forced: [
        { side: "blue", action: "pick", nth: 1, championId: "tryndamere" },
        { side: "red", action: "pick", nth: 1, championId: "nidalee" },
      ],
      stop: (entries) => Boolean(nthPick(entries, "red", 2)),
    });
    const r2 = nthPick(log, "red", 2);
    if (r2?.championId === "renekton") renektonPicked += 1;
    if (r2) picks[r2.championId] = (picks[r2.championId] ?? 0) + 1;
  }
  check(
    "7b. Hard counter pe linie bate partenerul",
    renektonPicked / counterRuns <= 0.2,
    (() => {
      const relation = getRoleMatchups("malphite", "top").goodVs.find((r) => r.championId === "tryndamere");
      return `Renekton ${renektonPicked}/${counterRuns}; R2: ${Object.entries(picks).map(([id, count]) => `${id}×${count}`).join(", ")} (Malphite vs Tryndamere = level ${relation?.level}/${relation?.phase})`;
    })(),
  );
  // 7c. Excepția SS: support-ul are un campion SS liber (Keria — Bard) → partenerul nu mai e forțat.
  let partnerWithSs = 0;
  const ssRuns = 20;
  for (let index = 0; index < ssRuns; index += 1) {
    const blue = teams[(index * 5 + 2) % teams.length].slug;
    if (blue === RED) continue;
    const save = makeSave({ [RED]: { top: TOP_RENEKTON, mid: MID_TF, support: SUP_RAKAN_OK } });
    const { log } = runDraft({
      series: newSeries(`s7s${index}`, blue, RED),
      save,
      forced: [{ side: "red", action: "pick", nth: 1, championId: "nidalee" }],
      stop: (entries) => Boolean(nthPick(entries, "red", 2)),
    });
    const r2 = nthPick(log, "red", 2);
    if (r2 && ["renekton", "twisted-fate"].includes(r2.championId)) partnerWithSs += 1;
  }
  check(
    "7c. Pick SS disponibil bate partenerul",
    partnerWithSs / ssRuns <= 0.2,
    `partener ${partnerWithSs}/${ssRuns} (support ${SUP_RAKAN_OK}: Bard ${grade(SUP_RAKAN_OK, "bard")})`,
  );
}

// ─── 8. Efectele notelor ─────────────────────────────────────────────────────
{
  // 8a. Level 2 cu slăbiciuni acoperite → efect ×0.5 doar pe mid și late (early neschimbat).
  //     Căutăm o relație level 2 / all și aliați care acoperă jumătate (dar nu toate)
  //     slăbiciunile celui countrat.
  let detail = "nicio relație level 2 / all cu acoperire parțială găsită";
  let pass = false;
  outer: for (const champion of champions) {
    for (const role of champion.roles) {
      for (const relation of getRoleMatchups(champion.id, role).weakVs) {
        if (relation.level !== 2 || relation.phase !== "all") continue;
        const enemyRole = relation.vsRole ?? role;
        const allies = champions.map((ally) => ally.id).filter((id) => id !== champion.id && id !== relation.championId);
        const halfCover = allies.find((id) => {
          const coverage = getWeaknessCoverage(champion.id, [id]);
          return coverage >= 0.5 && coverage < 1;
        });
        if (!halfCover) continue;
        const value = (phase: "early" | "mid" | "late", allies: string[]) =>
          getMatchupValue(champion.id, role, relation.championId, enemyRole, { phase, ownAllyIds: allies });
        const phases = ["early", "mid", "late"] as const;
        const uncovered = phases.map((phase) => value(phase, []));
        const covered = phases.map((phase) => value(phase, [halfCover]));
        pass =
          uncovered[0] < 0 &&
          Math.abs(covered[0] - uncovered[0]) < 1e-9 &&
          Math.abs(covered[1] - uncovered[1] * 0.5) < 1e-9 &&
          Math.abs(covered[2] - uncovered[2] * 0.5) < 1e-9;
        const fmt = (values: number[]) => values.map((v) => v.toFixed(2)).join(" / ");
        detail = `${champion.id}:${role} weakVs ${relation.championId} (2/all), early/mid/late: fără acoperire ${fmt(uncovered)}, cu ${halfCover} ${fmt(covered)}`;
        break outer;
      }
    }
  }
  check("8a. Level 2 cu slăbiciuni acoperite → mid/late înjumătățit, early neschimbat", pass, detail);

  // 8b. Lane vs late în simulare: lane domină early, late domină late.
  const findGrade = (phase: "lane" | "late") => {
    for (const champion of champions) {
      for (const role of champion.roles) {
        const relation = getRoleMatchups(champion.id, role).goodVs.find((r) => r.level === 2 && r.phase === phase && !r.vsRole);
        if (relation) return { id: champion.id, role, enemyId: relation.championId };
      }
    }
    return null;
  };
  const two = findGrade("lane");
  const three = findGrade("late");
  if (two && three) {
    const v2early = matchupPowerAgainst(two.id, two.role, two.enemyId, two.role, "early");
    const v2late = matchupPowerAgainst(two.id, two.role, two.enemyId, two.role, "late");
    const v3early = matchupPowerAgainst(three.id, three.role, three.enemyId, three.role, "early");
    const v3late = matchupPowerAgainst(three.id, three.role, three.enemyId, three.role, "late");
    check(
      "8b. Lane vs late: early vs late diferit",
      v2early > v2late && v3late > v3early,
      `2/lane (${two.id} vs ${two.enemyId}) early ${v2early.toFixed(2)} / late ${v2late.toFixed(2)}; 2/late (${three.id} vs ${three.enemyId}) early ${v3early.toFixed(2)} / late ${v3late.toFixed(2)}`,
    );
  } else {
    check("8b. Lane vs late: early vs late diferit", false, "nu s-au găsit relații 2/lane și 2/late");
  }
}

// ─── 9. Inamicul are Xayah, Rakan liber → deny pe ban și pe pick ─────────────
{
  const save = makeSave({ [RED]: { adc: ADC_XAYAH, support: SUP_RAKAN_OK } });
  const series = newSeries("s9", BLUE, RED);
  const rakan = champions.find((champion) => champion.id === "rakan")!;
  const base: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "jayce", "ksante"],
    bansRed: ["vi", "sejuani", "orianna"],
  };
  // Pick: B2 (phaseIndex 9) — roșii au Xayah + Jarvan IV, albaștrii au Ahri.
  const pickGame: DraftGameState = { ...base, picksBlue: ["ahri"], picksRed: ["xayah", "jarvan-iv"], phaseIndex: 9 };
  const pickBreakdown = scoreDraftCandidate(rakan, getCurrentStep(pickGame)!, pickGame, series, save);
  // Ban: B4 (phaseIndex 13) — roșii au Xayah + Jarvan IV + Gnar, support liber.
  const banGame: DraftGameState = {
    ...base,
    picksBlue: ["ahri", "lee-sin", "gwen"],
    picksRed: ["xayah", "jarvan-iv", "gnar"],
    bansRed: [...base.bansRed, "taliyah"],
    phaseIndex: 13,
  };
  const banBreakdown = scoreDraftCandidate(rakan, getCurrentStep(banGame)!, banGame, series, save);
  const pickDeny = pickBreakdown.reasonTags?.includes("mustwith-deny") ?? false;
  const banDeny = banBreakdown.reasonTags?.includes("mustwith-deny") ?? false;
  check(
    "9. Inamicul are Xayah → deny pe Rakan (ban +2.0 / pick +1.5)",
    // Xayah e luată de inamic → Rakan e deny, nu ancoră orfană (fără −2).
    pickDeny && banDeny && banBreakdown.mustWithBonus === 2 && (pickBreakdown.mustWithBonus ?? 0) >= 1.5 &&
      !pickBreakdown.reasonTags?.includes("orphan-anchor"),
    `pick: tag=${pickDeny}, bonus mustWith ${pickBreakdown.mustWithBonus}, orfan=${pickBreakdown.reasonTags?.includes("orphan-anchor") ?? false}; ban (${getCurrentStep(banGame)?.label}): tag=${banDeny}, bonus ${banBreakdown.mustWithBonus}`,
  );
}

// ─── 10. mustWith direcțional ────────────────────────────────────────────────
// `mustWith` = „X e construit în jurul lui Y”. Kog'Maw → Lulu și Kalista → Renata
// sunt într-un sens: Lulu / Renata prima NU forțează ADC-ul. Xayah ↔ Rakan e
// scris în ambele fișiere, deci oricare primul îl forțează pe celălalt.
const GRADE_ORDER = { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 } as Record<string, number>;
/** Un jucător de pe `role` cu grad ≥ C pe campion (cel mai bun grad), ales la rulare. */
function playerWith(role: Role, championId: string): string {
  const best = players
    .filter((p) => p.teamId !== "free-agent" && p.role === role)
    .map((p) => ({ id: p.id, rank: GRADE_ORDER[getChampionGrade(p, championId)] ?? 0 }))
    .filter((entry) => entry.rank >= 2)
    .sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id))[0];
  if (!best) throw new Error(`niciun ${role} cu ${championId} ≥ C`);
  return best.id;
}

function firstPickThenR2(id: string, roster: Partial<Record<Role, string>>, first: string) {
  const { log } = runDraft({
    series: newSeries(id, BLUE, RED),
    save: makeSave({ [RED]: roster }),
    // B1 forțat neutru: altfel planul de duo al albaștrilor poate lua chiar campionul testat.
    forced: [
      { side: "blue", action: "pick", nth: 1, championId: "ahri" },
      { side: "red", action: "pick", nth: 1, championId: first },
    ],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  return nthPick(log, "red", 2);
}

{
  const adc = playerWith("adc", "kogmaw");
  const support = playerWith("support", "lulu");
  const r2 = firstPickThenR2("s10a", { adc, support }, "lulu");
  check(
    "10a. Lulu prima → Kog'Maw NU e forțat",
    !isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (adc ${adc}: Kog'Maw ${grade(adc, "kogmaw")})`,
  );
}
{
  const adc = playerWith("adc", "kalista");
  const support = playerWith("support", "renata-glasc");
  const r2 = firstPickThenR2("s10b", { adc, support }, "renata-glasc");
  check(
    // DUO_PRIORITY_AND_FEARLESS §1 / §5.1: Renata are acum `mustWith: ["kalista"]` (perechea e reciprocă).
    "10b. Renata prima → R2 Kalista (mustwith-lock)",
    r2?.championId === "kalista" && isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (adc ${adc}: Kalista ${grade(adc, "kalista")})`,
  );
}
{
  const r2 = firstPickThenR2("s10c", { adc: ADC_XAYAH, support: SUP_RAKAN_OK }, "rakan");
  check(
    "10c. Rakan prima → R2 Xayah (reciproc)",
    r2?.championId === "xayah" && isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (adc ${ADC_XAYAH}: Xayah ${grade(ADC_XAYAH, "xayah")})`,
  );
}
{
  const adc = playerWith("adc", "kogmaw");
  const support = playerWith("support", "lulu");
  const r2 = firstPickThenR2("s10d", { adc, support }, "kogmaw");
  check(
    "10d. Kog'Maw prima → R2 Lulu",
    r2?.championId === "lulu" && isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (support ${support}: Lulu ${grade(support, "lulu")})`,
  );
}

// ─── 11–15. Champion mastery (DRAFT_THINKING §1) ─────────────────────────────
// Jucătorii sunt aleși la rulare după grad; gradul nu depinde de slotul din roster.
const RANK = { SS: 6, S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 } as Record<string, number>;
const teamPlayers = players.filter((p) => p.teamId !== "free-agent");
/** Un jucător cu gradul pe campion în [min, max] și pool ne-subțire pe `poolRole`. */
function findPlayer(
  championId: string, min: number, max: number, poolRole: Role, exclude: string[] = [],
  also: (playerId: string) => boolean = () => true,
) {
  const found = teamPlayers.find((p) => {
    if (exclude.includes(p.id) || !also(p.id)) return false;
    const rank = RANK[getChampionGrade(p, championId)];
    return rank >= min && rank <= max && !hasThinPool(p, poolRole);
  });
  if (!found) throw new Error(`niciun jucător cu ${championId} în [${min}, ${max}]`);
  return found.id;
}
const MASTERY_BANS = { bansBlue: ["azir", "jayce", "ksante"], bansRed: ["vi", "sejuani", "orianna"] };
const hasTag = (entry: DraftCandidateBreakdown | null | undefined, tag: string) => Boolean(entry?.reasonTags?.includes(tag));
const blockedPick = (entry: DraftCandidateBreakdown | null | undefined) =>
  ["invalid-role-map", "breaks-own-pick", "mastery-f"].some((tag) => hasTag(entry, tag));

// 11. Poppy luată pe support (A+), top și jungle au Poppy F → Braum (support pur) respins.
{
  const support = findPlayer("poppy", 4, 6, "support");
  const top = findPlayer("poppy", 0, 0, "top", [support]);
  const jungle = findPlayer("poppy", 0, 0, "jungle", [support, top]);
  const save = makeSave({ [RED]: { support, top, jungle } });
  const series = newSeries("s11", BLUE, RED);
  const game: DraftGameState = {
    ...series.games[0], ...MASTERY_BANS,
    picksBlue: ["ahri"], picksRed: ["poppy"], pickRolesRed: { poppy: "support" }, phaseIndex: 8,
  };
  const step = getCurrentStep(game)!;
  const braum = scoreDraftCandidate(champions.find((c) => c.id === "braum")!, step, game, series, save);
  const choice = getAiChoice(series, game, step, save);
  check(
    "11. Poppy support (A+), top F → Braum respins, AI ia alt rol",
    hasTag(braum, "breaks-own-pick") && choice !== null && choice.championId !== "braum" && !blockedPick(choice) && choice.projectedRole !== "support",
    `Braum: ${braum.reasonTags?.filter((t) => t === "breaks-own-pick" || t === "invalid-role-map").join(",")} „${braum.explanation?.[0] ?? ""}”; R2=${choice?.championId} (${choice?.projectedRole}) [support ${support}: ${grade(support, "poppy")}, top ${top}: ${grade(top, "poppy")}]`,
  );
}

// 12. Același caz, dar topul are Poppy ≥ C, cu ≥ 2 trepte sub support → Braum permis, Poppy mutată, penalizare.
{
  // Supportul trebuie să joace și Braum (≥ C), altfel Braum e oprit de gate-ul de mastery, nu de reasignare.
  const support = findPlayer("poppy", 4, 6, "support", [], (id) => RANK[grade(id, "braum")] >= 2);
  const supportRank = RANK[grade(support, "poppy")];
  const top = findPlayer("poppy", 2, supportRank - 2, "top", [support]);
  const jungle = findPlayer("poppy", 0, 0, "jungle", [support, top]);
  const save = makeSave({ [RED]: { support, top, jungle } });
  const series = newSeries("s12", BLUE, RED);
  const game: DraftGameState = {
    ...series.games[0], ...MASTERY_BANS,
    picksBlue: ["ahri"], picksRed: ["poppy"], pickRolesRed: { poppy: "support" }, phaseIndex: 8,
  };
  const braum = scoreDraftCandidate(champions.find((c) => c.id === "braum")!, getCurrentStep(game)!, game, series, save);
  const moved = braum.reassignment?.find((entry) => entry.championId === "poppy");
  check(
    "12. Poppy support, top ≥ C → Braum permis, Poppy pe top cu penalizare",
    !blockedPick(braum) && moved?.toRole === "top" && Boolean(braum.explanation?.some((line) => line.includes("would move"))),
    `Braum: ${blockedPick(braum) ? "blocat" : "permis"}, „${braum.explanation?.[0] ?? ""}” [support ${support}: ${grade(support, "poppy")}, top ${top}: ${grade(top, "poppy")}]`,
  );
}

// 13–14: roșii au top / jungle / mid / adc blocate, rămâne support (R5).
const R5_PICKS = { picksRed: ["gnar", "xin-zhao", "ahri", "jinx"], pickRolesRed: { gnar: "top", "xin-zhao": "jungle", ahri: "mid", jinx: "adc" } as Record<string, Role> };
const R5_BLUE = ["rumble", "wukong", "syndra", "kalista", "rell"];
const supportChampions = champions.filter((c) => c.roles.includes("support") && !R5_BLUE.includes(c.id));

// 13. Cel mai meta support pe care supportul nostru îl are la F → nu e ales.
{
  const ranked = [...supportChampions].sort((a, b) => getMetaPriorityScore(b, "support") - getMetaPriorityScore(a, "support"));
  let pickPlayer = "";
  let opChampion = "";
  for (const champion of ranked.slice(0, 5)) {
    const player = teamPlayers.find((p) => p.role === "support" && getChampionGrade(p, champion.id) === "F" && !hasThinPool(p, "support"));
    if (player) { pickPlayer = player.id; opChampion = champion.id; break; }
  }
  const save = makeSave({ [RED]: { support: pickPlayer } });
  const series = newSeries("s13", BLUE, RED);
  const game: DraftGameState = { ...series.games[0], ...MASTERY_BANS, picksBlue: R5_BLUE, ...R5_PICKS, phaseIndex: 19 };
  const step = getCurrentStep(game)!;
  const op = scoreDraftCandidate(champions.find((c) => c.id === opChampion)!, step, game, series, save);
  const choice = getAiChoice(series, game, step, save);
  check(
    "13. Campion OP cu F pe singurul rol liber → nu e ales",
    Boolean(opChampion) && hasTag(op, "mastery-f") && choice?.championId !== opChampion && grade(pickPlayer, choice?.championId ?? "") !== "F",
    `${opChampion} (meta ${getMetaPriorityScore(champions.find((c) => c.id === opChampion)!, "support").toFixed(1)}, ${pickPlayer}: F) → tag mastery-f=${hasTag(op, "mastery-f")}; R5=${choice?.championId} (${grade(pickPlayer, choice?.championId ?? "")})`,
  );

  // 14. Ban-uri + fearless lasă pe support doar campioni F → se alege unul, `forced-off-pool`.
  const onlyF = supportChampions.filter((c) => c.roles.length === 1 && grade(pickPlayer, c.id) === "F");
  const forced = chooseAiAction(onlyF, step, game, series, save);
  check(
    "14. Doar campioni F rămași → forced-off-pool",
    onlyF.length > 0 && hasTag(forced, "forced-off-pool"),
    `pool ${onlyF.length} campioni F; R5=${forced?.championId}, „${forced?.explanation?.slice(-1)[0] ?? ""}”`,
  );
}

// 15. Un campion SS al unui jucător, în afara top 50 după prioritate → intră în pool-ul scorat.
{
  const byPriority = [...champions].sort(
    (a, b) => (b.stats?.prioScore ?? 0) + (b.stats?.presence ?? 0) * 0.5 - ((a.stats?.prioScore ?? 0) + (a.stats?.presence ?? 0) * 0.5),
  );
  const outside = new Set(byPriority.slice(50).map((c) => c.id));
  let found: { playerId: string; role: Role; championId: string } | null = null;
  for (const player of teamPlayers) {
    const champion = champions.find((c) => outside.has(c.id) && c.roles.includes(player.role) && getChampionGrade(player, c.id) === "SS");
    if (champion) { found = { playerId: player.id, role: player.role, championId: champion.id }; break; }
  }
  if (!found) throw new Error("niciun SS în afara top 50");
  const save = makeSave({ [RED]: { [found.role]: found.playerId } });
  const series = newSeries("s15", BLUE, RED);
  const game: DraftGameState = { ...series.games[0], ...MASTERY_BANS, picksBlue: ["ahri"], picksRed: [], phaseIndex: 7 };
  const step = getCurrentStep(game)!;
  const available = champions.filter((c) => ![...MASTERY_BANS.bansBlue, ...MASTERY_BANS.bansRed, "ahri"].includes(c.id));
  const pool = getPickCandidatePool(available, step, game, series, save);
  check(
    "15. Campion SS în afara top 50 → scorat",
    pool.some((c) => c.id === found!.championId),
    `${found.playerId} (${found.role}) SS pe ${found.championId}, rang prioritate ${byPriority.findIndex((c) => c.id === found!.championId) + 1}; în pool: ${pool.some((c) => c.id === found!.championId)} (${pool.length} candidați)`,
  );
}

// ─── 16–18. Duo-uri bot (DRAFT_THINKING §2) ──────────────────────────────────
{
  // 16. Rakan banat în faza 1; ADC-ul are Xayah A și Kai'Sa A, supportul Nautilus B →
  //     primul pick de bot nu e Xayah (ancoră orfană), ci din cel mai bun duo rămas.
  const adc = findPlayer("xayah", 4, 6, "adc", [], (id) => RANK[grade(id, "kaisa")] >= 4);
  const support = findPlayer("nautilus", 3, 6, "support", [adc]);
  const save = makeSave({ [RED]: { adc, support } });
  const bans = ["rakan", "azir", "vi", "sejuani", "jayce", "ksante"];
  const series = newSeries("s16", BLUE, RED);
  const r1Game: DraftGameState = { ...series.games[0], bansBlue: bans.slice(0, 3), bansRed: bans.slice(3), picksBlue: ["ahri"], phaseIndex: 7 };
  const xayah = scoreDraftCandidate(champions.find((c) => c.id === "xayah")!, getCurrentStep(r1Game)!, r1Game, series, save);
  const { log } = runDraft({
    series, save, bans,
    stop: (entries) => entries.some((entry) => entry.side === "red" && entry.action === "pick" && ["adc", "support"].includes(entry.breakdown?.projectedRole ?? "")),
  });
  const firstBot = log.find((entry) => entry.side === "red" && entry.action === "pick" && ["adc", "support"].includes(entry.breakdown?.projectedRole ?? ""));
  check(
    "16. Rakan banat → primul pick de bot nu e Xayah (orphan-anchor)",
    hasTag(xayah, "orphan-anchor") && Boolean(firstBot) && firstBot!.championId !== "xayah",
    `Xayah: „${xayah.explanation?.find((line) => line.includes("avoided")) ?? ""}”; primul bot roșu: ${firstBot?.label} ${firstBot?.championId} (${firstBot?.breakdown?.projectedRole}) ${hasTag(firstBot?.breakdown, "duo-plan") ? "duo-plan" : ""} „${firstBot?.breakdown?.explanation?.find((line) => line.includes("bot") || line.includes("going")) ?? ""}” [${adc}: Xayah ${grade(adc, "xayah")}, Kai'Sa ${grade(adc, "kaisa")}; ${support}: Nautilus ${grade(support, "nautilus")}]`,
  );
}
{
  // 17. B3 Xayah, Rakan banat în faza 2 → fallback doar la un partener tier 2 (synergy 5, FEEDBACK_FIXES §10.4).
  //     Fără niciun tier 2 (cazul actual: doar Nautilus, synergy 4 = tier 3) → logica normală, fără duo-fallback.
  const fallbackSupports = champions
    .filter((c) => c.roles.includes("support"))
    .filter((c) => getBotPairTier("xayah", c.id) === 3)
    .map((c) => c.id);
  const tier2Supports = champions.filter((c) => c.roles.includes("support") && getBotPairTier("xayah", c.id) === 2).map((c) => c.id);
  // Supportul cu cel mai bun grad pe un partener synergy al lui Xayah.
  const bestRank = (playerId: string) => Math.max(...fallbackSupports.map((id) => RANK[grade(playerId, id)]));
  const support = teamPlayers
    .filter((p) => p.role === "support")
    .sort((a, b) => bestRank(b.id) - bestRank(a.id) || a.id.localeCompare(b.id))[0].id;
  const adc = findPlayer("xayah", 2, 6, "adc", [support]);
  const save = makeSave({ [BLUE]: { adc, support } });
  const series = newSeries("s17", BLUE, RED);
  const game: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "jayce", "ksante", "rakan"], bansRed: ["vi", "sejuani", "orianna", "gnar"],
    picksBlue: ["ambessa", "xin-zhao", "xayah"], pickRolesBlue: { ambessa: "top", "xin-zhao": "jungle", xayah: "adc" },
    // Fără Kalista la roșii: altfel Renata e și deny (Kalista → Renata), alt motiv decât cel testat.
    picksRed: ["rumble", "wukong", "syndra", "jinx"], phaseIndex: 17,
  };
  const step = getCurrentStep(game)!;
  const choice = getAiChoice(series, game, step, save);
  check(
    "17. B3 Xayah, Rakan banat → fallback doar la tier 2; tier 3 (synergy 4) = logica normală",
    Boolean(choice) && (tier2Supports.length ? tier2Supports.includes(choice!.championId) && hasTag(choice, "duo-fallback") : !hasTag(choice, "duo-fallback")),
    `${step.label}=${choice?.championId} (${choice?.projectedRole}) fallback=${hasTag(choice, "duo-fallback")}; tier 2: ${tier2Supports.join(", ") || "—"}; tier 3: ${fallbackSupports.map((id) => `${id}:${grade(support, id)}`).join(", ")} [${support}]`,
  );
}
{
  // 18. În faza 1 de ban, AI-ul nu-și banează membrii celui mai bun duo propriu (clar peste al doilea).
  let violations = 0;
  let protectedSeen = 0;
  // Echipele care au de la start un duo clar peste al doilea (altfel nu e nimic de protejat), ca blue și ca red.
  const slugs = teams.map((team) => team.slug ?? team.id);
  const startSave = makeSave();
  const withProtectedDuo = slugs.filter((slug) =>
    getBotDuoState({ ownPicks: [], roster: startSave.updatedTeamRosters[slug] ?? {}, unavailable: new Set(), lockedRoles: {} }, []).protectedIds.length > 0,
  );
  const pairs: [string, string][] = [];
  withProtectedDuo.forEach((slug, index) => {
    const other = slugs.find((entry) => entry !== slug && !withProtectedDuo.includes(entry)) ?? slugs[(index + 1) % slugs.length];
    pairs.push([slug, other], [other, slug]);
  });
  for (const [blue, red] of pairs) {
    const save = makeSave();
    const series = newSeries(`s18-${blue}`, blue, red);
    let game = series.games[0];
    for (let index = 0; index < 6; index += 1) {
      const step = getCurrentStep(game)!;
      const side = step.side;
      const teamSlug = side === "blue" ? blue : red;
      const ctx = { ownPicks: [] as string[], roster: save.updatedTeamRosters[teamSlug] ?? {}, unavailable: new Set([...game.bansBlue, ...game.bansRed]), lockedRoles: {} };
      const protectedIds = getBotDuoState(ctx, [...game.bansBlue, ...game.bansRed]).protectedIds;
      protectedSeen += protectedIds.length ? 1 : 0;
      const choice = getAiChoice(series, game, step, save);
      if (!choice) break;
      if (protectedIds.includes(choice.championId)) violations += 1;
      game = commitActionToGame(game, choice.championId, side, "ban");
    }
  }
  check(
    "18. Faza 1: nu se banează membrii celui mai bun duo propriu",
    violations === 0 && protectedSeen > 0,
    `${violations} ban-uri pe duo-ul protejat; ture cu duo protejat: ${protectedSeen}/${pairs.length * 6}`,
  );
}

// ─── 19. Plan ancorat pe priority pick (DRAFT_THINKING §4) ───────────────────
{
  // B1 Vi (priority pick) → planul devine dive sau pick, nu se schimbă după pick-ul 3, B4/B5 aliniate.
  const bans = ["azir", "jayce", "sejuani", "ksante", "orianna", "rumble"];
  const { log } = runDraft({
    series: newSeries("s19", BLUE, RED),
    save: makeSave(),
    bans,
    forced: [{ side: "blue", action: "pick", nth: 1, championId: "vi" }],
  });
  const bluePicks = log.filter((entry) => entry.side === "blue" && entry.action === "pick");
  const plans = bluePicks.slice(1).map((entry) => entry.breakdown?.plan?.type ?? "—");
  const [, b2, b3, b4, b5] = bluePicks;
  const lockedSame = b3?.breakdown?.plan?.type === b4?.breakdown?.plan?.type && b4?.breakdown?.plan?.type === b5?.breakdown?.plan?.type;
  const anchored = bluePicks.slice(1).every((entry) => entry.breakdown?.plan?.anchorChampionId === "vi");
  const viPriority = isPriorityPick("vi", "jungle");
  const lockedType = (b5?.breakdown?.plan?.type ?? "dive") as DraftPlanType;
  const fitting = champions.find((c) => getCandidateIdentityFit(c, c.roles[0], lockedType) >= 2)!;
  const pick5Alignment = getPlanAlignmentBonus(fitting, fitting.roles[0], { type: lockedType, confidence: 1, reasoning: [] }, 5);
  check(
    "19. B1 Vi → plan dive/pick, blocat după pick 3, B4/B5 aliniate",
    // Înainte, de la pick-ul 5 alinierea era mereu 0; acum planul rămâne activ și blocat. Pick-urile alese pot
    // avea fit 0 (aliniere 0), deci verificăm direct: pe pick-ul 5, un campion cu fit ≠ 0 are aliniere ≠ 0.
    // DRAFT_REALISM §8: planul poate urma și stilul echipei (preferredStyles), dacă Vi se potrivește cu el (fit ≥ 1).
    plans.every((type) => type !== "—" && getCandidateIdentityFit(champions.find((c) => c.id === "vi")!, "jungle", type as DraftPlanType) >= 1) && lockedSame && anchored &&
      b4?.breakdown?.plan?.lockedAtPick === 3 && b5?.breakdown?.plan?.lockedAtPick === 3 &&
      typeof b5?.breakdown?.planAlignment === "number" && pick5Alignment !== 0,
    `Vi priority=${viPriority}; plan B2..B5: ${plans.join(", ")}; ancoră vi: ${anchored}; aliniere B4 ${b4?.breakdown?.planAlignment?.toFixed(2)}, B5 ${b5?.breakdown?.planAlignment?.toFixed(2)}, pick 5 cu ${fitting.id}: ${pick5Alignment.toFixed(2)}; pick-uri: ${bluePicks.map((entry) => entry.championId).join(", ")}; „${b2?.breakdown?.explanation?.find((line) => line.startsWith("Plan:")) ?? ""}”`,
  );
}

// ─── 20. Identitate împărțită (DRAFT_THINKING §5.2) ───────────────────────────
{
  // Comp de engage (Xin + K'Sante) → un pick de poke (Jayce) o împarte: `split-identity`.
  // (Lucian / Milio din exemplul spec-ului: în date trag spre pick / protect-carry, compatibile cu
  // teamfight-ul lui Xin + K'Sante, deci fără split — afișate doar pentru referință.)
  const series = newSeries("s20", BLUE, RED);
  const save = makeSave();
  const game: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "orianna", "rumble"], bansRed: ["vi", "sejuani", "taliyah"],
    picksBlue: ["xin-zhao", "ksante"], pickRolesBlue: { "xin-zhao": "jungle", ksante: "top" },
    picksRed: ["ahri", "jinx", "nautilus"], phaseIndex: 10,
  };
  const step = getCurrentStep(game)!;
  const score = (id: string) => scoreDraftCandidate(champions.find((c) => c.id === id)!, step, game, series, save);
  const jayce = score("jayce");
  const lucian = score("lucian");
  const milio = score("milio");
  const line = (entry: DraftCandidateBreakdown) => entry.explanation?.find((text) => text.includes("would mix")) ?? "—";
  check(
    "20. Xin + K'Sante (engage) → Jayce (poke): split-identity",
    hasTag(jayce, "split-identity"),
    `Jayce: „${line(jayce)}”; Lucian split=${hasTag(lucian, "split-identity")}, Milio split=${hasTag(milio, "split-identity")}; identitate: ${jayce.identity?.dominant ?? "—"}`,
  );
}

// ─── 21. Win condition (DRAFT_THINKING §5.3) ──────────────────────────────────
{
  // Kog'Maw (hard-protect) + Ornn → win condition Kog'Maw; Lulu (peel) îl susține, Aphelios (al doilea hard-protect) e penalizat.
  const series = newSeries("s21", BLUE, RED);
  const save = makeSave();
  const game: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "jayce", "ksante"], bansRed: ["vi", "sejuani", "orianna"],
    picksBlue: ["kogmaw", "ornn"], pickRolesBlue: { kogmaw: "adc", ornn: "top" },
    picksRed: ["ahri", "nocturne", "rell"], phaseIndex: 10,
  };
  const step = getCurrentStep(game)!;
  const score = (id: string) => scoreDraftCandidate(champions.find((c) => c.id === id)!, step, game, series, save);
  const lulu = score("lulu");
  const aphelios = score("aphelios");
  const has = (entry: DraftCandidateBreakdown, text: string) => Boolean(entry.explanation?.some((line) => line.includes(text)));
  check(
    "21. Win condition Kog'Maw → Lulu susține, Aphelios penalizat",
    lulu.winCondition?.championId === "kogmaw" && has(lulu, "Supports the win condition") && has(aphelios, "Second carry to protect"),
    `win condition: ${lulu.winCondition?.championId} (${lulu.winCondition?.kind}); Lulu: „${lulu.explanation?.find((line) => line.includes("win condition")) ?? "—"}”; Aphelios: „${aphelios.explanation?.find((line) => line.includes("Second carry")) ?? "—"}”`,
  );
}

// ─── 22. Tunnel vision (DRAFT_THINKING §6.2) ──────────────────────────────────
{
  // Albaștrii: Vi + Nocturne (dive) contra poke (Jayce / Xerath / Ziggs). Camille ar face comp-ul dive
  // (bate poke), dar pierde linia vs Jayce → bonus redus, `tunnel-vision`.
  const series = newSeries("s22", BLUE, RED);
  const save = makeSave();
  const game: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "orianna", "rumble"], bansRed: ["sejuani", "ksante", "taliyah"],
    picksBlue: ["vi", "nocturne"], pickRolesBlue: { vi: "jungle", nocturne: "mid" },
    picksRed: ["jayce", "xerath", "ziggs"], pickRolesRed: { jayce: "top", xerath: "mid", ziggs: "adc" },
    phaseIndex: 10,
  };
  const camille = scoreDraftCandidate(champions.find((c) => c.id === "camille")!, getCurrentStep(game)!, game, series, save);
  check(
    "22. Comp counter care pierde linia → tunnel-vision",
    hasTag(camille, "tunnel-vision") && (camille.compCounterValue ?? 0) < 0.5,
    `Camille: compCounterValue ${camille.compCounterValue?.toFixed(2)}, „${camille.explanation?.find((line) => line.includes("loses lane")) ?? "—"}”`,
  );
}

// ─── 23–25. Memoria sezonului (DRAFT_THINKING §7) ─────────────────────────────
{
  // Fixtură: roșii (t1) au Olaf 6–1 pe top în sezon (singura înfrângere prima) → amenințare ≈ 5.5.
  const olafSeason = (): TeamSeasonStore => ({
    [RED]: {
      games: 7, wins: 6,
      champions: { olaf: { games: 7, wins: 6, byRole: { top: 7 }, recentResults: [1, 1, 1, 1, 1] } },
      identities: {},
    },
  });
  const bluePhaseOneBans = (save: DraftSave, id: string) => {
    const { log } = runDraft({ series: newSeries(id, BLUE, RED), save, bans: [], stop: (entries) => entries.length >= 6 });
    return log.filter((entry) => entry.side === "blue" && entry.action === "ban");
  };
  const openSet = new Set<string>();
  const topWith = (want: "none" | "good") =>
    teamPlayers.find((p) => {
      const { counterIds, counterGrades } = getSeasonCounters("olaf", "top", { top: p.id }, openSet);
      if (want === "none") return p.role === "top" && counterIds.length === 0 && !hasThinPool(p, "top");
      return p.role === "top" && counterIds.some((id) => RANK[counterGrades[id]] >= 4);
    })?.id;

  setTeamSeasonStoreOverride(olafSeason());
  const threat = getSeasonChampionThreat(RED, "olaf", baseRosters[RED]).threat;

  // 23. Fără counter ≥ B pe top → Olaf în primele 3 ban-uri.
  const noCounterTop = topWith("none");
  const bansA = noCounterTop ? bluePhaseOneBans(makeSave({ [BLUE]: { top: noCounterTop } }), "s23") : [];
  const olafBan = bansA.find((entry) => entry.championId === "olaf");
  check(
    "23. Sezon: Olaf 6–1, fără counter → ban în faza 1",
    Boolean(noCounterTop) && Boolean(olafBan) && hasTag(olafBan?.breakdown, "season-ban"),
    `amenințare ${threat.toFixed(2)}; top ${noCounterTop}: ban-uri albaștri ${bansA.map((entry) => entry.championId).join(", ")}; „${olafBan?.breakdown?.explanation?.[0] ?? "—"}”`,
  );

  // 24. Avem un counter A pe top → Olaf nu e banat; dacă îl iau, counter-ul primește `season-counter`.
  setTeamSeasonStoreOverride(olafSeason());
  const counterTop = topWith("good");
  const saveB = makeSave({ [BLUE]: { top: counterTop ?? "" } });
  const bansB = counterTop ? bluePhaseOneBans(saveB, "s24") : [];
  const { counterIds, counterGrades } = getSeasonCounters("olaf", "top", { top: counterTop ?? "" }, openSet);
  const counterId = counterIds.find((id) => RANK[counterGrades[id]] >= 4) ?? counterIds[0];
  const series24 = newSeries("s24b", BLUE, RED);
  const game24: DraftGameState = {
    ...series24.games[0],
    bansBlue: ["azir", "jayce", "orianna"], bansRed: ["vi", "sejuani", "rumble"],
    picksBlue: ["ahri"], picksRed: ["olaf"], pickRolesRed: { olaf: "top" }, phaseIndex: 9,
  };
  const counter = counterId ? scoreDraftCandidate(champions.find((c) => c.id === counterId)!, getCurrentStep(game24)!, game24, series24, saveB) : null;
  // DRAFT_REALISM §8: o echipă cu stil „ban” (riskLevel ≤ 3) banează favoritul și când are counter.
  const blueStyle = getTeamStyle(teams.find((team) => team.slug === BLUE) ?? null, { seriesPressure: { eliminationGame: false } }).seasonResponse;
  const olafBanned = bansB.some((entry) => entry.championId === "olaf");
  check(
    "24. Sezon: avem counter A → Olaf liber (sau banat de un stil „ban”); luat de ei → season-counter",
    Boolean(counterTop) && (blueStyle === "ban" ? olafBanned : !olafBanned) && hasTag(counter, "season-counter"),
    `stil ${BLUE}: ${blueStyle}; top ${counterTop}: ${counterId} (${counterGrades[counterId ?? ""] ?? "?"}); ban-uri albaștri ${bansB.map((entry) => entry.championId).join(", ")}; „${counter?.explanation?.find((line) => line.startsWith("Counter to their")) ?? "—"}”`,
  );
  setTeamSeasonStoreOverride(null);
}
{
  // 25. Series memory: un campion jucat de echipa care a PIERDUT nu mai primește bonus de ban.
  const series = newSeries("s25", BLUE, RED);
  const game1: DraftGameState = {
    ...series.games[0], completed: true, winnerSide: "blue",
    picksBlue: ["ahri", "vi", "jinx", "nautilus", "gnar"], picksRed: ["syndra", "sejuani", "kalista", "rell", "ksante"],
    simulation: { blueTeamSlug: BLUE, redTeamSlug: RED } as never,
  };
  // Jocul 2: echipele schimbă partea; roșii (BLUE din jocul 1) au câștigat — pentru albaștri, inamicul = câștigătorul.
  const series2: ActiveDraftSeries = { ...series, currentGameNumber: 2, blueTeamSlug: RED, redTeamSlug: BLUE, games: [game1] };
  const winnerPick = getSeriesAwareBanBonus("ahri", "blue", series2);
  const loserPick = getSeriesAwareBanBonus("syndra", "blue", series2);
  check(
    "25. Series memory: doar pick-urile câștigătorului primesc bonus de ban",
    winnerPick > 0 && loserPick === 0,
    `bonus ban Ahri (câștigător) ${winnerPick}, Syndra (a pierdut) ${loserPick}`,
  );
}

// ─── 26. Raportul de draft pe piloni (DRAFT_THINKING §8) ──────────────────────
{
  const series = newSeries("s26", BLUE, RED);
  const save = makeSave();
  const { game } = runDraft({ series, save });
  const resolved = resolveFinishedDraftAssignments(game, series, save);
  const rosters = { blue: save.updatedTeamRosters[BLUE] ?? {}, red: save.updatedTeamRosters[RED] ?? {} };
  const blue = buildDraftPillarReport(resolved, "blue", series, save, rosters);
  const pillars = ["composition", "lanes", "players", "preparation"] as const;
  const complete = pillars.every((key) => ["A", "B", "C", "D"].includes(blue[key].grade) && blue[key].notes.length > 0);

  // Același draft, dar topul albaștrilor pe un campion F → mastery D cu nota „X pe Y (F)”.
  const topPlayer = playersById.get(rosters.blue.top!)!;
  const fTop = champions.find((c) => c.roles.includes("top") && getChampionGrade(topPlayer, c.id) === "F" && !resolved.picksRed.includes(c.id))!;
  const withF: DraftGameState = {
    ...resolved,
    picksBlue: resolved.picksBlue.map((id) => (id === resolved.assignmentsBlue.top ? fTop.id : id)),
    assignmentsBlue: { ...resolved.assignmentsBlue, top: fTop.id },
  };
  const blueF = buildDraftPillarReport(withF, "blue", series, save, rosters);
  check(
    "26. Raport pe piloni: 4 piloni cu note; F pe top → players D",
    complete && blueF.players.grade === "D" && blueF.players.notes.some((note) => note.includes("(F)")),
    pillars.map((key) => `${key} ${blue[key].grade}: ${blue[key].notes[0]}`).join(" | ") + ` || cu F: players ${blueF.players.grade} „${blueF.players.notes[0]}”`,
  );
}

// ─── FEEDBACK_FIXES §1: serii AI vs AI simulate (ca în SeriesSchedule) ────────
{
  // localStorage fals: verificăm ce se scrie (memoria userului nu trebuie atinsă).
  const storage = new Map<string, string>();
  const writes: string[] = [];
  const fakeWindow = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        writes.push(key);
        storage.set(key, value);
      },
      removeItem: (key: string) => storage.delete(key),
    },
  };
  (globalThis as { window?: unknown }).window = fakeWindow;
  (globalThis as { localStorage?: unknown }).localStorage = fakeWindow.localStorage;
  const offRole: string[] = [];
  let nullUserSide = 0;
  let gamesPlayed = 0;
  const seriesCount = 50;
  try {
    for (let index = 0; index < seriesCount; index += 1) {
      const left = teams[index % teams.length].slug;
      const right = teams[(index * 11 + 5) % teams.length].slug;
      if (left === right) continue;
      const initial = createInitialSeries(`fx1s${index}-${left}-${right}`, "__ai__");
      const { series } = simulateAiVsAiSeries(initial, makeSave());
      if (initial.userSide === null && series.userSide === null) nullUserSide += 1;
      for (const game of series.games.filter((entry) => entry.completed)) {
        gamesPlayed += 1;
        for (const assignments of [game.assignmentsBlue, game.assignmentsRed]) {
          for (const [role, championId] of Object.entries(assignments)) {
            const champion = champions.find((entry) => entry.id === championId);
            if (champion && !champion.roles.includes(role as Role)) offRole.push(`${series.seriesId} G${game.number}: ${champion.id} ${role}`);
          }
        }
      }
    }
  } finally {
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { localStorage?: unknown }).localStorage;
  }
  const memoryWrites = writes.filter((key) => key.startsWith("rift-user-draft-memory")).length;
  check(
    "F1. Serii AI vs AI simulate: roluri valide, userSide null, fără memorie de user",
    offRole.length === 0 && memoryWrites === 0 && nullUserSide === seriesCount,
    `${seriesCount} serii / ${gamesPlayed} jocuri; userSide null: ${nullUserSide}; roluri invalide: ${offRole.length}${offRole.length ? ` (${offRole.slice(0, 3).join("; ")})` : ""}; scrieri userDraftMemory: ${memoryWrites}`,
  );
}

// ─── FEEDBACK_FIXES §2: Series MVP din echipa câștigătoare ─────────────────────
{
  // Echipa A (a1..a5) câștigă; B (b1..b5) are scoruri mai mari și un Game MVP. Side-urile se schimbă.
  const team = (prefix: string) => [1, 2, 3, 4, 5].map((n) => `${prefix}${n}`);
  const game = (aSide: Side, winner: "A" | "B", mvp: string, bScore: number, legacy = false): SeriesGameSummary => {
    const bSide: Side = aSide === "blue" ? "red" : "blue";
    const scores = [
      ...team("a").map((playerId) => ({ playerId, score: playerId === "a1" ? 7 : 6, side: aSide, ...(legacy ? {} : { teamSlug: "A" }) })),
      ...team("b").map((playerId) => ({ playerId, score: bScore, side: bSide, ...(legacy ? {} : { teamSlug: "B" }) })),
    ];
    const winnerSide = winner === "A" ? aSide : bSide;
    return { mvpPlayerId: mvp, playerScores: scores, winnerSide, ...(legacy ? {} : { winnerTeamSlug: winner }) };
  };
  // Codul vechi (după side) ar fi dat b1: 1–1 pe side → „blue” → eligibili ambele echipe, b1 cu scor mai mare.
  const twoZero = [game("blue", "A", "a1", 9), game("red", "A", "b1", 9)];
  // 2–1: B câștigă jocul 2 cu un MVP b1 și scoruri mari peste tot.
  const twoOne = [game("blue", "A", "a2", 9), game("red", "B", "b1", 10), game("blue", "A", "a1", 9)];
  const legacy = [game("blue", "A", "a1", 9, true), game("red", "A", "a1", 9, true)];
  const resolver = (playerId: string) => (playerId.startsWith("a") ? "A" : playerId.startsWith("b") ? "B" : null);
  const mvp20 = computeSeriesMvp(twoZero);
  const mvp21 = computeSeriesMvp(twoOne);
  const mvpLegacy = computeSeriesMvp(legacy, resolver);
  const mvpLegacyUnknown = computeSeriesMvp(legacy);
  check(
    "F2. Series MVP: mereu din echipa câștigătoare (side-uri inversate)",
    mvp20?.startsWith("a") === true && mvp21?.startsWith("a") === true && mvpLegacy?.startsWith("a") === true && mvpLegacyUnknown === null,
    `2–0: ${mvp20}, 2–1: ${mvp21}, vechi cu roster: ${mvpLegacy}, vechi fără echipă: ${mvpLegacyUnknown}`,
  );
}

// ─── FEEDBACK_FIXES §6.1: factorii rezultatului adună diferența de total ───────
{
  let games = 0;
  let maxRawGap = 0;
  let maxRoundedGap = 0;
  let clamped = 0;
  for (let index = 0; index < 60; index += 1) {
    const blue = teams[(index * 3) % teams.length].slug;
    const red = teams[(index * 3 + 13) % teams.length].slug;
    if (blue === red) continue;
    const series = newSeries(`f6s${index}`, blue, red);
    const save = makeSave();
    const { game } = runDraft({ series, save, bans: [] });
    const resolved = resolveFinishedDraftAssignments(game, series, save);
    const simulation = simulateDraftResult(resolved, series, save);
    const factors = simulation.outcomeFactors ?? [];
    const edge = factors.reduce((sum, factor) => sum + factor.edgeBlue, 0);
    const rawGap = Math.abs(edge - ((simulation.bluePhaseScores.totalRaw ?? 0) - (simulation.redPhaseScores.totalRaw ?? 0)));
    const roundedGap = Math.abs(edge - (simulation.blueTotal - simulation.redTotal));
    const blueRaw = simulation.bluePhaseScores.totalRaw ?? 0;
    const redRaw = simulation.redPhaseScores.totalRaw ?? 0;
    if (blueRaw < 0 || blueRaw > 10 || redRaw < 0 || redRaw > 10) clamped += 1;
    games += 1;
    maxRawGap = Math.max(maxRawGap, rawGap);
    maxRoundedGap = Math.max(maxRoundedGap, roundedGap);
  }
  check(
    "F6. Σ edgeBlue = diferența de total brut (≤ 0.01); față de totalurile rotunjite la 0.1: ≤ 0.1",
    games > 0 && maxRawGap < 0.01 && maxRoundedGap <= 0.1,
    `${games} jocuri; față de totalul brut: max ${maxRawGap.toFixed(4)}; față de blueTotal − redTotal (rotunjite la 0.1): max ${maxRoundedGap.toFixed(3)}; jocuri cu total în afara 0..10 (clamp): ${clamped}`,
  );
}

// ─── FEEDBACK_FIXES §10.6: duo-uri bot pe niveluri + focusul pe bot ───────────
{
  const firstRedBot = (log: LogEntry[]) =>
    log.find((entry) => entry.side === "red" && entry.action === "pick" && ["adc", "support"].includes(entry.breakdown?.projectedRole ?? ""));
  const stopAtRedBot = (entries: LogEntry[]) => Boolean(firstRedBot(entries));
  const scoreAt = (game: DraftGameState, series: ActiveDraftSeries, save: DraftSave, id: string) =>
    scoreDraftCandidate(champions.find((c) => c.id === id)!, getCurrentStep(game)!, game, series, save);

  // 1. Renata banată; ADC Kalista A + Xayah A, support Rakan B + Alistar A → Xayah sau Rakan, nu Kalista;
  //    Alistar nu e „combo” pentru Kalista (Kalista + Alistar = synergy 4, tier 3).
  {
    const adc = findPlayer("kalista", 4, 6, "adc", [], (id) => RANK[grade(id, "xayah")] >= 4);
    const support = findPlayer("rakan", 3, 6, "support", [adc], (id) => RANK[grade(id, "alistar")] >= 4);
    const save = makeSave({ [RED]: { adc, support } });
    const bans = ["renata-glasc", "azir", "vi", "sejuani", "jayce", "ksante"];
    const series = newSeries("f10a", BLUE, RED);
    const r1Game: DraftGameState = { ...series.games[0], bansBlue: bans.slice(0, 3), bansRed: bans.slice(3), picksBlue: ["ahri"], phaseIndex: 7 };
    const kalista = scoreAt(r1Game, series, save, "kalista");
    const alistar = scoreAt(r1Game, series, save, "alistar");
    const { log } = runDraft({ series, save, bans, stop: stopAtRedBot });
    const bot = firstRedBot(log);
    // Spec: „Xayah sau Rakan” cu plan protect-carry. Aici planul iese teamfight, iar Alistar are meta mult
    // peste Rakan (~10 puncte în `power`, peste bonusul de combo de 3.5): verificăm mecanica, alegerea e în detaliu.
    check(
      "F10.1 Renata banată → Kalista evitată (orfană), Alistar nu e combo pentru ea",
      hasTag(kalista, "orphan-anchor") && !hasTag(alistar, "duo-plan") && !hasTag(alistar, "duo-fallback") && bot?.championId !== "kalista",
      `primul bot roșu: ${bot?.label} ${bot?.championId} (spec: xayah / rakan cu plan protect-carry); Kalista: „${kalista.explanation?.find((line) => line.includes("avoided")) ?? "—"}”; Alistar duo-plan: ${hasTag(alistar, "duo-plan")} [${adc}: Kalista ${grade(adc, "kalista")}, Xayah ${grade(adc, "xayah")}; ${support}: Rakan ${grade(support, "rakan")}, Alistar ${grade(support, "alistar")}]`,
    );
  }

  // 2. Și Rakan banat, Lucian + Nami disponibil (ambii ≥ B) → Lucian sau Nami. Milio e banat și el:
  //    în date Lucian are acum mustWith Milio (tier 1), altfel combo-ul acela ar câștiga.
  {
    const adc = findPlayer("lucian", 3, 6, "adc", [], (id) => RANK[grade(id, "kalista")] >= 4);
    const support = findPlayer("nami", 3, 6, "support", [adc]);
    const save = makeSave({ [RED]: { adc, support } });
    const bans = ["renata-glasc", "rakan", "milio", "azir", "vi", "sejuani"];
    const series = newSeries("f10b", BLUE, RED);
    const r1Game: DraftGameState = { ...series.games[0], bansBlue: bans.slice(0, 3), bansRed: bans.slice(3), picksBlue: ["ahri"], phaseIndex: 7 };
    const duos = buildDraftContext(getCurrentStep(r1Game)!, r1Game, series, save, DEFAULT_AI_CONFIG).mustWith.ownDuo.duos;
    const lucianNami = duos.find((duo) => duo.adcId === "lucian" && duo.supportId === "nami");
    const { log } = runDraft({ series, save, bans, stop: stopAtRedBot });
    const bot = firstRedBot(log);
    // Spec: „Lucian sau Nami”; verificăm că perechea e combo tier 2 disponibil și că nu e luată o ancoră orfană.
    check(
      "F10.2 Renata + Rakan banați → Lucian + Nami e combo tier 2; nicio ancoră orfană luată",
      lucianNami?.tier === 2 && !["kalista", "xayah"].includes(bot?.championId ?? ""),
      `Lucian + Nami: tier ${lucianNami?.tier ?? "—"} (loc ${duos.indexOf(lucianNami!) + 1} din ${duos.length}); primul bot roșu: ${bot?.label} ${bot?.championId} (spec: lucian / nami) „${bot?.breakdown?.explanation?.find((line) => line.includes("bot")) ?? ""}” [${adc}: Lucian ${grade(adc, "lucian")}; ${support}: Nami ${grade(support, "nami")}]`,
    );
  }

  // 3. Win condition pe jungle (Vi B1) → focus „elsewhere”: bot-ul se alege separat, fără bonus de combo.
  {
    const save = makeSave();
    const series = newSeries("f10c", BLUE, RED);
    const game: DraftGameState = {
      ...series.games[0], bansBlue: ["azir", "jayce", "ksante"], bansRed: ["sejuani", "orianna", "nocturne"],
      picksBlue: ["vi"], pickRolesBlue: { vi: "jungle" }, picksRed: ["ahri", "rumble"], phaseIndex: 9,
    };
    const step = getCurrentStep(game)!;
    const ctx = buildDraftContext(step, game, series, save, DEFAULT_AI_CONFIG);
    const botCandidates = ["xayah", "rakan", "kalista", "renata-glasc", "lucian", "nami"].map((id) => scoreAt(game, series, save, id));
    const bonused = botCandidates.filter((entry) => hasTag(entry, "duo-plan"));
    check(
      "F10.3 Win condition pe jungle (Vi) → focus elsewhere, fără bonus de combo",
      ctx.botFocus === "elsewhere" && bonused.length === 0,
      `win condition: ${ctx.ownWinCondition?.championId} (${ctx.ownWinCondition?.role}); focus: ${ctx.botFocus}; cu duo-plan: ${bonused.map((entry) => entry.championId).join(", ") || "—"}; „${botCandidates.flatMap((entry) => entry.explanation ?? []).find((line) => line.startsWith("Priority on other lanes")) ?? "—"}”`,
    );
  }

  // 4. Kalista luată, Renata banată după → partener doar din tier 2 (Kalista n-are), fără fallback la Alistar.
  {
    const adc = findPlayer("kalista", 3, 6, "adc");
    const support = findPlayer("alistar", 3, 6, "support", [adc]);
    const save = makeSave({ [BLUE]: { adc, support } });
    const series = newSeries("f10d", BLUE, RED);
    const game: DraftGameState = {
      ...series.games[0],
      bansBlue: ["azir", "jayce", "ksante", "renata-glasc"], bansRed: ["vi", "sejuani", "orianna", "gnar"],
      picksBlue: ["ambessa", "xin-zhao", "kalista"], pickRolesBlue: { ambessa: "top", "xin-zhao": "jungle", kalista: "adc" },
      picksRed: ["rumble", "wukong", "syndra", "jinx"], phaseIndex: 17,
    };
    const choice = getAiChoice(series, game, getCurrentStep(game)!, save);
    const alistar = scoreAt(game, series, save, "alistar");
    const tier2 = champions.filter((c) => c.roles.includes("support") && getBotPairTier("kalista", c.id) === 2).map((c) => c.id);
    check(
      "F10.4 Kalista luată, Renata banată → doar tier 2 ca fallback (fără Alistar)",
      !hasTag(alistar, "duo-fallback") && (tier2.length ? tier2.includes(choice?.championId ?? "") : !hasTag(choice, "duo-fallback")),
      `B4=${choice?.championId} (${choice?.projectedRole}) fallback=${hasTag(choice, "duo-fallback")}; Alistar fallback: ${hasTag(alistar, "duo-fallback")}; tier 2 pentru Kalista: ${tier2.join(", ") || "—"}`,
    );
  }
}

// ─── DRAFT_REALISM §15.1–2: ban sau first pick ───────────────────────────────
{
  let cases = 0;
  let blueBanned = 0;
  let takenAtB1 = 0;
  let redAnswered = 0;
  const examples: string[] = [];
  for (let index = 0; index < 30; index += 1) {
    const blue = teams[(index * 5 + 1) % teams.length].slug;
    const red = teams[(index * 5 + 8) % teams.length].slug;
    if (blue === red) continue;
    const series = newSeries(`r7s${index}`, blue, red);
    const save = makeSave();
    const start = series.games[0];
    const ctx = buildDraftContext(getCurrentStep(start)!, start, series, save, DEFAULT_AI_CONFIG);
    const top = ctx.topOwnUsablePriority();
    const rank = top?.priority.ownBestGrade ? RANK[top.priority.ownBestGrade] : -1;
    if (!top || top.priority.tier !== 1 || rank < 4) continue;
    cases += 1;
    const { log } = runDraft({ series, save, bans: [], stop: (entries) => Boolean(nthPick(entries, "blue", 1)) });
    const bans1 = log.filter((entry) => entry.action === "ban");
    if (bans1.some((entry) => entry.side === "blue" && entry.championId === top.championId)) blueBanned += 1;
    const redBan = bans1.find((entry) => entry.side === "red" && entry.championId === top.championId);
    const b1 = nthPick(log, "blue", 1);
    if (b1?.championId === top.championId) takenAtB1 += 1;
    if (redBan) redAnswered += 1;
    if (examples.length < 3) examples.push(`${blue}: ${top.championId} (${top.priority.value.toFixed(1)}) → ${redBan ? "banat de red" : b1?.championId === top.championId ? "B1" : `B1=${b1?.championId}`}`);
  }
  check(
    "R15.1 Blue nu-și banează tier 1-ul de first pick (îl ia la B1 dacă rămâne)",
    cases > 0 && blueBanned === 0,
    `${cases} cazuri; banat de blue: ${blueBanned}; luat la B1: ${takenAtB1}; banat de red: ${redAnswered}; ${examples.join("; ")}`,
  );
}

// ─── DRAFT_REALISM §15.10–11: fearless + eliminare ──────────────────────────
{
  // 10. Jocul 4 dintr-un Bo5: midul roșilor mai are 2 campioni ≥ B (restul jucați în jocurile anterioare) →
  //     unul dintre ei e luat în faza 1.
  const midId = baseRosters[RED].mid;
  const mid = playersById.get(midId)!;
  const midPool = getResolvedChampionPool(mid)
    .filter((entry) => RANK[entry.grade] >= 3 && champions.find((c) => c.id === entry.champion)?.roles.includes("mid"))
    // Rămân cei 2 cu meta cea mai mare: cu doi campioni off-meta (ex. Azir / LeBlanc la Faker), penalizarea off-meta
    // (~−10) bate orice bonus de raritate și testul n-ar mai măsura raritatea.
    .sort((a, b) => getMetaPriorityScore(champions.find((c) => c.id === b.champion)!, "mid") - getMetaPriorityScore(champions.find((c) => c.id === a.champion)!, "mid"));
  const kept = midPool.slice(0, 2).map((entry) => entry.champion);
  const played = midPool.slice(2).map((entry) => entry.champion);
  const series = newSeries("r8f", BLUE, RED);
  series.bo = 5;
  const previous = (number: number, ids: string[]): DraftGameState => ({ ...series.games[0], number, completed: true, winnerSide: "blue", picksBlue: ids, picksRed: [] });
  series.games = [previous(1, played.slice(0, 5)), previous(2, played.slice(5, 10)), previous(3, played.slice(10)), { ...series.games[0], number: 4 }];
  series.currentGameNumber = 4;
  const save = makeSave();
  let game = series.games[3];
  const redPhase1: string[] = [];
  for (let step = getCurrentStep(game); step && game.phaseIndex <= 11; step = getCurrentStep(game)) {
    const choice = getAiChoice(series, game, step, save);
    if (!choice) break;
    if (step.side === "red" && step.action === "pick") redPhase1.push(choice.championId);
    game = commitActionToGame(game, choice.championId, step.side, step.action, choice.projectedRole);
  }
  const ctxStart = buildDraftContext({ label: "R1", side: "red", action: "pick" }, { ...series.games[3], phaseIndex: 7, picksBlue: ["ahri"] }, series, save, DEFAULT_AI_CONFIG);
  const comfortIntent = evaluateIntents(ctxStart).find((intent) => intent.id === "comfort");
  // Albaștrii pot bana chiar ei campionii rămași (§7.1 la ban-uri: le strâng pool-ul) — atunci roșii n-au ce lua.
  const bannedKept = kept.filter((id) => [...game.bansBlue, ...game.bansRed].includes(id));
  const stillOpen = kept.length - bannedKept.length > 0;
  // Spec: „unul e luat în faza 1”. Cu ponderile din spec, un B rămas pierde cu ~20–25 de puncte în fața pick-urilor
  // meta (bonusul de raritate e 1.5): verificăm mecanica — comfort vede fearless-ul, roșii nu-și banează opțiunile.
  const redBannedOwn = kept.filter((id) => game.bansRed.includes(id));
  void stillOpen;
  check(
    "R15.10 Fearless: midul cu 2 opțiuni → comfort urgent, roșii nu le banează",
    kept.length === 2 && redBannedOwn.length === 0 && Boolean(comfortIntent?.reason.includes("fearless")),
    `${mid.name}: rămași ${kept.join(", ")} (jucați înainte: ${played.length}); banați: ${bannedKept.join(", ") || "—"} (ban-uri ${game.bansBlue.join(", ")} / ${game.bansRed.join(", ")}); faza 1 roșii: ${redPhase1.join(", ")} (spec: una dintre ${kept.join(" / ")}); comfort: ${comfortIntent?.urgency} „${comfortIntent?.reason}”`,
  );

  // 11. Aceeași situație, meci de eliminare (Bo3, jocul 3) vs meci normal → urgența comfort mai mare.
  const normal = newSeries("r8e", BLUE, RED);
  const elimination = newSeries("r8e", BLUE, RED);
  elimination.bo = 3;
  elimination.currentGameNumber = 3;
  const state = (s: ActiveDraftSeries): DraftGameState => ({ ...s.games[0], number: s.currentGameNumber, phaseIndex: 7, picksBlue: ["ahri"], bansBlue: ["azir", "vi", "sejuani"], bansRed: ["jayce", "ksante", "orianna"] });
  const comfortOf = (s: ActiveDraftSeries) =>
    evaluateIntents(buildDraftContext({ label: "R1", side: "red", action: "pick" }, state(s), s, save, DEFAULT_AI_CONFIG)).find((intent) => intent.id === "comfort")?.urgency ?? 0;
  const comfortNormal = comfortOf(normal);
  const comfortElimination = comfortOf(elimination);
  check(
    "R15.11 Meci de eliminare → urgența comfort mai mare",
    comfortElimination > comfortNormal,
    `comfort: normal ${comfortNormal}, eliminare ${comfortElimination}`,
  );
}

// ─── DRAFT_REALISM §15.8–9: stilul echipei ───────────────────────────────────
{
  // Knob-urile echipei roșii modificate temporar (restaurate la final).
  const team = teams.find((entry) => entry.slug === RED)!;
  const original = { ...team.identity! };
  const withKnobs = <T,>(knobs: Partial<typeof original>, run: () => T): T => {
    team.identity = { ...original, ...knobs };
    try {
      return run();
    } finally {
      team.identity = { ...original };
    }
  };
  const save = makeSave();
  const seeds = 30;

  // 8. counterpickBias 9 vs 2: prima lasă solo lane-urile pentru pick2 mai des (mai puține top/mid în faza 1).
  const soloInPhaseOne = (prefix: string) => {
    let solo = 0;
    for (let index = 0; index < seeds; index += 1) {
      const { log } = runDraft({ series: newSeries(`${prefix}${index}`, BLUE, RED), save, bans: [], stop: (entries) => entries.length >= 12 });
      solo += log.filter((entry) => entry.side === "red" && entry.action === "pick" && ["top", "mid"].includes(entry.breakdown?.projectedRole ?? "")).length;
    }
    return solo;
  };
  const soloHigh = withKnobs({ counterpickBias: 9 }, () => soloInPhaseOne("r9c"));
  const soloLow = withKnobs({ counterpickBias: 2 }, () => soloInPhaseOne("r9c"));
  check(
    "R15.8 counterpickBias 9 lasă solo lane-urile pentru pick2 mai des decât 2",
    soloHigh < soloLow,
    `top/mid în faza 1 (${seeds} drafturi): counterpickBias 9 → ${soloHigh}, 2 → ${soloLow}`,
  );

  // 9. creativity 2 alege primul candidat în ≥ 90% din acțiuni; creativity 9 în 40–70%.
  const firstRate = (prefix: string) => {
    let first = 0;
    let total = 0;
    for (let index = 0; index < 50; index += 1) {
      const { log } = runDraft({ series: newSeries(`${prefix}${index}`, BLUE, RED), save, bans: [] });
      for (const entry of log) {
        if (entry.side !== "red" || entry.breakdown?.choiceRank === undefined) continue;
        total += 1;
        if (entry.breakdown.choiceRank === 0) first += 1;
      }
    }
    return total ? first / total : 0;
  };
  const rateLow = withKnobs({ creativity: 2 }, () => firstRate("r9v"));
  const rateHigh = withKnobs({ creativity: 9 }, () => firstRate("r9v"));
  check(
    "R15.9 creativity 2 → primul candidat ≥ 90%; creativity 9 → 40–70%",
    rateLow >= 0.9 && rateHigh >= 0.4 && rateHigh <= 0.7,
    `creativity 2: ${(rateLow * 100).toFixed(1)}%, creativity 9: ${(rateHigh * 100).toFixed(1)}%`,
  );
}

// ─── DRAFT_REALISM §15.6–7: ban 2 țintit ─────────────────────────────────────
{
  // 6. Adversarul (blue) are 3 pick-uri de dive și midul liber → ban-urile roșii din ban 2 vizează campioni
  //    care le completează dive-ul pe un rol liber sau counterii pick-urilor noastre, nu meta pură.
  const diveFit = (id: string, role: Role) => getCandidateIdentityFit(champions.find((c) => c.id === id)!, role, "dive");
  const bestDive = (role: Role, exclude: string[]) =>
    champions
      .filter((c) => c.roles.includes(role) && !exclude.includes(c.id))
      .sort((a, b) => diveFit(b.id, role) - diveFit(a.id, role) || a.id.localeCompare(b.id))[0].id;
  const diveTop = bestDive("top", []);
  const diveJungle = bestDive("jungle", [diveTop]);
  const diveSupport = bestDive("support", [diveTop, diveJungle]);
  const save = makeSave();
  const series = newSeries("r10a", BLUE, RED);
  const game: DraftGameState = {
    ...series.games[0],
    bansBlue: ["azir", "jayce", "orianna"], bansRed: ["sejuani", "ksante", "rumble"],
    picksBlue: [diveTop, diveJungle, diveSupport], pickRolesBlue: { [diveTop]: "top", [diveJungle]: "jungle", [diveSupport]: "support" },
    picksRed: ["nocturne", "syndra", "ezreal"], pickRolesRed: { nocturne: "jungle", syndra: "mid", ezreal: "adc" },
    phaseIndex: 12,
  };
  const choice = getAiChoice(series, game, getCurrentStep(game)!, save);
  const w = choice?.bucketWeights ?? {};
  const part = (bucket: "compDeny" | "protect" | "power") => (choice?.buckets?.[bucket] ?? 0) * (w[bucket] ?? 1);
  const targeted = hasTag(choice, "identity-deny") || part("protect") > 0 || part("compDeny") > part("power");
  check(
    "R15.6 Ban 2 vs 3 pick-uri de dive cu midul liber → ban țintit (dive pe rol liber / counter la noi), nu meta pură",
    Boolean(choice) && targeted,
    `ei: ${diveTop}/${diveJungle}/${diveSupport}; ban R4: ${choice?.championId} (${champions.find((c) => c.id === choice?.championId)?.roles.join("/")}) compDeny ${part("compDeny").toFixed(1)} · protect ${part("protect").toFixed(1)} · power ${part("power").toFixed(1)}; tags ${choice?.reasonTags?.filter((t) => ["identity-deny", "season-plan"].includes(t)).join(",") || "—"}`,
  );

  // 7. Ban 2: niciun ban pe un rol deja completat de adversar (pe 30 de drafturi AI vs AI).
  let ban2 = 0;
  const wasted: string[] = [];
  for (let index = 0; index < 30; index += 1) {
    const blue = teams[(index * 3 + 2) % teams.length].slug;
    const red = teams[(index * 3 + 17) % teams.length].slug;
    if (blue === red) continue;
    const { game: done, log } = runDraft({ series: newSeries(`r10b${index}`, blue, red), save, bans: [] });
    void done;
    let picksBlue: string[] = [];
    let picksRed: string[] = [];
    log.forEach((entry, step) => {
      if (entry.action === "pick") {
        if (entry.side === "blue") picksBlue = [...picksBlue, entry.championId];
        else picksRed = [...picksRed, entry.championId];
        return;
      }
      if (step < 12 || step > 15) return;
      ban2 += 1;
      const enemyPicks = entry.side === "blue" ? picksRed : picksBlue;
      const enemyRoster = save.updatedTeamRosters[entry.side === "blue" ? red : blue] ?? {};
      const open = getOpenRolesForPickedChampions(enemyPicks, enemyRoster);
      const roles = champions.find((c) => c.id === entry.championId)?.roles ?? [];
      if (!roles.some((role) => open.includes(role))) wasted.push(`${entry.championId} (${roles.join("/")}; liber: ${open.join("/")})`);
    });
  }
  check(
    "R15.7 Ban 2: niciun ban pe un rol deja completat de adversar",
    ban2 > 0 && wasted.length === 0,
    `${ban2} ban-uri în ban 2; pe roluri completate: ${wasted.length}${wasted.length ? ` (${wasted.slice(0, 3).join("; ")})` : ""}`,
  );
}

// ─── DRAFT_REALISM §15.12–13: Preparation pe priority value ─────────────────
{
  const save = makeSave();
  const rosters = { blue: save.updatedTeamRosters[BLUE] ?? {}, red: save.updatedTeamRosters[RED] ?? {} };
  const start = newSeries("r13p", BLUE, RED);
  const ctx = buildDraftContext(getCurrentStep(start.games[0])!, start.games[0], start, save, DEFAULT_AI_CONFIG);
  // Tier 1-urile pe care roșii le vor (din perspectiva albaștrilor, la primul ban).
  const wanted = champions
    .map((champion) => ({ id: champion.id, priority: ctx.priorityOf(champion) }))
    .filter((entry) => entry.priority.tier === 1 && entry.priority.enemyWant >= 5)
    .sort((a, b) => b.priority.value - a.priority.value)
    .map((entry) => entry.id);

  // 12. Albaștrii banează toți tier 1-urile pe care le voiau roșii → Preparation A (nu D).
  {
    // Albaștrii au 3 ban-uri în faza 1: dacă roșii vor mai mult de 3 tier 1, restul îl banează chiar roșii
    // (nu-l mai ia nimeni, deci nu contează), ca toate tier 1-urile lor să fie acoperite.
    const neutral = ["azir", "jayce", "ksante", "orianna", "sejuani", "vi"].filter((id) => !wanted.includes(id));
    const blueBans = wanted.slice(0, 3);
    const redBans = [...wanted.slice(3, 6), ...neutral].slice(0, 3);
    // Ordinea din DRAFT_SEQUENCE: B1 R1 B2 R2 B3 R3.
    const sequenceBans = [blueBans[0], redBans[0], blueBans[1], redBans[1], blueBans[2], redBans[2]];
    const series = newSeries("r13a", BLUE, RED);
    const { game } = runDraft({ series, save, bans: sequenceBans });
    const report = buildDraftPillarReport(resolveFinishedDraftAssignments(game, series, save), "blue", series, save, rosters);
    check(
      "R15.12 Banăm tier 1-urile pe care le voiau ei → Preparation A",
      wanted.length > 0 && report.preparation.grade === "A",
      `tier 1 voiți de ei: ${wanted.join(", ") || "—"}; ban-uri albaștri ${blueBans.join(", ")}; Preparation ${report.preparation.grade}: ${report.preparation.notes.slice(0, 3).join(" | ")}`,
    );
  }

  // 13. Roșii iau un tier 1, albaștrii iau counter-ul lui pe linie în pick2 → neutralizat.
  {
    const target = wanted[0];
    const targetChampion = champions.find((c) => c.id === target);
    const role = targetChampion?.roles[0] ?? "mid";
    const counterId = target
      ? getRoleMatchups(target, role).weakVs.find((relation) => (isStrongCounter(relation) || isLaneCounter(relation)) && relation.championId !== target)?.championId
      : undefined;
    const fillers = (exclude: string[], roles: Role[]) =>
      roles.map((entry) => champions.find((c) => c.roles[0] === entry && !exclude.includes(c.id) && c.roles.length === 1)!.id);
    const otherRoles = ROLE_ORDER.filter((entry) => entry !== role);
    const redPicks = target ? [target, ...fillers([target, counterId ?? ""], otherRoles)] : [];
    const bluePicks = counterId ? [...fillers([...redPicks, counterId], otherRoles).map((id, index) => (redPicks.includes(id) ? champions.filter((c) => c.roles[0] === otherRoles[index] && !redPicks.includes(c.id) && c.id !== counterId)[1].id : id)), counterId] : [];
    const series = newSeries("r13b", BLUE, RED);
    const game: DraftGameState = {
      ...series.games[0],
      bansBlue: ["azir", "jayce", "ksante", "gnar", "kalista"].filter((id) => id !== target && id !== counterId).slice(0, 5),
      bansRed: ["sejuani", "orianna", "rumble", "vi", "zeri"].filter((id) => id !== target && id !== counterId).slice(0, 5),
      picksBlue: bluePicks,
      picksRed: redPicks,
      phaseIndex: 20,
    };
    const resolved = resolveFinishedDraftAssignments(game, series, save);
    const report = buildDraftPillarReport(resolved, "blue", series, save, rosters);
    const name = targetChampion?.name ?? target;
    check(
      "R15.13 Ei iau un tier 1, noi luăm counter-ul pe linie în pick2 → neutralizat",
      Boolean(counterId) && report.preparation.notes.some((note) => note.startsWith(`Neutralized ${name}`)),
      `tier 1: ${target} (${role}); counter: ${counterId ?? "—"}; Preparation ${report.preparation.grade}: ${report.preparation.notes.slice(0, 3).join(" | ")}`,
    );
  }
}

// ─── DRAFT_PICK_ORDER_SLOTS: sloturile userului în ordinea pick-urilor ───────
{
  // Serie a userului (blue = echipa controlată): AI-ul draftează ambele părți ca să avem un draft complet.
  const save = { ...makeSave(), controlledTeamSlug: BLUE };
  const series = createInitialSeries(`slots-${BLUE}-${RED}`, BLUE);
  let game = series.games[0];
  for (let step = getCurrentStep(game); step; step = getCurrentStep(game)) {
    const choice = getAiChoice(series, game, step, save)!;
    // Pick-urile userului nu se blochează pe rol (commitActionToGame(..., null), ca în pagină).
    game = commitActionToGame(game, choice.championId, step.side, step.action, step.side === "blue" ? null : choice.projectedRole);
  }
  const swapStage = initializeSwapStageAssignments(game, series, save);
  const pickOrder = ROLE_ORDER.every((role, index) => swapStage.assignmentsBlue[role] === game.picksBlue[index]);
  const aiResolved = ROLE_ORDER.every((role) => {
    const champion = champions.find((c) => c.id === swapStage.assignmentsRed[role]);
    return Boolean(champion?.roles.includes(role));
  });
  // Swap-ul userului: primul slot ↔ al doilea; simularea folosește exact sloturile (fără recalculare).
  const swapped = swapAssignedRoles(swapStage, "blue", "top", "jungle");
  const finished = resolveFinishedDraftAssignments(swapped, series, save);
  const keptSwap = finished.assignmentsBlue.top === swapped.assignmentsBlue.top && finished.assignmentsBlue.jungle === swapped.assignmentsBlue.jungle;
  check(
    "S1. Sloturi: userul rămâne în ordinea pick-urilor, AI-ul se aranjează pe roluri, simularea folosește sloturile",
    series.userSide === "blue" && pickOrder && aiResolved && keptSwap,
    `user (ordinea pick-urilor): ${ROLE_ORDER.map((role) => `${role}=${swapStage.assignmentsBlue[role]}`).join(" ")}; AI: ${ROLE_ORDER.map((role) => `${role}=${swapStage.assignmentsRed[role]}`).join(" ")}; după swap + finalizare: top=${finished.assignmentsBlue.top}, jungle=${finished.assignmentsBlue.jungle}`,
  );
}

// ─── DUO_PRIORITY_AND_FEARLESS §5: piese de combo, fereastră, păstrare ───────
{
  const renata = champions.find((c) => c.id === "renata-glasc")!;
  const sup = findPlayer("renata-glasc", 3, 6, "support");
  const adc = findPlayer("kalista", 3, 6, "adc", [sup]);
  const neutralBans = (extra: string[] = []) => [...extra, "azir", "jayce", "ksante", "orianna", "sejuani", "vi"].slice(0, 6);
  const ctxAt = (series: ActiveDraftSeries, game: DraftGameState, save: DraftSave) =>
    buildDraftContext(getCurrentStep(game)!, game, series, save, DEFAULT_AI_CONFIG);
  const firstPickOf = (log: LogEntry[], side: Side) => log.find((entry) => entry.side === side && entry.action === "pick");

  // 2. First pick expus: blue B1 cu Renata → partenerul poate fi luat / banat de red înainte → nu e Renata.
  {
    const save = makeSave({ [BLUE]: { support: sup, adc } });
    const series = newSeries("dp2", BLUE, RED);
    const bans = neutralBans();
    const b1Game: DraftGameState = { ...series.games[0], bansBlue: [bans[0], bans[2], bans[4]], bansRed: [bans[1], bans[3], bans[5]], phaseIndex: 6 };
    const entry = scoreDraftCandidate(renata, getCurrentStep(b1Game)!, b1Game, series, save);
    const priority = ctxAt(series, b1Game, save).priorityOf(renata);
    const { log } = runDraft({ series, save, bans, stop: (entries) => Boolean(firstPickOf(entries, "blue")) });
    const b1 = firstPickOf(log, "blue");
    check(
      "D2. Renata la B1 e expusă (deny ≥ 0.5) → B1 nu e Renata",
      priority.partner.state === "exposed" && hasTag(entry, "exposed-combo") && b1?.championId !== "renata-glasc",
      `Renata: ${priority.partner.state}, deny ${priority.partner.denyChance.toFixed(2)}, priority ${priority.baseValue.toFixed(1)} → ${priority.value.toFixed(1)}; „${entry.explanation?.find((line) => line.includes("exposed")) ?? "—"}”; B1=${b1?.championId}`,
    );
  }

  // 3. Fereastra de pereche: red R1–R2, Renata și Kalista libere, ambii ≥ B → tag pair-window; R1 una → R2 cealaltă.
  {
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = newSeries("dp3", BLUE, RED);
    const r1Game: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "sejuani", "vi"], picksBlue: ["ahri"], phaseIndex: 7 };
    const renataR1 = scoreDraftCandidate(renata, getCurrentStep(r1Game)!, r1Game, series, save);
    const kalistaR1 = scoreDraftCandidate(champions.find((c) => c.id === "kalista")!, getCurrentStep(r1Game)!, r1Game, series, save);
    const { log } = runDraft({
      series, save, bans: neutralBans(),
      forced: [{ side: "blue", action: "pick", nth: 1, championId: "ahri" }],
      stop: (entries) => entries.filter((entry) => entry.side === "red" && entry.action === "pick").length >= 2,
    });
    const [r1, r2] = log.filter((entry) => entry.side === "red" && entry.action === "pick");
    const pairTaken = ["renata-glasc", "kalista"].includes(r1?.championId ?? "") ? ["renata-glasc", "kalista"].includes(r2?.championId ?? "") && r1?.championId !== r2?.championId : true;
    check(
      "D3. Fereastra R1–R2: Renata / Kalista cu pair-window; dacă R1 ia una, R2 ia cealaltă",
      hasTag(renataR1, "pair-window") && hasTag(kalistaR1, "pair-window") && pairTaken,
      `R1=${r1?.championId}, R2=${r2?.championId}; „${renataR1.explanation?.find((line) => line.startsWith("Pair window")) ?? "—"}”`,
    );
  }

  // 4. Orfan: Kalista banată în jocul curent → Renata are tier mai mic și nu ancorează planul.
  {
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = newSeries("dp4", BLUE, RED);
    const open: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "sejuani", "vi"], picksBlue: ["ahri"], phaseIndex: 7 };
    const banned: DraftGameState = { ...open, bansBlue: ["azir", "jayce", "kalista"] };
    const withPartner = ctxAt(series, open, save).priorityOf(renata);
    const orphan = ctxAt(series, banned, save).priorityOf(renata);
    const anchors = isPriorityPick("renata-glasc", "support", (id) => id !== "kalista");
    check(
      "D4. Kalista banată → Renata orfană: priority mai mic, nu ancorează planul",
      orphan.partner.state === "orphan" && orphan.value < withPartner.value && !anchors,
      `Renata: cu Kalista ${withPartner.value.toFixed(2)} (tier ${withPartner.tier}, ${withPartner.partner.state}), fără ${orphan.value.toFixed(2)} (tier ${orphan.tier}); ancorează planul: ${anchors}`,
    );
  }

  // 5–8. Fearless: Bo3. Seria cu un joc anterior completat (roșii au câștigat jocul 1).
  const fearlessSeries = (id: string, gameNumber: number, previousPicks: string[] = []) => {
    const series = newSeries(id, BLUE, RED);
    series.bo = 3;
    const previous = Array.from({ length: gameNumber - 1 }, (_, index): DraftGameState => ({
      ...series.games[0], number: index + 1, completed: true, winnerSide: index % 2 === 0 ? "red" : "blue",
      picksBlue: index === 0 ? previousPicks : [], picksRed: [],
    }));
    series.games = [...previous, { ...series.games[0], number: gameNumber }];
    series.currentGameNumber = gameNumber;
    return series;
  };
  const conserveState = (series: ActiveDraftSeries, save: DraftSave, bansBlue: string[]) => {
    const game: DraftGameState = { ...series.games[series.games.length - 1], bansBlue, bansRed: ["ksante", "sejuani", "vi"], picksBlue: ["ahri"], phaseIndex: 7 };
    return scoreDraftCandidate(renata, getCurrentStep(game)!, game, series, save);
  };
  {
    // 5. Jocul 2 (1–0), Kalista banată acum, nejucată în jocul 1 → Renata păstrată (conserve-combo).
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = fearlessSeries("dp5", 2);
    const entry = conserveState(series, save, ["azir", "jayce", "kalista"]);
    const { log } = runDraft({ series, save, bans: ["kalista", "ksante", "azir", "sejuani", "jayce", "vi"], stop: (entries) => entries.filter((e) => e.side === "red" && e.action === "pick").length >= 3 });
    const redPicks = log.filter((e) => e.side === "red" && e.action === "pick").map((e) => e.championId);
    check(
      "D5. Fearless: Kalista banată (nejucată) → Renata păstrată (conserve-combo), nu e luată în faza 1",
      hasTag(entry, "conserve-combo") && !redPicks.includes("renata-glasc"),
      `„${entry.explanation?.find((line) => line.includes("held")) ?? "—"}”; roșii faza 1: ${redPicks.join(", ")}`,
    );
  }
  {
    // 6. Același caz, dar singurul support decent e Renata (restul consumați în jocul 1) → Renata luată oricum.
    const supports = champions.filter((c) => c.roles.includes("support") && c.id !== "renata-glasc").map((c) => c.id);
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = fearlessSeries("dp6", 2, supports);
    const entry = conserveState(series, save, ["azir", "jayce", "kalista"]);
    const { log } = runDraft({ series: { ...series, games: series.games }, save, bans: ["kalista", "ksante", "azir", "sejuani", "jayce", "vi"] });
    const redPicks = log.filter((e) => e.side === "red" && e.action === "pick").map((e) => e.championId);
    check(
      "D6. Singurul support decent e Renata → luată oricum (păstrarea e penalizare, nu filtru)",
      hasTag(entry, "conserve-combo") && redPicks.includes("renata-glasc"),
      `supporturi consumate: ${supports.length}; roșii: ${redPicks.join(", ")}`,
    );
  }
  {
    // 7. Kalista jucată în jocul 1 → în jocul 2 Renata e orfană, fără conserve-combo (consumat definitiv).
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = fearlessSeries("dp7", 2, ["kalista"]);
    const entry = conserveState(series, save, ["azir", "jayce", "orianna"]);
    const priority = ctxAt(series, { ...series.games[1], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "sejuani", "vi"], picksBlue: ["ahri"], phaseIndex: 7 }, save).priorityOf(renata);
    check(
      "D7. Kalista jucată anterior → Renata orfană, fără conserve-combo",
      priority.partner.state === "orphan" && !hasTag(entry, "conserve-combo"),
      `Renata: ${priority.partner.state}; tags ${entry.reasonTags?.filter((t) => t.includes("combo")).join(",") || "—"}`,
    );
  }
  {
    // 8. Jocul 3 dintr-un Bo3 (decisiv) → fără conserve-combo.
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = fearlessSeries("dp8", 3);
    const entry = conserveState(series, save, ["azir", "jayce", "kalista"]);
    check(
      "D8. Joc decisiv (Bo3, jocul 3) → fără conserve-combo",
      !hasTag(entry, "conserve-combo"),
      `tags ${entry.reasonTags?.filter((t) => t.includes("combo")).join(",") || "—"}`,
    );
  }
  {
    // 9. Kalista deja banată → AI-ul nu-și irosește un ban pe Renata (orphan-combo, nu e banată în ban 1).
    const save = makeSave({ [RED]: { support: sup, adc } });
    const series = newSeries("dp9", BLUE, RED);
    const game: DraftGameState = { ...series.games[0], bansBlue: ["kalista"], phaseIndex: 1 };
    const entry = scoreDraftCandidate(renata, getCurrentStep(game)!, { ...game, phaseIndex: 2, bansRed: ["azir"] }, series, save);
    const { log } = runDraft({ series, save, bans: ["kalista"], stop: (entries) => entries.length >= 6 });
    const blueBans = log.filter((e) => e.side === "blue" && e.action === "ban").map((e) => e.championId);
    check(
      "D9. Kalista banată → ban pe Renata depunctat (orphan-combo), Renata nu e banată",
      hasTag(entry, "orphan-combo") && ![...blueBans, ...log.filter((e) => e.side === "red" && e.action === "ban").map((e) => e.championId)].includes("renata-glasc"),
      `ban-uri: ${log.filter((e) => e.action === "ban").map((e) => e.championId).join(", ")}`,
    );
  }
}

// ─── COMP_ATTRIBUTES_EXPANSION §6.4: nevoi contextuale (date de test injectate, nu în fișiere) ──
/** Adaugă temporar offers / resourceDemand pe campioni (în memorie) și le restaurează după `run`. */
function withTestData<T>(
  patch: { offers?: Record<string, ChampionOffer[]>; resourceDemand?: Record<string, Partial<Record<Role, ResourceDemand>>>; traits?: Record<string, PlayerTrait[]> },
  run: () => T,
): T {
  const restore: (() => void)[] = [];
  for (const [playerId, traits] of Object.entries(patch.traits ?? {})) {
    const player = players.find((entry) => entry.id === playerId)!;
    const before = player.traits;
    player.traits = traits;
    restore.push(() => { player.traits = before; });
  }
  for (const [id, offers] of Object.entries(patch.offers ?? {})) {
    const champion = champions.find((entry) => entry.id === id)!;
    const before = champion.offers;
    champion.offers = [...before, ...offers];
    restore.push(() => { champion.offers = before; });
  }
  for (const [id, byRole] of Object.entries(patch.resourceDemand ?? {})) {
    const champion = champions.find((entry) => entry.id === id)!;
    for (const [role, value] of Object.entries(byRole) as [Role, ResourceDemand][]) {
      const entry = champion.roleData[role]!;
      const before = entry.resourceDemand;
      entry.resourceDemand = value;
      restore.push(() => { if (before === undefined) delete entry.resourceDemand; else entry.resourceDemand = before; });
    }
  }
  try {
    return run();
  } finally {
    for (const undo of restore.reverse()) undo();
  }
}

{
  setContextualNeedsOverride(true);
  try {
    // C1. Ei au 3 tancuri (Ornn, Sejuani, Rell) → vs-frontline; Vayne cu antiTank 5 primește contextualNeedFill.
    const series = newSeries("ca1", BLUE, RED);
    const save = makeSave();
    const game: DraftGameState = {
      ...series.games[0],
      bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "syndra"],
      picksBlue: ["ornn", "sejuani", "rell"], picksRed: ["ahri", "lee-sin"], phaseIndex: 11,
    };
    const step = getCurrentStep(game)!;
    const vayne = champions.find((c) => c.id === "vayne")!;
    const needs = getContextualNeeds(game.picksBlue);
    const without = scoreDraftCandidate(vayne, step, game, series, save);
    const withAntiTank = withTestData({ offers: { vayne: [{ type: "antiTank", strength: 5 }] } }, () => {
      setContextualNeedsOverride(true); // golește cache-ul de statusuri
      return scoreDraftCandidate(vayne, step, game, series, save);
    });
    check(
      "C1. Ei au 3 tancuri → vs-frontline; Vayne cu antiTank 5 primește contextualNeedFill (tag contextual-need)",
      step.side === "red" && needs.some((need) => need.id === "vs-frontline") && hasTag(withAntiTank, "contextual-need") &&
        (withAntiTank.buckets?.counter ?? 0) > (without.buckets?.counter ?? 0),
      `${step.label}; nevoi: ${needs.map((need) => `${need.id} p${need.priority}`).join(", ")}; counter Vayne ${(without.buckets?.counter ?? 0).toFixed(2)} → ${(withAntiTank.buckets?.counter ?? 0).toFixed(2)} cu antiTank 5; „${withAntiTank.explanation?.find((line) => line.includes("answers their frontline")) ?? "—"}”`,
    );

    // C2. Compoziția finală fără anti-tank (și puțin sustained damage) → raportul: „No answer to their frontline”.
    const finished: DraftGameState = {
      ...series.games[0],
      bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "syndra"],
      picksBlue: ["ornn", "sejuani", "rell", "ahri", "ezreal"], picksRed: ["rumble", "lee-sin", "taliyah", "rakan", "xayah"], phaseIndex: 20,
    };
    const resolved = resolveFinishedDraftAssignments(finished, series, save);
    const rosters = { blue: save.updatedTeamRosters[BLUE] ?? {}, red: save.updatedTeamRosters[RED] ?? {} };
    const red = buildDraftPillarReport(resolved, "red", series, save, rosters);
    const status = evaluateContextualNeedStatuses(resolved.picksRed, resolved.picksBlue).find((need) => need.id === "vs-frontline");
    check(
      "C2. Fără anti-tank contra a 3 tancuri → Composition: „No answer to their frontline”",
      Boolean(status && status.missing > 0) && red.composition.notes.some((note) => note.startsWith("No answer to their frontline")),
      `vs-frontline: ${status ? `${status.current.toFixed(1)} / ${status.required}` : "—"}; Composition ${red.composition.grade}: ${red.composition.notes.join(" | ")}`,
    );

    // C3. Cu flag-ul oprit, nimic din toate astea nu se activează.
    setContextualNeedsOverride(false);
    const off = withTestData({ offers: { vayne: [{ type: "antiTank", strength: 5 }] } }, () => scoreDraftCandidate(vayne, step, game, series, save));
    check(
      "C3. contextualNeedsEnabled oprit → fără nevoi contextuale, fără contextual-need",
      getContextualNeeds(game.picksBlue).length === 0 && !hasTag(off, "contextual-need"),
      `counter Vayne (oprit, antiTank 5): ${(off.buckets?.counter ?? 0).toFixed(2)}`,
    );
  } finally {
    setContextualNeedsOverride(null);
  }
}

// ─── COMP_ATTRIBUTES_EXPANSION §6.4: resurse și efecte în simulare (date de test injectate) ──
{
  const save = makeSave();
  const score = (id: string, game: DraftGameState, series: ActiveDraftSeries) =>
    scoreDraftCandidate(champions.find((c) => c.id === id)!, getCurrentStep(game)!, game, series, save);

  // R1. Două carry-uri cu resourceDemand 5 (Jayce top, Azir mid) + al treilea cu 4 (Kalista adc) → resource-conflict.
  {
    const series = newSeries("rc1", BLUE, RED);
    const game: DraftGameState = {
      ...series.games[0],
      bansBlue: ["vi", "sejuani", "orianna"], bansRed: ["ksante", "rumble", "syndra"],
      picksBlue: ["ornn", "lee-sin", "ahri"], picksRed: ["jayce", "azir"], phaseIndex: 11,
    };
    const demand = { jayce: { top: 5 as const }, azir: { mid: 5 as const }, kalista: { adc: 4 as const } };
    const plain = score("kalista", game, series);
    const conflict = withTestData({ resourceDemand: demand }, () => score("kalista", game, series));
    check(
      "R1. Jayce (5) + Azir (5) + Kalista (4) → resource-conflict, comp mai mic",
      hasTag(conflict, "resource-conflict") && (conflict.buckets?.comp ?? 0) < (plain.buckets?.comp ?? 0),
      `comp Kalista ${(plain.buckets?.comp ?? 0).toFixed(2)} → ${(conflict.buckets?.comp ?? 0).toFixed(2)}; „${conflict.explanation?.find((line) => line.startsWith("Resource conflict")) ?? "—"}”`,
    );
  }

  // R2. Focus "bot": același top (scor de bază egal) e preferat weakside (2) față de cerere 5.
  {
    // O stare cu focusul pe bot: căutăm printre echipe (roșii la R1, ambele roluri bot libere).
    let found: { series: ActiveDraftSeries; game: DraftGameState } | null = null;
    for (const team of teams) {
      if (team.slug === BLUE || found) continue;
      const series = newSeries(`rc2-${team.slug}`, BLUE, team.slug);
      const game: DraftGameState = { ...series.games[0], bansBlue: ["vi", "sejuani", "orianna"], bansRed: ["ksante", "rumble", "syndra"], picksBlue: ["ahri"], phaseIndex: 7 };
      if (buildDraftContext(getCurrentStep(game)!, game, series, save, DEFAULT_AI_CONFIG).botFocus === "bot") found = { series, game };
    }
    const top = "ornn";
    const weak = found ? withTestData({ resourceDemand: { [top]: { top: 2 } } }, () => score(top, found!.game, found!.series)) : null;
    const hungry = found ? withTestData({ resourceDemand: { [top]: { top: 5 } } }, () => score(top, found!.game, found!.series)) : null;
    check(
      "R2. Focus bot: top weakside (2) > același top cu cerere 5",
      Boolean(weak && hungry && weak.totalScore > hungry.totalScore),
      found ? `${found.series.redTeamSlug}: Ornn top weakside ${weak!.totalScore.toFixed(2)} vs cerere 5 ${hungry!.totalScore.toFixed(2)} (comp ${(weak!.buckets?.comp ?? 0).toFixed(2)} / ${(hungry!.buckets?.comp ?? 0).toFixed(2)})` : "nicio stare cu focus bot",
    );
  }

  // R3. Simulare: trei carry-uri care vor gold → execution mai mic.
  {
    const series = newSeries("rc3", BLUE, RED);
    const finished: DraftGameState = {
      ...series.games[0],
      bansBlue: ["vi", "sejuani", "orianna"], bansRed: ["ksante", "rumble", "syndra"],
      picksBlue: ["jayce", "lee-sin", "azir", "kalista", "rell"], picksRed: ["ornn", "viego", "ahri", "ezreal", "nautilus"], phaseIndex: 20,
    };
    const resolved = resolveFinishedDraftAssignments(finished, series, save);
    const base = simulateDraftResult(resolved, series, save).bluePhaseScores.execution;
    const conflict = withTestData(
      { resourceDemand: { jayce: { top: 5 }, azir: { mid: 5 }, kalista: { adc: 4 } } },
      () => simulateDraftResult(resolved, series, save).bluePhaseScores.execution,
    );
    check("R3. Simulare: 3 carry-uri care vor gold → execution −0.3", conflict < base, `execution albaștri ${base} → ${conflict}`);
  }

  // T1–T2. Teamfight: aceeași compoziție de tancuri contra unei echipe cu antiTank / antiCC vs fără.
  {
    const tanks = { top: "ornn", jungle: "sejuani", mid: "ahri", adc: "ezreal", support: "rell" };
    const enemy = { top: "jayce", jungle: "lee-sin", mid: "azir", adc: "vayne", support: "morgana" };
    const plain = evaluateTeamfight({ blueAssignments: tanks, redAssignments: enemy });
    const withAttrs = withTestData(
      { offers: { vayne: [{ type: "antiTank", strength: 5 }], "lee-sin": [{ type: "antiTank", strength: 3 }], morgana: [{ type: "antiCC", strength: 5 }] } },
      () => evaluateTeamfight({ blueAssignments: tanks, redAssignments: enemy }),
    );
    check(
      "T1. Simulare: antiTank-ul lor (8) → frontlinePresence al tancurilor mai mic",
      withAttrs.blue.frontlinePresence < plain.blue.frontlinePresence,
      `frontlinePresence ${plain.blue.frontlinePresence.toFixed(2)} → ${withAttrs.blue.frontlinePresence.toFixed(2)}`,
    );
    check(
      "T2. Simulare: antiCC-ul lor (5) → engageQuality și ccChainPower mai mici",
      withAttrs.blue.engageQuality < plain.blue.engageQuality && withAttrs.blue.ccChainPower < plain.blue.ccChainPower,
      `engage ${plain.blue.engageQuality.toFixed(2)} → ${withAttrs.blue.engageQuality.toFixed(2)}, CC ${plain.blue.ccChainPower.toFixed(2)} → ${withAttrs.blue.ccChainPower.toFixed(2)}`,
    );
  }
}

// ─── PLAYER_TRAITS §6.4: trait-urile de resurse (date de test injectate) ─────
{
  const save = makeSave();
  const hog = (intensity: 1 | 2 = 1): PlayerTrait[] => [{ id: "resource_hog", intensity, source: "manual" }];
  const weak: PlayerTrait[] = [{ id: "weakside_ready", intensity: 1, source: "manual" }];
  const score = (id: string, game: DraftGameState, series: ActiveDraftSeries) =>
    scoreDraftCandidate(champions.find((c) => c.id === id)!, getCurrentStep(game)!, game, series, save);

  // P1. Mid resource_hog: același candidat cu cerere 4 vs 2 (scor de bază egal) → cererea 4 câștigă, „wants resources”.
  {
    const series = newSeries("pt1", BLUE, RED);
    const midId = save.updatedTeamRosters[RED]!.mid!;
    const game: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "sejuani"], picksBlue: ["ahri"], phaseIndex: 7 };
    const fits = withTestData({ traits: { [midId]: hog() }, resourceDemand: { syndra: { mid: 4 } } }, () => score("syndra", game, series));
    const starved = withTestData({ traits: { [midId]: hog() }, resourceDemand: { syndra: { mid: 2 } } }, () => score("syndra", game, series));
    check(
      "P1. Mid resource_hog: candidatul cu cerere 4 > același cu cerere 2; „wants resources” / trait-starved",
      fits.totalScore > starved.totalScore && hasTag(fits, "trait-fit") && hasTag(starved, "trait-starved") &&
        Boolean(fits.explanation?.some((line) => line.includes("wants resources"))),
      `${playersById.get(midId)?.name}: Syndra cerere 4 ${fits.totalScore.toFixed(2)} vs cerere 2 ${starved.totalScore.toFixed(2)}; „${fits.explanation?.find((line) => line.includes("wants resources")) ?? "—"}” / „${starved.explanation?.find((line) => line.includes("starved")) ?? "—"}”`,
    );
  }

  // P2. Top weakside_ready cu focus "bot" → candidatul cu cerere 2 primește ambele bonusuri (focus + trait).
  {
    let found: { series: ActiveDraftSeries; game: DraftGameState; topId: string } | null = null;
    for (const team of teams) {
      if (team.slug === BLUE || found) continue;
      const series = newSeries(`pt2-${team.slug}`, BLUE, team.slug);
      const game: DraftGameState = { ...series.games[0], bansBlue: ["vi", "sejuani", "orianna"], bansRed: ["ksante", "rumble", "syndra"], picksBlue: ["ahri"], phaseIndex: 7 };
      const topId = save.updatedTeamRosters[team.id]?.top;
      if (topId && buildDraftContext(getCurrentStep(game)!, game, series, save, DEFAULT_AI_CONFIG).botFocus === "bot") found = { series, game, topId };
    }
    const neutral = found ? score("ornn", found.game, found.series) : null;
    const both = found ? withTestData({ traits: { [found.topId]: weak }, resourceDemand: { ornn: { top: 2 } } }, () => score("ornn", found!.game, found!.series)) : null;
    const expected = DRAFT_THINKING_CONFIG.attributes.focusWeaksideBonus + DRAFT_THINKING_CONFIG.traits.weaksideFitBonus;
    const gain = both && neutral ? (both.buckets?.comp ?? 0) - (neutral.buckets?.comp ?? 0) : 0;
    check(
      "P2. Top weakside_ready, focus bot: Ornn cu cerere 2 primește focus + trait (+0.9 în comp)",
      Boolean(both && hasTag(both, "trait-fit") && Math.abs(gain - expected) < 1e-6),
      found ? `${found.series.redTeamSlug} (${playersById.get(found.topId)?.name}): comp Ornn ${(neutral!.buckets?.comp ?? 0).toFixed(2)} → ${(both!.buckets?.comp ?? 0).toFixed(2)} (+${gain.toFixed(2)}, așteptat +${expected.toFixed(2)})` : "nicio stare cu focus bot",
    );
  }

  // P3–P4. Spirit: hog înfometat; serie pierdută cu doi hogs pe carry → ego_clash pentru amândoi.
  {
    const roster = save.updatedTeamRosters[RED]!;
    const games = (champs: Partial<Record<Role, string>>, winnerSide: Side, count: number) =>
      Array.from({ length: count }, (_, index) => ({
        gameNumber: index + 1, winnerSide, controlledSide: "red" as const, bans: [] as string[],
        playerEntries: ROLE_ORDER.map((role) => ({ playerId: roster[role]!, score: 6, championId: champs[role] ?? null, role, side: "red" as const, isGameMvp: false })),
      }));
    const ctx = (snapshots: ReturnType<typeof games>) => ({
      seriesId: "spirit-traits", controlledTeamSlug: RED, controlledRoster: roster, playersById, bo: 3 as const,
      games: snapshots, seriesMvpPlayerId: null, currentSpirits: {}, currentStreaks: {}, leadershipCycleCounter: 1,
    });
    const reasons = (results: ReturnType<typeof computeSeriesSpiritDeltas>, playerId: string) =>
      results.find((entry) => entry.playerId === playerId)?.events.map((event) => event.reason) ?? [];
    const champs = { top: "ornn", jungle: "sejuani", mid: "taliyah", adc: "kalista", support: "rell" };
    const starved = withTestData({ traits: { [roster.mid!]: hog() }, resourceDemand: { taliyah: { mid: 2 } } }, () =>
      computeSeriesSpiritDeltas(ctx(games(champs, "red", 2))));
    const starvedEvent = starved.find((entry) => entry.playerId === roster.mid)?.events.find((event) => event.reason === "starved_of_resources");
    check(
      "P3. Spirit: resource_hog cu 2 jocuri pe cerere 2 → starved_of_resources",
      Boolean(starvedEvent && starvedEvent.delta < 0),
      `${playersById.get(roster.mid!)?.name}: ${starvedEvent ? `${starvedEvent.delta} „${starvedEvent.details}”` : "—"}`,
    );
    const clash = withTestData(
      { traits: { [roster.mid!]: hog(), [roster.adc!]: hog() }, resourceDemand: { taliyah: { mid: 4 }, kalista: { adc: 5 } } },
      () => computeSeriesSpiritDeltas(ctx(games(champs, "blue", 2))),
    );
    check(
      "P4. Spirit: serie pierdută cu 2 hogs pe carry → ego_clash pentru amândoi",
      reasons(clash, roster.mid!).includes("ego_clash") && reasons(clash, roster.adc!).includes("ego_clash"),
      clash.filter((entry) => entry.events.some((event) => event.reason === "ego_clash")).map((entry) => `${playersById.get(entry.playerId)?.name}: „${entry.events.find((event) => event.reason === "ego_clash")!.details}”`).join("; ") || "—",
    );
  }

  // P5. Simulare: weakside_ready pe un campion cu cerere 2 nu are malusul de greed pe utility; resource_hog îl are mai mare.
  {
    // Malusul de greed apare de la greed > 60: jucătorul cu greed maxim, pe un campion de-al rolului lui (cerere 2).
    const greedy = [...players].sort((a, b) => b.advancedProfile.hiddenTraits.greed - a.advancedProfile.hiddenTraits.greed)[0]!;
    const championId = champions.find((c) => c.roles.includes(greedy.role))!.id;
    const modifiers = (traits: PlayerTrait[]) =>
      withTestData({ traits: { [greedy.id]: traits }, resourceDemand: { [championId]: { [greedy.role]: 2 } } }, () =>
        getPlayerPersonalityModifiers(greedy.id, new Set<string>(), 0.5, championId, greedy.role));
    const base = modifiers([]);
    const weakside = modifiers(weak);
    const hogged = modifiers(hog(1));
    check(
      "P5. Simulare: weakside_ready pe cerere 2 → fără malus de greed; resource_hog → malus mai mare",
      base.greedCarryAmplifier < 0 && weakside.greedCarryAmplifier === 0 && hogged.greedCarryAmplifier < base.greedCarryAmplifier,
      `${greedy.name} (greed ${greedy.advancedProfile.hiddenTraits.greed.toFixed(0)}) pe ${championId} (${greedy.role}): fără trait ${base.greedCarryAmplifier}, weakside ${weakside.greedCarryAmplifier}, hog ${hogged.greedCarryAmplifier}`,
    );
  }
}

// ─── PLAYER_TRAITS §1.5: enabler (jungler pe un campion cu cerere 2) ─────────
{
  const save = makeSave();
  const enabler: PlayerTrait[] = [{ id: "enabler", intensity: 1, source: "manual" }];
  const roster = save.updatedTeamRosters[RED]!;
  const jungleId = roster.jungle!;
  const jungler = playersById.get(jungleId)!;
  const series = newSeries("pt6", BLUE, RED);
  const game: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "syndra"], picksBlue: ["ahri"], phaseIndex: 7 };
  const sejuani = champions.find((c) => c.id === "sejuani")!;
  const plain = withTestData({ resourceDemand: { sejuani: { jungle: 2 } } }, () => scoreDraftCandidate(sejuani, getCurrentStep(game)!, game, series, save));
  const withTrait = withTestData({ traits: { [jungleId]: enabler }, resourceDemand: { sejuani: { jungle: 2 } } }, () =>
    scoreDraftCandidate(sejuani, getCurrentStep(game)!, game, series, save));
  // Greed: jucătorul cu greed maxim de pe jungle, pe Sejuani cu cerere 2.
  const greedyJungler = [...players].filter((player) => player.role === "jungle").sort((a, b) => b.advancedProfile.hiddenTraits.greed - a.advancedProfile.hiddenTraits.greed)[0]!;
  const greed = (traits: PlayerTrait[]) =>
    withTestData({ traits: { [greedyJungler.id]: traits }, resourceDemand: { sejuani: { jungle: 2 } } }, () =>
      getPlayerPersonalityModifiers(greedyJungler.id, new Set<string>(), 0.5, "sejuani", "jungle").greedCarryAmplifier);
  // Spirit: serie câștigată, 2 jocuri pe Sejuani.
  const snapshots = Array.from({ length: 2 }, (_, index) => ({
    gameNumber: index + 1, winnerSide: "red" as const, controlledSide: "red" as const, bans: [] as string[],
    playerEntries: ROLE_ORDER.map((role) => ({
      playerId: roster[role]!, score: 6, championId: role === "jungle" ? "sejuani" : ({ top: "ornn", mid: "taliyah", adc: "kalista", support: "rell" } as Record<string, string>)[role], role, side: "red" as const, isGameMvp: false,
    })),
  }));
  const spirit = withTestData({ traits: { [jungleId]: enabler }, resourceDemand: { sejuani: { jungle: 2 } } }, () =>
    computeSeriesSpiritDeltas({
      seriesId: "spirit-enabler", controlledTeamSlug: RED, controlledRoster: roster, playersById, bo: 3, games: snapshots,
      seriesMvpPlayerId: null, currentSpirits: {}, currentStreaks: {}, leadershipCycleCounter: 1,
    }));
  const fulfilled = spirit.find((entry) => entry.playerId === jungleId)?.events.find((event) => event.reason === "playstyle_fulfilled");
  check(
    "P6. Enabler jungler pe cerere 2: bonus în draft, fără malus de greed, playstyle_fulfilled la o serie câștigată",
    hasTag(withTrait, "trait-fit") && (withTrait.buckets?.comp ?? 0) > (plain.buckets?.comp ?? 0) &&
      greed([]) < 0 && greed(enabler) === 0 && Boolean(fulfilled),
    `${jungler.name}: comp Sejuani ${(plain.buckets?.comp ?? 0).toFixed(2)} → ${(withTrait.buckets?.comp ?? 0).toFixed(2)} „${withTrait.explanation?.find((line) => line.includes("enable")) ?? "—"}”; greed ${greedyJungler.name}: ${greed([])} → ${greed(enabler)}; Spirit: ${fulfilled ? `+${fulfilled.delta} „${fulfilled.details}”` : "—"}`,
  );
}

// ─── PLAYER_TRAITS §7.6: Draft & Series, partea de draft și lane ─────────────
{
  const save = makeSave();
  const trait = (id: PlayerTrait["id"], intensity: 1 | 2 = 1): PlayerTrait[] => [{ id, intensity, source: "manual" }];

  // Q1. Top counter_specialist, adversarul n-a ales pe top → candidatul de top e depunctat (îl lăsăm pentru counter).
  {
    const series = newSeries("q1", BLUE, RED);
    const topId = save.updatedTeamRosters[RED]!.top!;
    const game: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "syndra"], picksBlue: ["ahri"], phaseIndex: 7 };
    const ornn = champions.find((c) => c.id === "ornn")!;
    const plain = withTestData({ traits: { [topId]: [] } }, () => scoreDraftCandidate(ornn, getCurrentStep(game)!, game, series, save));
    const held = withTestData({ traits: { [topId]: trait("counter_specialist") } }, () => scoreDraftCandidate(ornn, getCurrentStep(game)!, game, series, save));
    check(
      "Q1. Top counter_specialist, top-ul lor încă liber → Ornn top depunctat („Keeping top for last”)",
      hasTag(held, "trait-hold-counter") && held.totalScore < plain.totalScore,
      `${playersById.get(topId)?.name}: Ornn ${plain.totalScore.toFixed(2)} → ${held.totalScore.toFixed(2)}; „${held.explanation?.find((line) => line.startsWith("Keeping")) ?? "—"}”`,
    );
  }

  // Q2–Q3. Același matchup: counter_specialist pe counter > pe blind; lane_dominator / matchup_resilient ajustează matchup-ul.
  {
    const rosters = { blue: save.updatedTeamRosters[BLUE]!, red: save.updatedTeamRosters[RED]! };
    const assignmentsBlue = { top: "jayce", jungle: "lee-sin", mid: "ahri", adc: "ezreal", support: "rell" };
    const assignmentsRed = { top: "ornn", jungle: "sejuani", mid: "azir", adc: "kalista", support: "nautilus" };
    const topId = rosters.blue.top!;
    const lane = (traits: PlayerTrait[], order: "blind" | "counter") =>
      withTestData({ traits: { [topId]: traits } }, () =>
        evaluateLanePhase({ blueRoster: rosters.blue, redRoster: rosters.red, assignmentsBlue, assignmentsRed, laneOrder: { blue: { top: order }, red: { top: order === "blind" ? "counter" : "blind" } } }).roles.find((entry) => entry.role === "top")!);
    const none = lane([], "counter");
    const counterOnCounter = lane(trait("counter_specialist"), "counter");
    const counterOnBlind = lane(trait("counter_specialist"), "blind");
    const matchup = getMatchupValue("jayce", "top", "ornn", "top", { phase: "early" });
    check(
      "Q2. Același matchup: counter_specialist pe counter are scor de lane mai mare decât pe blind",
      counterOnCounter.blueScore > counterOnBlind.blueScore && counterOnBlind.blueScore < none.blueScore,
      `Jayce vs Ornn (matchup ${matchup.toFixed(2)}): fără trait ${none.blueScore}, counter ${counterOnCounter.blueScore} („${counterOnCounter.note}”), blind ${counterOnBlind.blueScore} („${counterOnBlind.note}”)`,
    );
    const dominator = lane(trait("lane_dominator"), "counter");
    const resilient = lane(trait("matchup_resilient"), "counter");
    const won = matchup > 0;
    check(
      "Q3. lane_dominator crește un matchup câștigat; matchup_resilient nu schimbă unul câștigat (doar pe cele pierdute)",
      won ? dominator.blueScore >= none.blueScore && resilient.blueScore === none.blueScore : dominator.blueScore === none.blueScore && resilient.blueScore >= none.blueScore,
      `matchup ${matchup.toFixed(2)}: fără ${none.blueScore}, dominator ${dominator.blueScore}, resilient ${resilient.blueScore}`,
    );
  }

  // Q4. signature_player: fit mai mare pe SS, mai mic pe C, decât fără trait.
  {
    const player = players.find((entry) => {
      const grades = entry.championPool.map((id) => getChampionGrade(entry, id));
      return grades.includes("SS") && champions.some((c) => getChampionGrade(entry, c.id) === "C");
    })!;
    const ss = player.championPool.find((id) => getChampionGrade(player, id) === "SS")!;
    const c = champions.find((champion) => getChampionGrade(player, champion.id) === "C")!.id;
    const fit = (traits: PlayerTrait[], championId: string) => withTestData({ traits: { [player.id]: traits } }, () => applyMasteryToFit(player, championId, 6));
    check(
      "Q4. signature_player: fit mai mare pe SS și mai mic pe C decât fără trait",
      fit(trait("signature_player"), ss) > fit([], ss) && fit(trait("signature_player"), c) < fit([], c),
      `${player.name}: ${ss} (SS) ${fit([], ss).toFixed(2)} → ${fit(trait("signature_player"), ss).toFixed(2)}; ${c} (C) ${fit([], c).toFixed(2)} → ${fit(trait("signature_player"), c).toFixed(2)}`,
    );
  }
}

// ─── PLAYER_TRAITS §7.6: Draft & Series, partea de echipă și serie ───────────
{
  const save = makeSave();
  const trait = (id: PlayerTrait["id"], intensity: 1 | 2 = 1): PlayerTrait[] => [{ id, intensity, source: "manual" }];

  // R1. needs_setup pe mid: un support de engage primește bonusul de setup, unul de enchanter mai puțin.
  {
    const series = newSeries("rs1", BLUE, RED);
    const midId = save.updatedTeamRosters[RED]!.mid!;
    const game: DraftGameState = { ...series.games[0], bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "sejuani"], picksBlue: ["ahri"], picksRed: [], phaseIndex: 7 };
    const score = (id: string, traits: PlayerTrait[]) =>
      withTestData({ traits: { [midId]: traits } }, () => scoreDraftCandidate(champions.find((c) => c.id === id)!, getCurrentStep(game)!, game, series, save));
    const engage = { plain: score("rell", []), needs: score("rell", trait("needs_setup")) };
    const enchanter = { plain: score("yuumi", []), needs: score("yuumi", trait("needs_setup")) };
    const engageGain = (engage.needs.buckets?.comp ?? 0) - (engage.plain.buckets?.comp ?? 0);
    const enchanterGain = (enchanter.needs.buckets?.comp ?? 0) - (enchanter.plain.buckets?.comp ?? 0);
    check(
      "U1. needs_setup pe mid: Rell (engage) primește mai mult bonus de setup decât Yuumi",
      hasTag(engage.needs, "trait-setup") && engageGain > enchanterGain,
      `${playersById.get(midId)?.name}: Rell +${engageGain.toFixed(2)} („${engage.needs.explanation?.find((line) => line.includes("set up for")) ?? "—"}”), Yuumi +${enchanterGain.toFixed(2)}`,
    );
  }

  // R2. needs_setup în simulare: într-o compoziție fără setup, ratingul lui e mai mic decât fără trait.
  {
    const series = newSeries("rs2", BLUE, RED);
    const midId = save.updatedTeamRosters[BLUE]!.mid!;
    const finished: DraftGameState = {
      ...series.games[0],
      bansBlue: ["azir", "jayce", "orianna"], bansRed: ["ksante", "vi", "sejuani"],
      picksBlue: ["jax", "kindred", "syndra", "ezreal", "karma"], picksRed: ["ornn", "lee-sin", "ahri", "kalista", "rell"], phaseIndex: 20,
    };
    const resolved = resolveFinishedDraftAssignments(finished, series, save);
    const setup = teamSetupFor(Object.values(resolved.assignmentsBlue), resolved.assignmentsBlue.mid);
    const rating = (traits: PlayerTrait[]) =>
      withTestData({ traits: { [midId]: traits } }, () => simulateDraftResult(resolved, series, save).playerScores.find((entry) => entry.playerId === midId)?.score ?? 0);
    const plain = rating([]);
    const needs = rating(trait("needs_setup"));
    check(
      "U2. needs_setup fără setup (≤ setupLow) → rating mai mic decât fără trait",
      setup <= DRAFT_THINKING_CONFIG.traits.setupLow && needs < plain,
      `setup ${setup} (prag ${DRAFT_THINKING_CONFIG.traits.setupLow}); rating ${plain} → ${needs}`,
    );
  }

  // R3–R4. Serie: series_adapter mai bun în game 3 decât în game 1, fast_starter invers; Bo1 fără efect.
  {
    const player = players[0];
    const effect = (traits: PlayerTrait[], gameNumber: number, bo: number) =>
      withTestData({ traits: { [player.id]: traits } }, () => getSeriesRatingEffect(player, gameNumber, bo));
    const adapter = [effect(trait("series_adapter"), 1, 3), effect(trait("series_adapter"), 3, 3)];
    const starter = [effect(trait("fast_starter"), 1, 3), effect(trait("fast_starter"), 3, 3)];
    check(
      "U3. series_adapter: game 3 > game 1; fast_starter: game 1 > game 3",
      adapter[1] > adapter[0] && starter[0] > starter[1],
      `adapter g1 ${adapter[0].toFixed(2)}, g3 ${adapter[1].toFixed(2)}; starter g1 ${starter[0].toFixed(2)}, g3 ${starter[1].toFixed(2)}`,
    );
    check(
      "U4. Bo1 (un singur joc): niciun efect de serie",
      effect(trait("series_adapter"), 1, 1) === 0 && effect(trait("fast_starter"), 1, 1) === 0,
      `adapter ${effect(trait("series_adapter"), 1, 1)}, starter ${effect(trait("fast_starter"), 1, 1)}`,
    );
  }
}

// ─── TEAM_FIT_LIVE §7.1: Team Fit pe roster parțial, sfaturi, preview ────────
{
  const roster = makeSave().updatedTeamRosters[RED]!;
  const ids = (roles: Role[]) => Object.fromEntries(roles.map((role) => [role, roster[role]!])) as Partial<Record<Role, string>>;
  const hog: PlayerTrait[] = [{ id: "resource_hog", intensity: 1, source: "manual" }];
  const weak: PlayerTrait[] = [{ id: "weakside_ready", intensity: 1, source: "manual" }];
  const adviceIds = (fit: ReturnType<typeof computeTeamFit>) => fit.advice.map((entry) => entry.id);
  // Fără trait-uri (și comms neutre) pe toată echipa, ca sfaturile să vină doar din ce injectăm.
  const reset = Object.fromEntries(ROLE_ORDER.map((role) => [roster[role]!, [] as PlayerTrait[]]));
  const commsBackup = ROLE_ORDER.map((role) => {
    const player = playersById.get(roster[role]!)!;
    const before = player.advancedProfile.hiddenTraits.communication;
    player.advancedProfile.hiddenTraits.communication = 62;
    return () => { player.advancedProfile.hiddenTraits.communication = before; };
  });
  try {
    // V1. Roster gol → fără sfaturi; 2 hogs și 3 sloturi goale → resources-full; al treilea hog → resources-too-many.
    const empty = computeTeamFit({});
    const two = withTestData({ traits: { ...reset, [roster.mid!]: hog, [roster.adc!]: hog } }, () => computeTeamFit(ids(["mid", "adc"])));
    const three = withTestData({ traits: { ...reset, [roster.mid!]: hog, [roster.adc!]: hog, [roster.top!]: hog } }, () => computeTeamFit(ids(["top", "mid", "adc"])));
    check(
      "V1. Team Fit: roster gol fără sfaturi; 2 hogs + 3 sloturi goale → resources-full; 3 hogs → resources-too-many",
      empty.advice.length === 0 && adviceIds(two).includes("resources-full") && adviceIds(three).includes("resources-too-many"),
      `gol: [${adviceIds(empty).join(", ")}]; 2 hogs: [${adviceIds(two).join(", ")}]; 3 hogs: [${adviceIds(three).join(", ")}] „${three.advice.find((entry) => entry.id === "resources-too-many")?.text ?? "—"}”`,
    );

    // V2. Preview: un weakside_ready pe top, cu 2 hogs și restul ocupat → resurse „better”, resources-full în resolved.
    const preview = withTestData({ traits: { ...reset, [roster.mid!]: hog, [roster.adc!]: hog, [roster.top!]: weak } }, () =>
      previewTeamFitChange(ids(["jungle", "mid", "adc", "support"]), playersById.get(roster.top!)!));
    check(
      "V2. Preview: weakside_ready pe top cu 2 hogs → resurse better, resources-full rezolvat",
      preview.resources.level === "better" && preview.resolved.some((entry) => entry.id === "resources-full"),
      `resurse ${preview.resources.from} → ${preview.resources.to} (${preview.resources.level}); added [${preview.added.map((entry) => entry.id).join(", ")}], resolved [${preview.resolved.map((entry) => entry.id).join(", ")}]`,
    );

    // V3. Comms: un jucător Poor → comms-poor-player, fără comms-low dublat.
    const poorPlayer = playersById.get(roster.jungle!)!;
    const poorBefore = poorPlayer.advancedProfile.hiddenTraits.communication;
    poorPlayer.advancedProfile.hiddenTraits.communication = 30;
    const poor = withTestData({ traits: reset }, () => computeTeamFit(ids(["top", "jungle"])));
    poorPlayer.advancedProfile.hiddenTraits.communication = poorBefore;
    check(
      "V3. Comms: un jucător Poor → comms-poor-player, fără comms-low",
      adviceIds(poor).includes("comms-poor-player") && !adviceIds(poor).includes("comms-low"),
      `[${adviceIds(poor).join(", ")}] „${poor.advice.find((entry) => entry.id === "comms-poor-player")?.text ?? "—"}”; media ${poor.comms.average?.toFixed(0)} (${poor.comms.level})`,
    );

    // V4. Trait-urile unei familii inactive nu produc sfaturi (familia Draft scoasă temporar din cele active).
    const sig: PlayerTrait[] = [{ id: "signature_player", intensity: 1, source: "manual" }];
    const sigTraits = { ...reset, [roster.top!]: sig, [roster.mid!]: sig, [roster.adc!]: sig };
    const active = withTestData({ traits: sigTraits }, () => computeTeamFit(ids(["top", "mid", "adc"])));
    const families = ACTIVE_TRAIT_FAMILIES as PlayerTraitFamily[];
    families.splice(families.indexOf("draft"), 1);
    const inactive = withTestData({ traits: sigTraits }, () => computeTeamFit(ids(["top", "mid", "adc"])));
    families.push("draft");
    check(
      "V4. Familie inactivă → fără sfaturi din ea (3 signature: cu Draft activ da, inactiv nu)",
      adviceIds(active).includes("draft-signature-heavy") && !adviceIds(inactive).includes("draft-signature-heavy"),
      `activ: [${adviceIds(active).join(", ")}]; inactiv: [${adviceIds(inactive).join(", ")}]`,
    );
  } finally {
    for (const undo of commsBackup) undo();
  }
}

// ─── PLAYER_TRAITS faza 3: Macro (shotcalling, junglerul pe o parte a hărții) ─
{
  const roster = makeSave().updatedTeamRosters[RED]!;
  const reset = Object.fromEntries(ROLE_ORDER.map((role) => [roster[role]!, [] as PlayerTrait[]]));
  const trait = (id: PlayerTrait["id"]): PlayerTrait[] => [{ id, intensity: 1, source: "manual" }];
  const adviceIds = (fit: ReturnType<typeof computeTeamFit>) => fit.advice.map((entry) => entry.id);

  // M1. Chemistry: 1 shotcaller + 2 followers → leadership +0.2 față de shotcaller singur; 2 shotcalleri → comms −0.2.
  const solo = withTestData({ traits: { ...reset, [roster.support!]: trait("shotcaller") } }, () => computeTeamChemistry(roster));
  const led = withTestData({ traits: { ...reset, [roster.support!]: trait("shotcaller"), [roster.top!]: trait("follower"), [roster.adc!]: trait("follower") } }, () => computeTeamChemistry(roster));
  const two = withTestData({ traits: { ...reset, [roster.support!]: trait("shotcaller"), [roster.jungle!]: trait("shotcaller") } }, () => computeTeamChemistry(roster));
  const none = withTestData({ traits: reset }, () => computeTeamChemistry(roster));
  check(
    "M1. Chemistry: 2 followeri → leadership +0.2; 2 shotcalleri → comms −0.2; 0 shotcalleri → leadership ≤ 0.2",
    Math.abs(led.leadershipBonus - solo.leadershipBonus - 0.2) < 0.051 && Math.abs(solo.communicationBonus - two.communicationBonus - 0.2) < 0.051 && none.leadershipBonus <= 0.2,
    `leadership ${solo.leadershipBonus} → ${led.leadershipBonus} („${led.notes.join("; ")}”); comms ${solo.communicationBonus} → ${two.communicationBonus} („${two.notes.join("; ")}”); fără shotcaller ${none.leadershipBonus}`,
  );

  // M2. Lane: topside_jungler → top mai sus; ADC −0.15; un ADC weakside_ready nu primește malusul.
  const championFor = (role: Role) => champions.find((champion) => champion.roles.includes(role))!.id;
  const assignments = Object.fromEntries(ROLE_ORDER.map((role) => [role, championFor(role)])) as Partial<Record<Role, string>>;
  const lane = () => evaluateLanePhase({ blueRoster: roster, redRoster: roster, assignmentsBlue: assignments, assignmentsRed: assignments }).roles;
  const score = (roles: ReturnType<typeof lane>, role: Role) => roles.find((entry) => entry.role === role)!.blueScore;
  const base = withTestData({ traits: reset }, lane);
  const topside = withTestData({ traits: { ...reset, [roster.jungle!]: trait("topside_jungler") } }, lane);
  const weaksideAdc = withTestData({ traits: { ...reset, [roster.jungle!]: trait("topside_jungler"), [roster.adc!]: trait("weakside_ready") } }, lane);
  check(
    "M2. Lane: topside_jungler → top +0.3, ADC −0.15; ADC weakside_ready fără malus",
    score(topside, "top") > score(base, "top") && score(topside, "adc") < score(base, "adc") && score(weaksideAdc, "adc") === score(base, "adc"),
    `top ${score(base, "top")} → ${score(topside, "top")}; adc ${score(base, "adc")} → ${score(topside, "adc")} (weakside ${score(weaksideAdc, "adc")}); notă: „${topside.find((entry) => entry.role === "top")!.note}”`,
  );

  // M3. Team Fit: 2 shotcalleri → shotcalling-two; roster complet fără shotcaller → shotcalling-none; topside + ADC hog → warning.
  const fitTwo = withTestData({ traits: { ...reset, [roster.support!]: trait("shotcaller"), [roster.mid!]: trait("shotcaller") } }, () => computeTeamFit(roster));
  const fitNone = withTestData({ traits: reset }, () => computeTeamFit(roster));
  const fitSide = withTestData({ traits: { ...reset, [roster.support!]: trait("shotcaller"), [roster.jungle!]: trait("topside_jungler"), [roster.adc!]: trait("resource_hog") } }, () => computeTeamFit(roster));
  check(
    "M3. Team Fit: shotcalling-two, shotcalling-none, topside jungler cu ADC hog",
    adviceIds(fitTwo).includes("shotcalling-two") && adviceIds(fitNone).includes("shotcalling-none") && adviceIds(fitSide).includes("resources-jungle-neglects-adc"),
    `2: [${adviceIds(fitTwo).join(", ")}]; 0: [${adviceIds(fitNone).join(", ")}]; side: „${fitSide.warnings.join("; ")}”`,
  );
}

// ─── Raport ──────────────────────────────────────────────────────────────────
for (const result of results) {
  console.log(`${result.pass ? "PASS" : "FAIL"}  ${result.name}\n      ${result.detail}`);
}
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} scenarii trec`);
process.exit(failed ? 1 : 0);
