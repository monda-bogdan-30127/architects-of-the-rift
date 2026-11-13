// PLAYER_TRAITS §1.3 / §2 — trait-urile unui jucător (manual din `playerProfileOverrides`, altfel derivate din
// stats) și Team Fit (cum se potrivesc trait-urile celor 5 titulari).
//
// Notă: `players.ts` importă derivarea de aici, iar `computeTeamFit` citește `players` doar la apel (nu la încărcarea
// modulului), ca ciclul de import să nu conteze.

import { players } from "@/app/data/players";
import { championsById } from "@/app/data/champions";
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


/** Cel mult atâtea trait-uri derivate dintr-o familie (manualele pot trece peste). */
const MAX_DERIVED_PER_FAMILY: Partial<Record<PlayerTraitFamily, number>> = { draft: 1 };

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
  /** Ținta în rol (fracție), totală (manualele se scad din cotă). */
  share: number;
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
    share: 0.15,
    metric: (player) => blindMinusCounter(player),
    label: "sus în rol la blindPickStrength − counterPickStrength",
  },
  counter_specialist: {
    share: 0.15,
    metric: (player) => -blindMinusCounter(player),
    label: "jos în rol la blindPickStrength − counterPickStrength",
  },
  signature_player: {
    share: 0.12,
    metric: (player) => signatureConcentration(player),
    label: "concentrarea pool-ului: multiplicatorul mediu pe primii 2 minus pe primii 8",
  },
  needs_setup: {
    share: 0.12,
    metric: (player, { pct }) => pct(player, (entry) => playstyleOf(entry).setupDependence) - pct(player, (entry) => primaryOf(entry).mechanics),
    label: "percentila setupDependence minus percentila mechanics în rol",
  },
  self_sufficient: {
    share: 0.12,
    metric: (player, { pct }) => pct(player, (entry) => primaryOf(entry).mechanics) - pct(player, (entry) => playstyleOf(entry).setupDependence),
    label: "percentila mechanics minus percentila setupDependence în rol",
  },
  series_adapter: {
    share: 0.12,
    metric: (player) => matchupLearning(player),
    label: "matchupLearning sus în rol",
  },
  fast_starter: {
    share: 0.1,
    metric: (player, { pct }) =>
      pct(player, (entry) => primaryOf(entry).currentForm) + pct(player, (entry) => primaryOf(entry).aggression) - pct(player, matchupLearning),
    label: "percentile currentForm + aggression − matchupLearning",
  },
  matchup_resilient: {
    share: 0.12,
    metric: (player, { pct }) =>
      pct(player, (entry) => primaryOf(entry).consistency) + pct(player, (entry) => primaryOf(entry).discipline) - pct(player, (entry) => primaryOf(entry).aggression),
    label: "percentile consistency + discipline − aggression",
  },
  lane_dominator: {
    share: 0.12,
    metric: (player, { pct }) => pct(player, (entry) => primaryOf(entry).laning) + pct(player, (entry) => primaryOf(entry).aggression),
    label: "percentile laning + aggression",
  },
};

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
 * Un singur trait derivat din familia Draft pe jucător: pe fiecare rol, trait-urile își umplu cota pe rând (round-robin),
 * fiecare cu următorul candidat din clasamentul lui care nu are deja un trait Draft derivat și nu se exclude cu
 * trait-ul lui de resurse sau cu cele manuale. Așa fiecare trait ajunge la țintă, iar vedetele (primele în mai multe
 * clasamente) primesc unul singur.
 */
function deriveDraftTraits(
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
    const queues = (Object.entries(DRAFT_TRAIT_DERIVATION) as [PlayerTraitId, DraftTraitRule][])
      .filter(([id]) => isTraitAllowedOnRole(id, role))
      .map(([id, rule]) => {
        const manualCount = inRole.filter((player) => (manual.get(player.id) ?? []).includes(id)).length;
        const quota = Math.max(0, Math.ceil(rule.share * inRole.length) - manualCount);
        const ranked = inRole
          .map((player) => ({ player, value: rule.metric(player, context) }))
          .filter((entry): entry is { player: Player; value: number } => entry.value !== null)
          .sort((a, b) => b.value - a.value)
          .map((entry) => entry.player);
        return { id, quota, ranked, cursor: 0, taken: [] as Player[] };
      });
    // Limita e pe trait-urile derivate; cele manuale trec peste ea (și sunt verificate la conflicte).
    const hasDraftTrait = new Set<string>();
    let progress = true;
    while (progress) {
      progress = false;
      for (const queue of queues) {
        if (queue.taken.length >= queue.quota) continue;
        while (queue.cursor < queue.ranked.length) {
          const candidate = queue.ranked[queue.cursor];
          queue.cursor += 1;
          if (hasDraftTrait.has(candidate.id) || conflicts(candidate, queue.id)) continue;
          queue.taken.push(candidate);
          hasDraftTrait.add(candidate.id);
          progress = true;
          break;
        }
      }
    }
    for (const queue of queues) {
      const strong = Math.ceil(queue.taken.length * TRAIT_STRONG_SHARE);
      queue.taken.forEach((player, index) => {
        const entries = result.get(player.id) ?? [];
        entries.push({ trait: { id: queue.id, intensity: index < strong ? 2 : 1, source: "derived" }, score: 1 - index / Math.max(1, queue.quota) });
        result.set(player.id, entries);
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
