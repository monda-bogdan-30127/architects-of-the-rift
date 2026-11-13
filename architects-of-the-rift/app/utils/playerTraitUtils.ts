// PLAYER_TRAITS §1.3 / §2 — trait-urile unui jucător (manual din `playerProfileOverrides`, altfel derivate din
// stats) și Team Fit (cum se potrivesc trait-urile celor 5 titulari).
//
// Notă: `players.ts` importă derivarea de aici, iar `computeTeamFit` citește `players` doar la apel (nu la încărcarea
// modulului), ca ciclul de import să nu conteze.

import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import type { Player, PlayerHiddenTraits, PlayerPlaystyleProfile } from "@/app/types/player";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { derivePlayerAdaptationProfile } from "@/app/draft-engine/playerProfileSystem";
import {
  ACTIVE_TRAIT_FAMILIES,
  LOW_RESOURCE_TRAITS,
  MAX_PLAYER_TRAITS,
  MAX_TRAITS_PER_FAMILY,
  PLAYER_TRAIT_INFO,
  isTraitAllowedOnRole,
  type PlayerTrait,
  type PlayerTraitFamily,
  type PlayerTraitId,
} from "@/app/types/playerTraits";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";

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


/** Fracția celor cu trait-ul (pe rol) care primesc intensity 2. */
export const TRAIT_STRONG_SHARE = 1 / 3;

export type ManualTraitInput = { id: PlayerTraitId; intensity?: 1 | 2 };
export type TraitOverride = { traits?: ManualTraitInput[]; noDerivedTraits?: PlayerTraitId[] };

type TraitSource = { id: string; role: Role; playstyle: PlayerPlaystyleProfile; hiddenTraits: PlayerHiddenTraits };

// ─── Faza 2: Draft & Series (§7.2) ───────────────────────────────────────────

type DraftTraitRule = {
  /** Ținta în rol (fracție), totală (manualele se scad din cotă). */
  share: number;
  /** Metrica după care se aleg cei mai buni din rol (mai mare = mai potrivit). */
  metric: (player: Player) => number;
  /** Condiție suplimentară (poate folosi mediana rolului). */
  eligible?: (player: Player, inRole: Player[]) => boolean;
  label: string;
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)] ?? 0;
};
const primaryOf = (player: Player) => player.advancedProfile.primary;
const roleMedian = (inRole: Player[], value: (player: Player) => number) => median(inRole.map(value));
const matchupLearning = (player: Player) => derivePlayerAdaptationProfile(player).matchupLearning;

/**
 * PLAYER_TRAITS §7.2 — derivarea familiei Draft & Series, relativă la rol (cota pe rol după metrica trait-ului).
 * `signature_player` se derivă din grade-uri (vezi `registerTraitGradeProvider`).
 */
export const DRAFT_TRAIT_DERIVATION: Partial<Record<PlayerTraitId, DraftTraitRule>> = {
  blind_safe: {
    share: 0.15,
    metric: (player) => primaryOf(player).blindPickStrength,
    eligible: (player) => primaryOf(player).blindPickStrength >= primaryOf(player).counterPickStrength + 8,
    label: "blindPickStrength sus în rol și ≥ counterPickStrength + 8",
  },
  counter_specialist: {
    share: 0.15,
    metric: (player) => primaryOf(player).counterPickStrength,
    eligible: (player) => primaryOf(player).counterPickStrength >= primaryOf(player).blindPickStrength + 8,
    label: "counterPickStrength sus în rol și ≥ blindPickStrength + 8",
  },
  needs_setup: {
    share: 0.15,
    metric: (player) => player.advancedProfile.playstyle.setupDependence,
    eligible: (player, inRole) =>
      player.advancedProfile.playstyle.carryResourceUsage > roleMedian(inRole, (entry) => entry.advancedProfile.playstyle.carryResourceUsage),
    label: "setupDependence sus în rol, carryResourceUsage peste mediana rolului",
  },
  self_sufficient: {
    share: 0.15,
    metric: (player) => -player.advancedProfile.playstyle.setupDependence,
    eligible: (player, inRole) => primaryOf(player).mechanics > roleMedian(inRole, (entry) => primaryOf(entry).mechanics),
    label: "setupDependence jos în rol, mechanics peste mediana rolului",
  },
  series_adapter: {
    share: 0.12,
    metric: matchupLearning,
    label: "matchupLearning sus în rol",
  },
  fast_starter: {
    share: 0.1,
    metric: (player) => (primaryOf(player).currentForm + primaryOf(player).aggression) / 2,
    eligible: (player, inRole) => matchupLearning(player) < roleMedian(inRole, matchupLearning),
    label: "matchupLearning sub mediana rolului, currentForm + aggression sus",
  },
  matchup_resilient: {
    share: 0.12,
    metric: (player) => (primaryOf(player).consistency + primaryOf(player).discipline) / 2,
    eligible: (player, inRole) => primaryOf(player).aggression < roleMedian(inRole, (entry) => primaryOf(entry).aggression),
    label: "consistency + discipline sus în rol, aggression sub mediană",
  },
  lane_dominator: {
    share: 0.12,
    metric: (player) => (primaryOf(player).laning + primaryOf(player).aggression) / 2,
    label: "laning + aggression sus în rol",
  },
};

