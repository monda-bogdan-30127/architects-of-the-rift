// PLAYER_TRAITS §1.3 / §7.2 — derivarea trait-urilor (manual din playerProfileOverrides, altfel derivate, relativ la rol).
// Modul separat de playerTraitUtils și FĂRĂ import de `players`: players.ts îl cheamă la încărcare (assignPlayerTraits),
// iar playerTraitUtils importă players; dacă derivarea ar sta în playerTraitUtils, o pagină care încarcă întâi
// playerTraitUtils (ex. TeamFitPanel) ar porni players.ts înainte ca derivarea să fie inițializată (TDZ).

import { championsById } from "@/app/data/champions";
import type { Role } from "@/app/types/champion";
import type { Player, PlayerHiddenTraits, PlayerPlaystyleProfile } from "@/app/types/player";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { derivePlayerAdaptationProfile } from "@/app/draft-engine/playerProfileSystem";
import {
  MAX_PLAYER_TRAITS,
  MAX_TRAITS_PER_FAMILY,
  PLAYER_TRAIT_INFO,
  isTraitAllowedOnRole,
  type PlayerTrait,
  type PlayerTraitFamily,
  type PlayerTraitId,
} from "@/app/types/playerTraits";

/**
 * PLAYER_TRAITS §1.3 — derivarea familiei Resources, relativă la rol: pragurile absolute descriau rolul, nu
 * jucătorul (aproape toți ADC-ii erau Resource Hog, aproape toți junglerii Weakside Ready). Pentru fiecare rol se ia
 * percentila lui `carryResourceUsage` printre jucătorii de pe acel rol; la resource_hog, în plus, `greed ≥ 50`.
 * weakside_ready / enabler nu au filtru: `styleFlex` / `utilityComfort` sunt corelate cu cererea mică de resurse,
 * deci orice filtru pe ele îi tăia tocmai pe cei căutați.
 * `share` = fracția din rol peste (high) / sub (low) prag. Intensity 2: treimea de sus a celor care au primit
 * trait-ul pe rol, după cât de departe sunt de prag. resource_hog la jungle e doar manual: greed-ul mare al
 * junglerilor descrie stilul, nu cererea de gold.
 */
export const TRAIT_DERIVATION = {
  resource_hog: {
    direction: "high",
    share: { top: 0.2, mid: 0.3, adc: 0.35 } as Partial<Record<Role, number>>,
    filter: (source: TraitSource) => source.hiddenTraits.greed >= 50,
    filterLabel: "greed ≥ 50",
  },
  weakside_ready: {
    direction: "low",
    share: { top: 0.25, adc: 0.15 } as Partial<Record<Role, number>>,
    filter: () => true,
    filterLabel: "fără filtru",
  },
  enabler: {
    direction: "low",
    share: { jungle: 0.25, mid: 0.15 } as Partial<Record<Role, number>>,
    filter: () => true,
    filterLabel: "fără filtru",
  },
} as const;


/** Cel mult atâtea trait-uri derivate dintr-o familie (manualele pot trece peste). */
// Macro: shotcaller / follower (se exclud) și partea hărții (jungleri) pot sta împreună.
const MAX_DERIVED_PER_FAMILY: Partial<Record<PlayerTraitFamily, number>> = { draft: 1, macro: 2 };

/**
 * Ordinea familiilor la rezolvare (cel mult MAX_PLAYER_TRAITS): o familie mai nouă nu scoate un trait derivat dintr-o
 * familie mai veche. Așa, adăugarea unei familii inactive nu schimbă trait-urile active (fingerprint identic).
 */
const FAMILY_ORDER: PlayerTraitFamily[] = ["resources", "draft", "macro", "mental"];

/** Fracția celor cu trait-ul (pe rol) care primesc intensity 2. */
export const TRAIT_STRONG_SHARE = 1 / 3;

