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
import { computeSeriesMvp, type SeriesGameSummary } from "@/app/draft-engine/mvpStorage";

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
  let game: DraftGameState = args.series.games[0];
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
    "10b. Renata prima → Kalista NU e forțată",
    !isLock(r2),
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
    !blockedPick(braum) && moved?.toRole === "top" && Boolean(braum.explanation?.some((line) => line.includes("ar muta"))),
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
    `Xayah: „${xayah.explanation?.find((line) => line.includes("evitat")) ?? ""}”; primul bot roșu: ${firstBot?.label} ${firstBot?.championId} (${firstBot?.breakdown?.projectedRole}) ${hasTag(firstBot?.breakdown, "duo-plan") ? "duo-plan" : ""} „${firstBot?.breakdown?.explanation?.find((line) => line.includes("Duo") || line.includes("→")) ?? ""}” [${adc}: Xayah ${grade(adc, "xayah")}, Kai'Sa ${grade(adc, "kaisa")}; ${support}: Nautilus ${grade(support, "nautilus")}]`,
  );
}
{
  // 17. B3 Xayah, Rakan banat în faza 2 → B4 = un support cu synergyWith ≥ 4 cu Xayah, grad ≥ C (duo-fallback).
  const fallbackSupports = champions
    .filter((c) => c.roles.includes("support"))
    .filter((c) => (c.synergyWith.find((s) => s.championId === "xayah")?.score ?? 0) >= 4 ||
      (champions.find((x) => x.id === "xayah")!.synergyWith.find((s) => s.championId === c.id)?.score ?? 0) >= 4)
    .map((c) => c.id);
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
    "17. B3 Xayah, Rakan banat în faza 2 → B4 partener synergy (duo-fallback)",
    Boolean(choice) && fallbackSupports.includes(choice!.championId) && hasTag(choice, "duo-fallback"),
    `${step.label}=${choice?.championId} (${choice?.projectedRole}) „${choice?.explanation?.find((line) => line.includes("synergy")) ?? ""}”; candidați synergy: ${fallbackSupports.map((id) => `${id}:${grade(support, id)}`).join(", ")} [${support}]`,
  );
}
{
  // 18. În faza 1 de ban, AI-ul nu-și banează membrii celui mai bun duo propriu (clar peste al doilea).
  let violations = 0;
  let protectedSeen = 0;
  // Toate echipele, în perechi: destule ture în care cel mai bun duo e clar peste al doilea.
  const slugs = teams.map((team) => team.slug ?? team.id);
  const pairs: [string, string][] = [];
  for (let index = 0; index + 1 < slugs.length; index += 2) pairs.push([slugs[index], slugs[index + 1]]);
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
  const viPriority = isPriorityPick("vi", "jungle", makeSave().updatedTeamRosters[BLUE] ?? {});
  const lockedType = (b5?.breakdown?.plan?.type ?? "dive") as DraftPlanType;
  const fitting = champions.find((c) => getCandidateIdentityFit(c, c.roles[0], lockedType) >= 2)!;
  const pick5Alignment = getPlanAlignmentBonus(fitting, fitting.roles[0], { type: lockedType, confidence: 1, reasoning: [] }, 5);
  check(
    "19. B1 Vi → plan dive/pick, blocat după pick 3, B4/B5 aliniate",
    // Înainte, de la pick-ul 5 alinierea era mereu 0; acum planul rămâne activ și blocat. Pick-urile alese pot
    // avea fit 0 (aliniere 0), deci verificăm direct: pe pick-ul 5, un campion cu fit ≠ 0 are aliniere ≠ 0.
    plans.every((type) => type === "dive" || type === "pick") && lockedSame && anchored &&
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
  const line = (entry: DraftCandidateBreakdown) => entry.explanation?.find((text) => text.includes("ar amesteca")) ?? "—";
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
    lulu.winCondition?.championId === "kogmaw" && has(lulu, "Susține win condition") && has(aphelios, "carry de protejat"),
    `win condition: ${lulu.winCondition?.championId} (${lulu.winCondition?.kind}); Lulu: „${lulu.explanation?.find((line) => line.includes("win condition")) ?? "—"}”; Aphelios: „${aphelios.explanation?.find((line) => line.includes("protejat")) ?? "—"}”`,
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
    `Camille: compCounterValue ${camille.compCounterValue?.toFixed(2)}, „${camille.explanation?.find((line) => line.includes("pierde linia")) ?? "—"}”`,
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
  check(
    "24. Sezon: avem counter A → Olaf liber; luat de ei → season-counter",
    Boolean(counterTop) && !bansB.some((entry) => entry.championId === "olaf") && hasTag(counter, "season-counter"),
    `top ${counterTop}: ${counterId} (${counterGrades[counterId ?? ""] ?? "?"}); ban-uri albaștri ${bansB.map((entry) => entry.championId).join(", ")}; „${counter?.explanation?.find((line) => line.startsWith("Counter la")) ?? "—"}”`,
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
  const pillars = ["priority", "cohesion", "matchups", "mastery", "seasonPrep"] as const;
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
    "26. Raport pe piloni: 5 piloni cu note; F pe top → mastery D",
    complete && blueF.mastery.grade === "D" && blueF.mastery.notes.some((note) => note.includes("(F)")),
    pillars.map((key) => `${key} ${blue[key].grade}: ${blue[key].notes[0]}`).join(" | ") + ` || cu F: mastery ${blueF.mastery.grade} „${blueF.mastery.notes[0]}”`,
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

// ─── Raport ──────────────────────────────────────────────────────────────────
for (const result of results) {
  console.log(`${result.pass ? "PASS" : "FAIL"}  ${result.name}\n      ${result.detail}`);
}
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} scenarii trec`);
process.exit(failed ? 1 : 0);