/** signature_player: ≥ 1 SS și ≤ 4 A+ pe championPool (intensity 2: ≥ 2 SS și ≤ 3 A+). */
export const SIGNATURE_RULE = { minSS: 1, maxAPlus: 4, strongMinSS: 2, strongMaxAPlus: 3 } as const;

type GradeFn = (player: Player, championId: string) => ChampionMasteryGrade;
let gradeProvider: GradeFn | null = null;
let lastAssignment: { list: Player[]; overrides: Record<string, TraitOverride | undefined> } | null = null;

/**
 * Grade-urile vin din `championMasteryUtils`, care depinde (prin `championMasteryOverrides`) de `players`: nu le
 * putem citi cât se încarcă `players.ts`. `championMasteryUtils` își înregistrează `getChampionGrade` aici după ce
 * s-a încărcat, iar trait-urile ligii se recalculează o dată, cu `signature_player`.
 */
export function registerTraitGradeProvider(fn: GradeFn) {
  gradeProvider = fn;
  if (lastAssignment) assignPlayerTraits(lastAssignment.list, lastAssignment.overrides);
}

function deriveDraftTraits(
  list: Player[],
  manual: ReadonlyMap<string, readonly PlayerTraitId[]>,
  result: Map<string, { trait: PlayerTrait; score: number }[]>,
) {
  const push = (playerId: string, trait: PlayerTrait, score: number) => {
    const entries = result.get(playerId) ?? [];
    entries.push({ trait, score });
    result.set(playerId, entries);
  };
  for (const [id, rule] of Object.entries(DRAFT_TRAIT_DERIVATION) as [PlayerTraitId, DraftTraitRule][]) {
    const info = PLAYER_TRAIT_INFO[id];
    for (const role of info.roles ?? (["top", "jungle", "mid", "adc", "support"] as Role[])) {
      const inRole = list.filter((player) => player.role === role);
      const manualIds = (player: Player) => manual.get(player.id) ?? [];
      const manualCount = inRole.filter((player) => manualIds(player).includes(id)).length;
      const quota = Math.max(0, Math.ceil(rule.share * inRole.length) - manualCount);
      const recipients = inRole
        .filter((player) => !manualIds(player).includes(id) && !manualIds(player).some((other) => info.excludes.includes(other)))
        .filter((player) => !rule.eligible || rule.eligible(player, inRole))
        .sort((a, b) => rule.metric(b) - rule.metric(a))
        .slice(0, quota);
      const strong = Math.ceil(recipients.length * TRAIT_STRONG_SHARE);
      // Scorul de derivare: rangul în cotă (1 = cel mai potrivit), comparabil între trait-urile familiei.
      recipients.forEach((player, index) =>
        push(player.id, { id, intensity: index < strong ? 2 : 1, source: "derived" }, 1 - index / Math.max(1, quota)),
      );
    }
  }
  if (!gradeProvider) return;
  const grade = gradeProvider;
  for (const player of list) {
    if (manual.get(player.id)?.includes("signature_player")) continue;
    const grades = player.championPool.map((championId) => grade(player, championId));
    const ss = grades.filter((entry) => entry === "SS").length;
    const aPlus = grades.filter((entry) => entry === "SS" || entry === "S" || entry === "A").length;
    if (ss < SIGNATURE_RULE.minSS || aPlus > SIGNATURE_RULE.maxAPlus) continue;
    const strong = ss >= SIGNATURE_RULE.strongMinSS && aPlus <= SIGNATURE_RULE.strongMaxAPlus;
    push(player.id, { id: "signature_player", intensity: strong ? 2 : 1, source: "derived" }, 0.5 + 0.1 * ss - 0.05 * aPlus);
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
    if (result.some((entry) => info.excludes.includes(entry.id) || PLAYER_TRAIT_INFO[entry.id].excludes.includes(trait.id))) return;
    families.set(info.family, (families.get(info.family) ?? 0) + 1);
    result.push(trait);
  };
  for (const manual of override?.traits ?? []) add({ id: manual.id, intensity: manual.intensity ?? 1, source: "manual" });
  const blocked = new Set(override?.noDerivedTraits ?? []);
  // Familia Resources întâi (un singur trait posibil, ca până acum), apoi celelalte după scorul de derivare.
  const ordered = [...derived].sort((a, b) => {
    const resourcesA = PLAYER_TRAIT_INFO[a.trait.id].family === "resources" ? 1 : 0;
    const resourcesB = PLAYER_TRAIT_INFO[b.trait.id].family === "resources" ? 1 : 0;
    return resourcesB - resourcesA || b.score - a.score;
  });
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
  deriveDraftTraits(list, manual, derived);
  for (const player of list) player.traits = resolvePlayerTraits(player.role, derived.get(player.id) ?? [], overrides[player.id]);
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

export const hasTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  Boolean(player?.traits?.some((trait) => trait.id === id));

export const getTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  player?.traits?.find((trait) => trait.id === id) ?? null;

/** weakside_ready sau enabler (aceleași efecte de resurse): trait-ul jucătorului, dacă îl are. */
export const getLowResourceTrait = (player: Pick<Player, "traits"> | null | undefined) =>
  player?.traits?.find((trait) => LOW_RESOURCE_TRAITS.includes(trait.id)) ?? null;

// ─── §2 Team Fit ─────────────────────────────────────────────────────────────

export type TeamFit = {
  hogs: { playerId: string; role: Role }[];
  weakside: { playerId: string; role: Role }[];
  enablers: { playerId: string; role: Role }[];
  /** Engleză. */
  warnings: string[];
  /** Engleză, pozitive. */
  notes: string[];
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "adc", "support"];

/** „Chovy and Ruler”, „A, B and C”. */
const joinNames = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? "");

