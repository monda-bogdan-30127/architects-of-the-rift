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
  getAiChoice,
  getCurrentStep,
} from "@/app/draft-engine/draftEngine";
import { scoreDraftCandidate } from "@/app/draft-engine/draftAI";
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
  series.userSide = "__ai__" as never; // ambele echipe sunt AI
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
    game = commitActionToGame(game, championId, step.side, step.action);
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

// Jucătorii folosiți (gradele sunt afișate în detaliu).
const ADC_XAYAH = "ruler";        // Xayah A
const SUP_RAKAN_OK = "keria";     // Rakan B; Lulu B, Milio B, Nami A
const SUP_RAKAN_D = "cryogen";    // Rakan D; Lulu A, Milio B, Nami B
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
  const save = makeSave({ [RED]: { adc: ADC_XAYAH, support: SUP_RAKAN_D } });
  const { log } = runDraft({
    series: newSeries("s2", BLUE, RED),
    save,
    forced: [{ side: "red", action: "pick", nth: 1, championId: "xayah" }],
    stop: (entries) => Boolean(nthPick(entries, "red", 2)),
  });
  const r2 = nthPick(log, "red", 2);
  check(
    "2. Support cu Rakan D → fără lock",
    !isLock(r2),
    `R2=${r2?.championId}, lock=${isLock(r2)} (support Rakan ${grade(SUP_RAKAN_D, "rakan")})`,
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
for (const support of [SUP_RAKAN_OK, SUP_RAKAN_D]) {
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
    pickDeny && banDeny && banBreakdown.mustWithBonus === 2 && (pickBreakdown.mustWithBonus ?? 0) >= 1.5,
    `pick: tag=${pickDeny}, bonus mustWith ${pickBreakdown.mustWithBonus}; ban (${getCurrentStep(banGame)?.label}): tag=${banDeny}, bonus ${banBreakdown.mustWithBonus}`,
  );
}

// ─── Raport ──────────────────────────────────────────────────────────────────
for (const result of results) {
  console.log(`${result.pass ? "PASS" : "FAIL"}  ${result.name}\n      ${result.detail}`);
}
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} scenarii trec`);
process.exit(failed ? 1 : 0);
