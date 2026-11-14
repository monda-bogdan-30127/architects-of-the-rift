// PLAYER_TRAITS §1.3 / §2 — trait-urile unui jucător (manual din `playerProfileOverrides`, altfel derivate din
// stats) și Team Fit (cum se potrivesc trait-urile celor 5 titulari).
//
// Derivarea stă în playerTraitDerivation.ts (fără import de `players`), re-exportată de aici; `computeTeamFit` citește
// `players` doar la apel.

import { players } from "@/app/data/players";
import type { Role } from "@/app/types/champion";
import type { Player } from "@/app/types/player";
import type { ChampionMasteryGrade } from "@/app/types/championMastery";
import { ACTIVE_TRAIT_FAMILIES, LOW_RESOURCE_TRAITS, isActiveTraitId, type PlayerTraitId } from "@/app/types/playerTraits";
import { DRAFT_THINKING_CONFIG } from "@/app/draft-engine/draftThinkingConfig";

export * from "./playerTraitDerivation";

export const hasTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  Boolean(player?.traits?.some((trait) => trait.id === id));

export const getTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  player?.traits?.find((trait) => trait.id === id) ?? null;

/** weakside_ready sau enabler (aceleași efecte de resurse): trait-ul jucătorului, dacă îl are. */
export const getLowResourceTrait = (player: Pick<Player, "traits"> | null | undefined) =>
  player?.traits?.find((trait) => LOW_RESOURCE_TRAITS.includes(trait.id)) ?? null;

// ─── §2 Team Fit ─────────────────────────────────────────────────────────────

export type TeamFitLevel = "good" | "neutral" | "warning";

/** TEAM_FIT_LIVE §1.3 — un sfat de analist (engleză). `id` e stabil, pentru diferențele din preview. */
export type TeamFitAdvice = {
  id: string;
  dimension: "resources" | "comms" | "draft" | "shotcalling";
  level: "warning" | "tip" | "good";
  text: string;
};