export function computeTeamFit(
  roster: Partial<Record<Role, string>>,
  lookup?: (playerId: string) => Player | undefined,
  /** Inventarul cere și mesajele familiilor încă inactive. */
  options: { includeInactive?: boolean } = {},
): TeamFit {
  const find = lookup ?? ((playerId: string) => players.find((player) => player.id === playerId));
  const fit: TeamFit = { hogs: [], weakside: [], enablers: [], warnings: [], notes: [] };
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const player = playerId ? find(playerId) : undefined;
    if (!playerId || !player) continue;
    if (hasTrait(player, "resource_hog")) fit.hogs.push({ playerId, role });
    if (hasTrait(player, "weakside_ready")) fit.weakside.push({ playerId, role });
    if (hasTrait(player, "enabler")) fit.enablers.push({ playerId, role });
  }
  const names = (list: { playerId: string }[]) => list.map((entry) => find(entry.playerId)?.name ?? entry.playerId);

  if (fit.hogs.length > DRAFT_THINKING_CONFIG.attributes.maxHighDemand) {
    fit.warnings.push(`${fit.hogs.length} players want resources (${names(fit.hogs).join(", ")})`);
  }
  if (fit.hogs.length === 2 && !fit.hogs.some((entry) => entry.role === "adc") && roster.adc && !fit.weakside.some((entry) => entry.role === "adc")) {
    fit.warnings.push("Two carries off bot lane: the ADC will be starved");
  }
  if (fit.hogs.length >= 1 && fit.weakside.length + fit.enablers.length >= 1) {
    const parts = [`${joinNames(names(fit.hogs))} ${fit.hogs.length > 1 ? "carry" : "carries"}`];
    if (fit.weakside.length) parts.push(`${joinNames(names(fit.weakside))} ${fit.weakside.length > 1 ? "play" : "plays"} weakside`);
    if (fit.enablers.length) parts.push(`${joinNames(names(fit.enablers))} ${fit.enablers.length > 1 ? "enable" : "enables"}`);
    fit.notes.push(`Clear resource split: ${parts.join(", ")}`);
  }
  if (fit.hogs.length === 0) fit.notes.push("No resource-hungry carry: flexible, but no obvious win condition");

  // §7.5 — familia Draft & Series (doar când e activă sau la cerere).
  if (options.includeInactive || ACTIVE_TRAIT_FAMILIES.includes("draft")) {
    const members = ROLE_ORDER.flatMap((role) => {
      const player = roster[role] ? find(roster[role]!) : undefined;
      return player ? [{ role, player }] : [];
    });
    const withTrait = (id: PlayerTraitId) => members.filter((entry) => hasTrait(entry.player, id));
    if (withTrait("counter_specialist").length >= 2) fit.warnings.push("Two counter-pickers: one of them will have to blind");
    const setupCarries = withTrait("needs_setup");
    if (setupCarries.length >= 2) fit.warnings.push("Two carries need setup: hard to draft for both");
    const setupStyles = ["setup", "playmaker", "tank"];
    const hasSetupPlayer = members.some(
      (entry) => (entry.role === "support" || entry.role === "jungle") && setupStyles.includes(entry.player.playstyleIdentity.primary),
    );
    if (setupCarries.length >= 1 && !hasSetupPlayer) {
      fit.warnings.push(`${setupCarries[0].player.name} needs setup, but nobody on the roster plays engage`);
    }
    if (withTrait("fast_starter").length >= 2) fit.notes.push("Strong starts: aim to win game 1");
    if (withTrait("series_adapter").length >= 2) fit.notes.push("This roster gets better as the series goes on");
    if (withTrait("signature_player").length >= 3) fit.warnings.push("Three signature players: bans will hurt this roster");
  }
  return fit;
}