export type ManualTraitInput = { id: PlayerTraitId; intensity?: 1 | 2 };
export type TraitOverride = { traits?: ManualTraitInput[]; noDerivedTraits?: PlayerTraitId[] };

type TraitSource = { id: string; role: Role; playstyle: PlayerPlaystyleProfile; hiddenTraits: PlayerHiddenTraits };

// ─── Faza 2: Draft & Series (§7.2) ───────────────────────────────────────────

type RoleContext = {
  inRole: Player[];
  /** Percentila (0..1, rang în rol) a unei valori a jucătorului printre jucătorii de pe rol. */
  pct: (player: Player, value: (entry: Player) => number) => number;
};

type DraftTraitRule = {
  /** Ținta în rol (fracție), totală (manualele se scad din cotă); pe rol, unde diferă între roluri. */
  share: number | Partial<Record<Role, number>>;
  /** Scorul după care se aleg primii din rol (mai mare = mai potrivit); null = nu se poate calcula. */
  metric: (player: Player, context: RoleContext) => number | null;
  label: string;
};

const primaryOf = (player: Player) => player.advancedProfile.primary;
const playstyleOf = (player: Player) => player.advancedProfile.playstyle;
const matchupLearning = (player: Player) => derivePlayerAdaptationProfile(player).matchupLearning;
const blindMinusCounter = (player: Player) => primaryOf(player).blindPickStrength - primaryOf(player).counterPickStrength;

/** Percentila prin rang în rol (0 = cel mai mic, 1 = cel mai mare). */
function rolePercentile(inRole: Player[], player: Player, value: (entry: Player) => number): number {
  if (inRole.length <= 1) return 0.5;
  const own = value(player);
  const below = inRole.filter((entry) => value(entry) < own).length;
  const equal = inRole.filter((entry) => value(entry) === own).length;
  return (below + (equal - 1) / 2) / (inRole.length - 1);
}

type MasteryFns = { grade: (player: Player, championId: string) => ChampionMasteryGrade; multiplier: (grade: ChampionMasteryGrade) => number };
let masteryFns: MasteryFns | null = null;
let lastAssignment: { list: Player[]; overrides: Record<string, TraitOverride | undefined> } | null = null;

/** Concentrarea pool-ului: media multiplicatorului de mastery pe primii 2 campioni minus media pe primii 8. */
function signatureConcentration(player: Player): number | null {
  if (!masteryFns) return null;
  const { grade, multiplier } = masteryFns;
  const values = Object.keys(championsById).map((championId) => multiplier(grade(player, championId))).sort((a, b) => b - a);
  const mean = (list: number[]) => list.reduce((sum, value) => sum + value, 0) / Math.max(1, list.length);
  return mean(values.slice(0, 2)) - mean(values.slice(0, 8));
}

/**
 * PLAYER_TRAITS §7.2 — derivarea familiei Draft & Series, relativă la rol: pe fiecare rol, primii `share` după scor.
 *   blind_safe / counter_specialist: clasament după blindPickStrength − counterPickStrength (capetele opuse);
 *   signature_player: concentrarea pool-ului (top 2 vs top 8, multiplicatorul de mastery);
 *   needs_setup / self_sufficient: reziduul setupDependence față de mechanics (percentile în rol), în ambele sensuri;
 *   matchup_resilient / lane_dominator: percentile compuse.
 */