export type TeamFit = {
  hogs: { playerId: string; role: Role }[];
  weakside: { playerId: string; role: Role }[];
  enablers: { playerId: string; role: Role }[];
  /** Engleză (pagina de rosters). */
  warnings: string[];
  /** Engleză, pozitive (pagina de rosters). */
  notes: string[];
  // TEAM_FIT_LIVE §1.1 — dimensiunile structurate (roster parțial: rolurile goale lipsesc).
  filledRoles: Role[];
  resources: { hogCount: number; max: number; level: TeamFitLevel; summary: string };
  comms: {
    /** Media `hiddenTraits.communication` pe sloturile completate. */
    average: number | null;
    level: CommsLevel | null;
    weakest: { playerId: string; level: CommsLevel } | null;
    summary: string;
  };
  advice: TeamFitAdvice[];
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
  const fit: TeamFit = {
    hogs: [], weakside: [], enablers: [], warnings: [], notes: [],
    filledRoles: [],
    resources: { hogCount: 0, max: DRAFT_THINKING_CONFIG.attributes.maxHighDemand, level: "neutral", summary: "" },
    comms: { average: null, level: null, weakest: null, summary: "" },
    advice: [],
  };
  for (const role of ROLE_ORDER) {
    const playerId = roster[role];
    const player = playerId ? find(playerId) : undefined;
    if (!playerId || !player) continue;
    fit.filledRoles.push(role);
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
    const withTrait = (id: PlayerTraitId) =>
      options.includeInactive || isActiveTraitId(id) ? members.filter((entry) => hasTrait(entry.player, id)) : [];
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

  // §8.4 — familia Macro (doar când e activă sau la cerere).
  if (options.includeInactive || ACTIVE_TRAIT_FAMILIES.includes("macro")) {
    const macro = getMacroFit(roster, find, options.includeInactive);
    if (macro.shotcallers.length >= 2) fit.warnings.push("Two shotcallers: expect clashes on comms");
    if (macro.shotcallers.length === 0 && macro.filled === ROLE_ORDER.length) fit.warnings.push("No shotcaller: macro will be messy");
    if (macro.hierarchy) fit.notes.push(macro.hierarchy);
    if (macro.neglectedAdc) fit.warnings.push(macro.neglectedAdc);
    if (macro.sideNote) fit.notes.push(macro.sideNote);
  }
  buildLiveTeamFit(fit, roster, find);
  return fit;
}

/**
 * PLAYER_TRAITS §8.4 — shotcalling și partea hărții a junglerului pe roster (parțial):
 *   hierarchy: 1 shotcaller + ≥ 2 follower („Clear hierarchy: Keria leads, the rest follow”);
 *   neglectedAdc: topside_jungler cu un ADC resource_hog;
 *   sideNote: junglerul joacă pentru un resource_hog, iar partea opusă are weakside_ready („Oner plays for Peyz; Doran
 *     holds top on weakside”).
 */
function getMacroFit(roster: Partial<Record<Role, string>>, find: (playerId: string) => Player | undefined, includeInactive = false) {
  const playerOn = (role: Role) => (roster[role] ? find(roster[role]!) : undefined);
  const has = (player: Player | undefined, id: PlayerTraitId) => (includeInactive || isActiveTraitId(id)) && hasTrait(player, id);
  const members = ROLE_ORDER.flatMap((role) => (playerOn(role) ? [{ role, player: playerOn(role)! }] : []));
  const shotcallers = members.filter((entry) => has(entry.player, "shotcaller"));
  const followers = members.filter((entry) => has(entry.player, "follower"));
  const hierarchy = shotcallers.length === 1 && followers.length >= 2
    ? `Clear hierarchy: ${shotcallers[0].player.name} leads, ${followers.length === members.length - 1 ? "the rest follow" : `${joinNames(followers.map((entry) => entry.player.name))} follow`}`
    : null;
  const jungler = playerOn("jungle");
  const side = has(jungler, "topside_jungler") ? "top" : has(jungler, "botside_jungler") ? "bot" : null;
  const adc = playerOn("adc");
  const neglectedAdc = side === "top" && has(adc, "resource_hog") ? "Topside jungler with a resource-hungry ADC: bot lane will feel neglected" : null;
  let sideNote: string | null = null;
  if (side && jungler) {
    const sideRoles: Role[] = side === "top" ? ["top", "mid"] : ["adc"];
    const oppositeRoles: Role[] = side === "top" ? ["adc"] : ["top"];
    const carry = sideRoles.map(playerOn).find((player) => has(player, "resource_hog"));
    const weakside = oppositeRoles.map((role) => ({ role, player: playerOn(role) })).find((entry) => has(entry.player, "weakside_ready"));
    if (carry && weakside) sideNote = `${jungler.name} plays for ${carry.name}; ${weakside.player!.name} holds ${weakside.role === "adc" ? "bot" : "top"} on weakside`;
  }
  return { filled: members.length, shotcallers, followers, hierarchy, neglectedAdc, sideNote };
}

const ADVICE_LEVEL_ORDER: TeamFitAdvice["level"][] = ["warning", "tip", "good"];
const ADVICE_DIMENSION_ORDER: TeamFitAdvice["dimension"][] = ["resources", "comms", "draft", "shotcalling"];

/** TEAM_FIT_LIVE §1.3 — cel mult `limit` sfaturi: întâi warning, apoi tip, apoi good; la egalitate, după dimensiune. */
export function topAdvice(advice: readonly TeamFitAdvice[], limit = 3): TeamFitAdvice[] {
  return [...advice]
    .sort((a, b) => ADVICE_LEVEL_ORDER.indexOf(a.level) - ADVICE_LEVEL_ORDER.indexOf(b.level) || ADVICE_DIMENSION_ORDER.indexOf(a.dimension) - ADVICE_DIMENSION_ORDER.indexOf(b.dimension))
    .slice(0, limit);
}

/** TEAM_FIT_LIVE §1.1 / §1.3 — dimensiunile structurate și sfaturile (merg și pe roster parțial). */
function buildLiveTeamFit(fit: TeamFit, roster: Partial<Record<Role, string>>, find: (playerId: string) => Player | undefined) {
  const members = ROLE_ORDER.flatMap((role) => {
    const player = roster[role] ? find(roster[role]!) : undefined;
    return player ? [{ role, player }] : [];
  });
  const empty = ROLE_ORDER.length - members.length;
  const add = (advice: TeamFitAdvice) => fit.advice.push(advice);
  const nameOf = (playerId: string) => find(playerId)?.name ?? playerId;

  // Resources
  const hogCount = fit.hogs.length;
  const max = fit.resources.max;
  const split = fit.notes.find((note) => note.startsWith("Clear resource split"));
  fit.resources = {
    hogCount,
    max,
    level: hogCount > max ? "warning" : hogCount === max || (hogCount >= 1 && split) ? "good" : "neutral",
    summary: `${hogCount}/${max} carries`,
  };
  if (hogCount > max) add({ id: "resources-too-many", dimension: "resources", level: "warning", text: `${hogCount} players want resources (${fit.hogs.map((entry) => nameOf(entry.playerId)).join(", ")})` });
  if (fit.warnings.includes("Two carries off bot lane: the ADC will be starved")) {
    add({ id: "resources-adc-starved", dimension: "resources", level: "warning", text: "Two carries off bot lane: the ADC will be starved" });
  }
  if (hogCount === max && empty > 0) add({ id: "resources-full", dimension: "resources", level: "tip", text: "You have your two carries. Look for weakside or enabler players" });
  if (hogCount === 0 && empty <= 1 && members.length > 0) add({ id: "resources-no-carry", dimension: "resources", level: "tip", text: "No resource-hungry carry yet: consider one as your win condition" });
  if (split) add({ id: "resources-split", dimension: "resources", level: "good", text: split });

  // Comms (același câmp ca computeTeamChemistry; sfaturile doar de la 2 sloturi completate)
  if (members.length) {
    const values = members.map((entry) => ({ playerId: entry.player.id, value: entry.player.advancedProfile?.hiddenTraits?.communication ?? 50 }));
    const average = values.reduce((sum, entry) => sum + entry.value, 0) / values.length;
    const weakest = [...values].sort((a, b) => a.value - b.value)[0];
    const level = getCommsLevel(average);
    fit.comms = { average, level, weakest: { playerId: weakest.playerId, level: getCommsLevel(weakest.value) }, summary: `Team comms: ${level}` };
    if (members.length >= 2) {
      const poor = values.find((entry) => getCommsLevel(entry.value) === "Poor");
      if (poor) add({ id: "comms-poor-player", dimension: "comms", level: "warning", text: `${nameOf(poor.playerId)}'s comms are Poor: teamfights will suffer` });
      else if (average < 55) add({ id: "comms-low", dimension: "comms", level: "tip", text: `Team comms: ${level}. Look for players with Good or Elite comms` });
      if (average >= 70) add({ id: "comms-high", dimension: "comms", level: "good", text: `Team comms: ${level}. Expect clean teamfights` });
    }
  }

  // Draft (doar trait-urile active)
  const withTrait = (id: PlayerTraitId) => (isActiveTraitId(id) ? members.filter((entry) => hasTrait(entry.player, id)) : []);
  if (withTrait("counter_specialist").length >= 2) add({ id: "draft-two-counter", dimension: "draft", level: "warning", text: "Two counter-pickers: one of them will have to blind" });
  const setupCarries = withTrait("needs_setup");
  if (setupCarries.length >= 2) add({ id: "draft-two-setup", dimension: "draft", level: "warning", text: "Two carries need setup: hard to draft for both" });
  if (setupCarries.length >= 1) {
    const support = members.find((entry) => entry.role === "support")?.player;
    const carry = setupCarries[0].player.name;
    if (!support) add({ id: "draft-setup-no-engage", dimension: "draft", level: "tip", text: `${carry} needs setup: pick an engage support` });
    else if (!["setup", "playmaker", "tank"].includes(support.playstyleIdentity.primary)) {
      add({ id: "draft-setup-no-engage", dimension: "draft", level: "tip", text: `${carry} needs setup, but your support doesn't engage` });
    }
  }
  if (withTrait("signature_player").length >= 3) add({ id: "draft-signature-heavy", dimension: "draft", level: "warning", text: "Three signature players: bans will hurt this roster" });
  if (withTrait("series_adapter").length >= 2) add({ id: "draft-adapters", dimension: "draft", level: "good", text: "This roster gets better as the series goes on" });
  if (withTrait("fast_starter").length >= 2) add({ id: "draft-fast-starters", dimension: "draft", level: "good", text: "Strong starts: aim to win game 1" });
  // Shotcalling (PLAYER_TRAITS faza 3, TEAM_FIT_LIVE §1.3; doar cu familia Macro activă)
  if (isActiveTraitId("shotcaller") && members.length) {
    const macro = getMacroFit(roster, find);
    if (macro.shotcallers.length >= 2) add({ id: "shotcalling-two", dimension: "shotcalling", level: "warning", text: "Two shotcallers: expect clashes on comms" });
    if (macro.shotcallers.length === 0 && empty <= 1) add({ id: "shotcalling-none", dimension: "shotcalling", level: "tip", text: "No shotcaller yet: macro will be messy" });
    if (macro.hierarchy) add({ id: "shotcalling-hierarchy", dimension: "shotcalling", level: "good", text: macro.hierarchy });
    if (macro.neglectedAdc) add({ id: "resources-jungle-neglects-adc", dimension: "resources", level: "warning", text: macro.neglectedAdc });
    if (macro.sideNote) add({ id: "resources-jungle-side", dimension: "resources", level: "good", text: macro.sideNote });
  }
}

export type TeamFitChange = {
  resources: { from: number; to: number; level: "better" | "worse" | "same" };
  comms: { from: CommsLevel | null; to: CommsLevel | null; level: "better" | "worse" | "same" };
  /** Sfaturi care apar. */
  added: TeamFitAdvice[];
  /** Sfaturi care dispar. */
  resolved: TeamFitAdvice[];
};

/**
 * TEAM_FIT_LIVE §1.2 — ce s-ar schimba în Team Fit dacă alegi candidatul: intră pe rolul lui și îl înlocuiește pe cel
 * ales acolo. Dacă e deja ales pe rolul lui, arată ce s-ar schimba dacă l-ai scoate.
 */
export function previewTeamFitChange(
  roster: Partial<Record<Role, string>>,
  candidate: Pick<Player, "id" | "role">,
  lookup?: (playerId: string) => Player | undefined,
): TeamFitChange {
  const next: Partial<Record<Role, string>> = { ...roster };
  if (roster[candidate.role] === candidate.id) delete next[candidate.role];
  else next[candidate.role] = candidate.id;
  const before = computeTeamFit(roster, lookup);
  const after = computeTeamFit(next, lookup);
  const max = before.resources.max;
  const from = before.resources.hogCount;
  const to = after.resources.hogCount;
  const lowBefore = before.weakside.length + before.enablers.length;
  const lowAfter = after.weakside.length + after.enablers.length;
  const resourcesLevel: "better" | "worse" | "same" =
    to > max && to > from ? "worse"
      : from > max && to < from ? "better"
        : from === 0 && to === 1 ? "better"
          : from >= max && lowAfter > lowBefore ? "better"
            : from > 0 && to === 0 ? "worse"
              : "same";
  const rank = (level: CommsLevel | null) => (level ? COMMS_LEVEL_ORDER.indexOf(level) : -1);
  const commsLevel = before.comms.level === null || after.comms.level === null || before.comms.level === after.comms.level
    ? "same"
    : rank(after.comms.level) > rank(before.comms.level) ? "better" : "worse";
  const beforeIds = new Set(before.advice.map((entry) => entry.id));
  const afterIds = new Set(after.advice.map((entry) => entry.id));
  return {
    resources: { from, to, level: resourcesLevel },
    comms: { from: before.comms.level, to: after.comms.level, level: commsLevel },
    added: after.advice.filter((entry) => !beforeIds.has(entry.id)),
    resolved: before.advice.filter((entry) => !afterIds.has(entry.id)),
  };
}

// ─── §3 Colorarea pe draftul de campioni ─────────────────────────────────────

export type TraitTone = "good" | "bad" | "neutral";

export type TraitToneContext = {
  /** resourceDemand al campionului din slot (null = niciun campion). */
  demand: number | null;
  /** Grade-ul jucătorului pe campion (signature_player). */
  grade?: ChampionMasteryGrade | null;
  /** Ordinea pe lane: „counter” = adversarul a ales deja pe rolul lui, „blind” = alege primul. */
  order?: "blind" | "counter";
  /** Setup-ul celorlalți campioni ai echipei (needs_setup). */
  setup?: number;
};

/**
 * §3 / §7.4 — culoarea trait-ului pe draftul de campioni:
 *   resource_hog: cerere ≥ 4 verde, ≤ 2 roșu; weakside_ready / enabler: cerere ≤ 2 verde;
 *   counter_specialist: verde pe counter, roșu pe blind; blind_safe: verde pe blind;
 *   signature_player: verde pe SS / S, roșu pe C / D / F; needs_setup: verde la setup ≥ setupHigh, roșu ≤ setupLow.
 */
export function getTraitTone(id: PlayerTraitId, context: TraitToneContext): TraitTone {
  const { demand, grade, order, setup } = context;
  const { highDemandMin, weaksideMax } = DRAFT_THINKING_CONFIG.attributes;
  if (id === "resource_hog") return demand === null ? "neutral" : demand >= highDemandMin ? "good" : demand <= weaksideMax ? "bad" : "neutral";
  if (LOW_RESOURCE_TRAITS.includes(id)) return demand !== null && demand <= weaksideMax ? "good" : "neutral";
  if (id === "counter_specialist") return order === "counter" ? "good" : order === "blind" ? "bad" : "neutral";
  if (id === "blind_safe") return order === "blind" ? "good" : "neutral";
  if (id === "needs_setup" && setup !== undefined) {
    return setup >= DRAFT_THINKING_CONFIG.traits.setupHigh ? "good" : setup <= DRAFT_THINKING_CONFIG.traits.setupLow ? "bad" : "neutral";
  }
  if (id === "signature_player" && grade) return grade === "SS" || grade === "S" ? "good" : grade === "C" || grade === "D" || grade === "F" ? "bad" : "neutral";
  return "neutral";
}

// ─── §3.1 Comunicarea (roster view, tooltip) ─────────────────────────────────

export type CommsLevel = "Poor" | "Average" | "Good" | "Elite";
export const COMMS_TOOLTIP = "How well he talks and coordinates with the team. Affects teamfights and clutch moments.";

/** Nivelul de comunicare: < 45 Poor, 45–59 Average, 60–74 Good, ≥ 75 Elite (roster view, Team Fit). */
export function getCommsLevel(value: number): CommsLevel {
  return value >= 75 ? "Elite" : value >= 60 ? "Good" : value >= 45 ? "Average" : "Poor";
}
export const COMMS_LEVEL_ORDER: readonly CommsLevel[] = ["Poor", "Average", "Good", "Elite"];

/**
 * `hiddenTraits.communication` (același câmp ca în computeTeamChemistry) ca nivel. Vechea etichetă „Leader” a fost
 * înlocuită de trait-ul shotcaller (PLAYER_TRAITS faza 3), afișat cu celelalte trait-uri.
 */
export function getCommsInfo(player: Pick<Player, "advancedProfile">): { level: CommsLevel } {
  const communication = player.advancedProfile?.hiddenTraits?.communication ?? 50;
  return { level: getCommsLevel(communication) };
}

/** Trait-ul jucătorului, doar dacă e activ (familie activă, efecte implementate). */
export const getActiveTrait = (player: Pick<Player, "traits"> | null | undefined, id: PlayerTraitId) =>
  isActiveTraitId(id) ? getTrait(player, id) : null;