// ─── §3 Colorarea pe draftul de campioni ─────────────────────────────────────

export type TraitTone = "good" | "bad" | "neutral";

/** Cum se potrivește trait-ul cu un campion de cererea dată (resource_hog: ≥ 4 verde, ≤ 2 roșu; low-resource: ≤ 2 verde). */
export function getTraitTone(id: PlayerTraitId, demand: number | null): TraitTone {
  if (demand === null) return "neutral";
  const { highDemandMin, weaksideMax } = DRAFT_THINKING_CONFIG.attributes;
  if (id === "resource_hog") return demand >= highDemandMin ? "good" : demand <= weaksideMax ? "bad" : "neutral";
  if (LOW_RESOURCE_TRAITS.includes(id)) return demand <= weaksideMax ? "good" : "neutral";
  return "neutral";
}

// ─── §3.1 Comunicarea (roster view, tooltip) ─────────────────────────────────

export type CommsLevel = "Poor" | "Average" | "Good" | "Elite";
export const COMMS_TOOLTIP = "How well he talks and coordinates with the team. Affects teamfights and clutch moments.";
/** Pragul de leadership de la care jucătorul e marcat „Leader” (ca LEADERSHIP_TRAIT_THRESHOLD din Spirit), până la trait-ul shotcaller. */
export const LEADER_THRESHOLD = 80;

/** `hiddenTraits.communication` ca nivel: < 45 Poor, 45–59 Average, 60–74 Good, ≥ 75 Elite. */
export function getCommsInfo(player: Pick<Player, "advancedProfile">): { level: CommsLevel; leader: boolean } {
  const communication = player.advancedProfile?.hiddenTraits?.communication ?? 50;
  const leadership = player.advancedProfile?.hiddenTraits?.leadership ?? 0;
  const level: CommsLevel = communication >= 75 ? "Elite" : communication >= 60 ? "Good" : communication >= 45 ? "Average" : "Poor";
  return { level, leader: leadership >= LEADER_THRESHOLD };
}