export const DRAFT_TRAIT_DERIVATION: Partial<Record<PlayerTraitId, DraftTraitRule>> = {
  blind_safe: {
    share: 0.08,
    metric: (player) => blindMinusCounter(player),
    label: "sus în rol la blindPickStrength − counterPickStrength",
  },
  counter_specialist: {
    share: 0.08,
    metric: (player) => -blindMinusCounter(player),
    label: "jos în rol la blindPickStrength − counterPickStrength",
  },
  signature_player: {
    share: 0.07,
    metric: (player) => signatureConcentration(player),
    label: "concentrarea pool-ului: multiplicatorul mediu pe primii 2 minus pe primii 8",
  },
  needs_setup: {
    share: 0.06,
    metric: (player, { pct }) => pct(player, (entry) => playstyleOf(entry).setupDependence) - pct(player, (entry) => primaryOf(entry).mechanics),
    label: "percentila setupDependence minus percentila mechanics în rol",
  },
  self_sufficient: {
    share: 0.06,
    metric: (player, { pct }) => pct(player, (entry) => primaryOf(entry).mechanics) - pct(player, (entry) => playstyleOf(entry).setupDependence),
    label: "percentila mechanics minus percentila setupDependence în rol",
  },
  series_adapter: {
    share: 0.07,
    metric: (player) => matchupLearning(player),
    label: "matchupLearning sus în rol",
  },
  fast_starter: {
    share: 0.06,
    metric: (player, { pct }) =>
      pct(player, (entry) => primaryOf(entry).currentForm) + pct(player, (entry) => primaryOf(entry).aggression) - pct(player, matchupLearning),
    label: "percentile currentForm + aggression − matchupLearning",
  },
  matchup_resilient: {
    share: 0.06,
    metric: (player, { pct }) =>
      pct(player, (entry) => primaryOf(entry).consistency) + pct(player, (entry) => primaryOf(entry).discipline) - pct(player, (entry) => primaryOf(entry).aggression),
    label: "percentile consistency + discipline − aggression",
  },
  lane_dominator: {
    share: 0.06,
    metric: (player, { pct }) => pct(player, (entry) => primaryOf(entry).laning) + pct(player, (entry) => primaryOf(entry).aggression),
    label: "percentile laning + aggression",
  },
};

// ─── Faza 3: Macro (§8.2) ────────────────────────────────────────────────────

const hiddenOf = (player: Player) => player.advancedProfile.hiddenTraits;

/**
 * PLAYER_TRAITS §8.2 — derivarea familiei Macro.
 *
 * shotcaller: un lider pe echipa de ORIGINE (teamId). Pe fiecare echipă, jucătorul cu leadership + communication cel
 *   mai mare primește trait-ul (dacă echipa n-are deja un shotcaller manual). Intensity 2: treimea de sus a
 *   shotcallerilor după leadership + communication. Pragurile absolute din spec (leadership ≥ 80, communication ≥ 70)
 *   dădeau doar 2 shotcalleri în ligă, iar percentila în rol îi alegea pe cei mai buni jucători (leadership corelează
 *   0,74 cu nivelul): GEN, T1, G2 și BLG aveau câte 5, iar 23 de echipe niciunul.
 *   Trait-ul rămâne pe jucător și dacă ajunge în altă echipă, deci într-un roster construit de user pot apărea
 *   2 shotcalleri sau niciunul. E intenționat (Team Fit avertizează). Free agents n-au echipă de origine: fără trait.
 * follower: relativ la rol, cu alocarea greedy din faza 2: percentila discipline minus percentila leadership în rol
 *   (execută, nu conduce), doar cu communication peste percentila 25 a rolului (comunică bine apelurile).
 * topside_jungler / botside_jungler: tot din echipa de origine (PlayerTendencies nu are un semnal de parte a
 *   hărții). Junglerul joacă pentru resource_hog-ul echipei: hog pe top / mid → topside, pe ADC → botside. Cu hogs pe
 *   ambele părți (top / mid și ADC), junglerul joacă flexibil: fără trait. Fără hog, fără trait. Doar intensity 1.
 */
export const MACRO_TRAIT_DERIVATION: Partial<Record<PlayerTraitId, DraftTraitRule>> = {
  follower: {
    share: 0.2,
    metric: (player, { pct }) =>
      pct(player, (entry) => hiddenOf(entry).communication) < 0.25
        ? null
        : pct(player, (entry) => primaryOf(entry).discipline) - pct(player, (entry) => hiddenOf(entry).leadership),
    label: "percentila discipline minus percentila leadership în rol, cu communication peste percentila 25 a rolului",
  },
};

export const SHOTCALLER_DERIVATION_LABEL = "un lider pe echipa de origine: leadership + communication maxim (intensity 2: treimea de sus)";
export const JUNGLE_SIDE_DERIVATION_LABEL =
"partea resource_hog-ului din echipa de origine (top / mid → topside, ADC → botside; hogs pe ambele părți → fără trait)";

const FREE_AGENT_TEAM = "free-agent";
const leaderScore = (player: Player) => hiddenOf(player).leadership + hiddenOf(player).communication;

/** Echipele de origine: teamId → jucători (fără free agents). Fiecare echipă are un singur jucător pe rol. */
function originTeams(list: Player[]) {
  const byTeam = new Map<string, Player[]>();
  for (const player of list) {
    if (!player.teamId || player.teamId === FREE_AGENT_TEAM) continue;
    byTeam.set(player.teamId, [...(byTeam.get(player.teamId) ?? []), player]);
  }
  return byTeam;
}

/** §8.2 — un shotcaller derivat pe echipa de origine. */
function deriveTeamShotcallers(
  list: Player[],
  overrides: Record<string, TraitOverride | undefined>,
  result: Map<string, { trait: PlayerTrait; score: number }[]>,
) {
  const manualIds = (player: Player) => (overrides[player.id]?.traits ?? []).map((entry) => entry.id);
  const chosen: Player[] = [];
  for (const members of originTeams(list).values()) {
    if (members.some((player) => manualIds(player).includes("shotcaller"))) continue;
    const eligible = members
      .filter((player) => !manualIds(player).includes("follower") && !(overrides[player.id]?.noDerivedTraits ?? []).includes("shotcaller"))
      .sort((a, b) => leaderScore(b) - leaderScore(a) || hiddenOf(b).leadership - hiddenOf(a).leadership || a.id.localeCompare(b.id));
    if (eligible[0]) chosen.push(eligible[0]);
  }
  chosen.sort((a, b) => leaderScore(b) - leaderScore(a) || a.id.localeCompare(b.id));
  const strong = Math.ceil(chosen.length * TRAIT_STRONG_SHARE);
  chosen.forEach((player, index) => {
    const current = result.get(player.id) ?? [];
    // Scorul contează doar pentru ordinea în familie la rezolvare: shotcaller înaintea părții hărții (scor 0).
    current.push({ trait: { id: "shotcaller", intensity: index < strong ? 2 : 1, source: "derived" }, score: 1 });
    result.set(player.id, current);
  });
}

/** §8.2 — partea hărții a junglerului, după resource_hog-ul (trait-urile deja rezolvate) din echipa de origine. */
function deriveJungleSide(list: Player[]): Map<string, PlayerTraitId> {
  const sides = new Map<string, PlayerTraitId>();
  for (const members of originTeams(list).values()) {
    const jungler = members.find((player) => player.role === "jungle");
    if (!jungler) continue;
    const hogs = members
      .filter((player) => player.role === "top" || player.role === "mid" || player.role === "adc")
      .filter((player) => player.traits.some((trait) => trait.id === "resource_hog"));
    const bot = hogs.some((player) => player.role === "adc");
    const top = hogs.some((player) => player.role !== "adc");
    // Hogs pe ambele părți (top / mid și ADC): junglerul joacă flexibil între ei, fără trait de parte a hărții.
    if (bot !== top) sides.set(jungler.id, bot ? "botside_jungler" : "topside_jungler");
  }
  return sides;
}

/**
 * Grade-urile vin din `championMasteryUtils`, care depinde (prin `championMasteryOverrides`) de `players`: nu le
 * putem citi cât se încarcă `players.ts`. `championMasteryUtils` își înregistrează funcțiile aici după ce s-a
 * încărcat, iar trait-urile ligii se recalculează o dată, cu `signature_player`.
 */
export function registerTraitGradeProvider(grade: MasteryFns["grade"], multiplier: MasteryFns["multiplier"]) {
  masteryFns = { grade, multiplier };
  if (lastAssignment) assignPlayerTraits(lastAssignment.list, lastAssignment.overrides);
}

/**
 * Un singur trait derivat din familie pe jucător (Draft, Macro), alocat greedy după scor: pe fiecare rol se sortează toate
 * perechile (jucător, trait) după scorul de derivare (percentila metricii trait-ului în rol: cât de distinctiv e
 * jucătorul pe acel trait), descrescător, și se atribuie în ordine. O pereche intră doar dacă trait-ul mai are loc în
 * cotă, jucătorul n-are încă un trait Draft derivat și trait-ul e compatibil cu cel de resurse și cu cele manuale.
 * Ordinea din listă nu contează.
 */
function deriveGreedyTraits(
  rules: Partial<Record<PlayerTraitId, DraftTraitRule>>,
  list: Player[],
  manual: ReadonlyMap<string, readonly PlayerTraitId[]>,
  result: Map<string, { trait: PlayerTrait; score: number }[]>,
) {
  const conflicts = (player: Player, id: PlayerTraitId) => {
    const others = [...(manual.get(player.id) ?? []), ...(result.get(player.id) ?? []).map((entry) => entry.trait.id)];
    return others.includes(id) || others.some((other) => PLAYER_TRAIT_INFO[id].excludes.includes(other) || PLAYER_TRAIT_INFO[other]?.excludes.includes(id));
  };
  for (const role of ["top", "jungle", "mid", "adc", "support"] as Role[]) {
    const inRole = list.filter((player) => player.role === role);
    const context: RoleContext = { inRole, pct: (player, value) => rolePercentile(inRole, player, value) };
    const quota = new Map<PlayerTraitId, number>();
    const pairs: { player: Player; id: PlayerTraitId; score: number }[] = [];
    for (const [id, rule] of Object.entries(rules) as [PlayerTraitId, DraftTraitRule][]) {
      if (!isTraitAllowedOnRole(id, role)) continue;
      const share = typeof rule.share === "number" ? rule.share : rule.share[role] ?? 0;
      const manualCount = inRole.filter((player) => (manual.get(player.id) ?? []).includes(id)).length;
      quota.set(id, Math.max(0, Math.ceil(share * inRole.length) - manualCount));
      const values = new Map(inRole.map((player) => [player.id, rule.metric(player, context)]));
      const valid = inRole.filter((player) => values.get(player.id) !== null);
      for (const player of valid) {
        pairs.push({ player, id, score: rolePercentile(valid, player, (entry) => values.get(entry.id) as number) });
      }
    }
    pairs.sort((a, b) => b.score - a.score);
    const assigned = new Set<string>();
    const taken = new Map<PlayerTraitId, { player: Player; score: number }[]>();
    for (const pair of pairs) {
      const list = taken.get(pair.id) ?? [];
      if (list.length >= (quota.get(pair.id) ?? 0) || assigned.has(pair.player.id) || conflicts(pair.player, pair.id)) continue;
      list.push({ player: pair.player, score: pair.score });
      taken.set(pair.id, list);
      assigned.add(pair.player.id);
    }
    for (const [id, entries] of taken) {
      const strong = Math.ceil(entries.length * TRAIT_STRONG_SHARE);
      entries.forEach(({ player, score }, index) => {
        const current = result.get(player.id) ?? [];
        current.push({ trait: { id, intensity: index < strong ? 2 : 1, source: "derived" }, score });
        result.set(player.id, current);
      });
    }
  }
}

/**
 * Trait-urile derivate pentru toată liga (playerId → trait-uri, cu scorul de derivare = distanța de prag).
 * Ținta pe rol (`share`) e totală: cota derivată = ținta − jucătorii setați manual cu trait-ul pe acel rol, iar
 * jucătorii cu un trait manual din aceeași familie nu mai intră în derivare.
 */
export function deriveLeagueTraits(
  sources: TraitSource[],
  manual: ReadonlyMap<string, readonly PlayerTraitId[]> = new Map(),
): Map<string, { trait: PlayerTrait; score: number }[]> {
  const result = new Map<string, { trait: PlayerTrait; score: number }[]>();
  for (const [id, rule] of Object.entries(TRAIT_DERIVATION) as [PlayerTraitId, (typeof TRAIT_DERIVATION)[keyof typeof TRAIT_DERIVATION]][]) {
    const family = PLAYER_TRAIT_INFO[id].family;
    for (const [role, share] of Object.entries(rule.share) as [Role, number][]) {
      const inRole = sources.filter((source) => source.role === role);
      const manualIds = (source: TraitSource) => manual.get(source.id) ?? [];
      const manualCount = inRole.filter((source) => manualIds(source).includes(id)).length;
      const quota = Math.max(0, Math.ceil(share * inRole.length) - manualCount);
      const ranked = inRole
        .filter((source) => !manualIds(source).some((other) => PLAYER_TRAIT_INFO[other]?.family === family))
        .sort((a, b) => (rule.direction === "high" ? b.playstyle.carryResourceUsage - a.playstyle.carryResourceUsage : a.playstyle.carryResourceUsage - b.playstyle.carryResourceUsage))
        .slice(0, quota);
      const threshold = ranked[ranked.length - 1]?.playstyle.carryResourceUsage ?? 0;
      const recipients = ranked
        .map((source) => ({ source, score: rule.direction === "high" ? source.playstyle.carryResourceUsage - threshold : threshold - source.playstyle.carryResourceUsage }))
        .filter((entry) => rule.filter(entry.source))
        .sort((a, b) => b.score - a.score);
      const strong = Math.ceil(recipients.length * TRAIT_STRONG_SHARE);
      recipients.forEach((entry, index) => {
        const list = result.get(entry.source.id) ?? [];
        list.push({ trait: { id, intensity: index < strong ? 2 : 1, source: "derived" }, score: entry.score });
        result.set(entry.source.id, list);
      });
    }
  }
  return result;
}

/**
 * Trait-urile finale: cele manuale întâi, apoi cele derivate (după scorul de derivare) care nu sunt blocate
 * (`noDerivedTraits`). Cel mult MAX_TRAITS_PER_FAMILY din aceeași familie, fără excluderi reciproce, doar pe rolurile
 * permise, cel mult MAX_PLAYER_TRAITS. Se păstrează și trait-urile familiilor inactive (pentru inventar); UI-ul și
 * efectele le filtrează cu `isActiveTrait`. Un trait manual pe un rol nepermis e ignorat și raportat de validare.
 */
export function resolvePlayerTraits(
  role: Role,
  derived: { trait: PlayerTrait; score: number }[],
  override?: TraitOverride,
): PlayerTrait[] {
  const result: PlayerTrait[] = [];
  const families = new Map<PlayerTraitFamily, number>();
  const add = (trait: PlayerTrait) => {
    const info = PLAYER_TRAIT_INFO[trait.id];
    if (!info || !isTraitAllowedOnRole(trait.id, role) || result.length >= MAX_PLAYER_TRAITS) return;
    if ((families.get(info.family) ?? 0) >= MAX_TRAITS_PER_FAMILY || result.some((entry) => entry.id === trait.id)) return;
    // Cel mult un trait derivat din familia Draft (vedetele adunau trait-uri corelate cu nivelul general).
    const derivedInFamily = result.filter((entry) => entry.source === "derived" && PLAYER_TRAIT_INFO[entry.id].family === info.family).length;
    if (trait.source === "derived" && derivedInFamily >= (MAX_DERIVED_PER_FAMILY[info.family] ?? MAX_TRAITS_PER_FAMILY)) return;
    if (result.some((entry) => info.excludes.includes(entry.id) || PLAYER_TRAIT_INFO[entry.id].excludes.includes(trait.id))) return;
    families.set(info.family, (families.get(info.family) ?? 0) + 1);
    result.push(trait);
  };
  for (const manual of override?.traits ?? []) add({ id: manual.id, intensity: manual.intensity ?? 1, source: "manual" });
  const blocked = new Set(override?.noDerivedTraits ?? []);
  // Pe familii, în ordinea fazelor (Resources întâi, ca până acum), apoi după scorul de derivare.
  const familyRank = (id: PlayerTraitId) => FAMILY_ORDER.indexOf(PLAYER_TRAIT_INFO[id].family);
  const ordered = [...derived].sort((a, b) => familyRank(a.trait.id) - familyRank(b.trait.id) || b.score - a.score);
  for (const entry of ordered) {
    if (!blocked.has(entry.trait.id)) add(entry.trait);
  }
  return result;
}

/** Atribuie trait-urile întregii ligi (după ce toți jucătorii există: pragurile sunt percentile pe rol). */
export function assignPlayerTraits(list: Player[], overrides: Record<string, TraitOverride | undefined>) {
  lastAssignment = { list, overrides };
  const manual = new Map(
    Object.entries(overrides).map(([playerId, override]) => [playerId, (override?.traits ?? []).map((entry) => entry.id)] as const),
  );
  const derived = deriveLeagueTraits(
    list.map((player) => ({ id: player.id, role: player.role, playstyle: player.advancedProfile.playstyle, hiddenTraits: player.advancedProfile.hiddenTraits })),
    manual,
  );
  deriveGreedyTraits(DRAFT_TRAIT_DERIVATION, list, manual, derived);
  deriveTeamShotcallers(list, overrides, derived);
  deriveGreedyTraits(MACRO_TRAIT_DERIVATION, list, manual, derived);
  for (const player of list) player.traits = resolvePlayerTraits(player.role, derived.get(player.id) ?? [], overrides[player.id]);
  // Partea hărții depinde de resource_hog-ul final (manual sau derivat) al echipei: a doua trecere, doar pe jungleri.
  for (const [junglerId, side] of deriveJungleSide(list)) {
    const player = list.find((entry) => entry.id === junglerId)!;
    const current = [...(derived.get(junglerId) ?? []), { trait: { id: side, intensity: 1 as const, source: "derived" as const }, score: 0 }];
    player.traits = resolvePlayerTraits(player.role, current, overrides[junglerId]);
  }
}

/** §1.1 — override-uri invalide: trait pe un rol nepermis, trait-uri care se exclud, id-uri necunoscute. */
export function validatePlayerTraitOverrides(
  list: Pick<Player, "id" | "role" | "name">[],
  overrides: Record<string, TraitOverride | undefined>,
): string[] {
  const errors: string[] = [];
  const byId = new Map(list.map((player) => [player.id, player]));
  for (const [playerId, override] of Object.entries(overrides)) {
    if (!override?.traits?.length && !override?.noDerivedTraits?.length) continue;
    const player = byId.get(playerId);
    if (!player) {
      errors.push(`${playerId}: override de trait-uri pentru un jucător inexistent`);
      continue;
    }
    const ids = override.traits?.map((entry) => entry.id) ?? [];
    for (const id of [...ids, ...(override.noDerivedTraits ?? [])]) {
      if (!PLAYER_TRAIT_INFO[id]) errors.push(`${playerId}: trait necunoscut "${id}"`);
    }
    for (const id of ids) {
      if (PLAYER_TRAIT_INFO[id] && !isTraitAllowedOnRole(id, player.role)) errors.push(`${playerId}: ${id} nu poate exista pe ${player.role}`);
      if (PLAYER_TRAIT_INFO[id]?.excludes.some((other) => ids.includes(other))) errors.push(`${playerId}: ${id} se exclude cu alt trait manual`);
    }
  }
  return errors;
}
