// Matchup-uri și mustWith pe rol (DRAFT_REWORK §2.2).
//
// O intrare pentru fiecare campion × fiecare rol din `roles`, în ordinea din
// champions.ts. Se citește DOAR prin `draft-engine/championMatchups.ts`, care
// derivă și sensul opus (A weakVs B nota g ⇒ B goodVs A nota g), deci fiecare
// relație e scrisă o singură dată.
//
// Note (definițiile complete în draft-engine/matchupGrades.ts):
//   5 = mereu, indiferent de context
//   4 = condiționat: se pierde dacă slăbiciunile celui countrat sunt acoperite de echipă
//   3 = linie ok/egală, decide din mid game încolo
//   2 = avantaj în lane phase, se egalizează după
//   1 = skill matchup, decide în mare parte jucătorul
// `vsRole` lipsă = matchup de linie (pe bot: inamicul pe adc SAU support).
// `mustWith` = doar id-uri, ordinea = preferința.

import type { ChampionRoleKey, ChampionRoleMatchups } from "@/app/types/champion";

export const championRoleMatchups: Record<ChampionRoleKey, ChampionRoleMatchups> = {
  "orianna:mid": {
    goodVs: [
      { championId: "taliyah", score: 3 },
      { championId: "azir", score: 1 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "leblanc", score: 2 },
      { championId: "yone", score: 2 },
    ],
    mustWith: [],
  },
  "ambessa:top": {
    goodVs: [
      { championId: "ornn", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește dash-urile Ambessei" },
      { championId: "gwen", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "ambessa:jungle": {
    goodVs: [
      { championId: "wukong", score: 1 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește dash-urile Ambessei" },
      { championId: "jarvan-iv", score: 2 },
    ],
    mustWith: [],
  },
  "jarvan-iv:jungle": {
    goodVs: [
      { championId: "xin-zhao", score: 1 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește combo-ul EQ" },
      { championId: "maokai", score: 3 },
      { championId: "lee-sin", score: 2 },
      { championId: "qiyana", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "rumble:top": {
    goodVs: [
      { championId: "yorick", score: 4, note: "AoE care curăță ghoul-ii și Maiden-ul" },
      { championId: "ornn", score: 2 },
    ],
    weakVs: [
      { championId: "gwen", score: 3 },
      { championId: "aurora", score: 2 },
      { championId: "gnar", score: 2 },
    ],
    mustWith: [],
  },
  "vi:jungle": {
    goodVs: [],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește Q-ul lui Vi" },
      { championId: "maokai", score: 3 },
      { championId: "khazix", score: 2 },
      { championId: "skarner", score: 2 },
    ],
    mustWith: [],
  },
  "neeko:support": {
    goodVs: [
      { championId: "nautilus", score: 2 },
    ],
    weakVs: [
      { championId: "bard", score: 2 },
      { championId: "braum", score: 2 },
      { championId: "ezreal", score: 2 },
      { championId: "karma", score: 2 },
      { championId: "seraphine", score: 2 },
    ],
    mustWith: [],
  },
  "nautilus:support": {
    goodVs: [],
    weakVs: [
      { championId: "morgana", score: 4, note: "black shield anulează hook-ul și ult-ul" },
      { championId: "alistar", score: 1 },
      { championId: "poppy", score: 1 },
      { championId: "rakan", score: 1 },
      { championId: "rell", score: 1 },
    ],
    mustWith: [],
  },
  "varus:adc": {
    goodVs: [
      { championId: "aphelios", score: 2 },
      { championId: "ezreal", score: 2 },
      { championId: "jinx", score: 2 },
      { championId: "ziggs", score: 2 },
    ],
    weakVs: [
      { championId: "zeri", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: [],
  },
  "ryze:mid": {
    goodVs: [
      { championId: "aurora", score: 3 },
      { championId: "galio", score: 3 },
      { championId: "taliyah", score: 2 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "anivia", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "twisted-fate", score: 1 },
    ],
    mustWith: [],
  },
  "yunara:adc": {
    goodVs: [
      { championId: "jinx", score: 1 },
      { championId: "kaisa", score: 1 },
      { championId: "smolder", score: 1 },
    ],
    weakVs: [
      { championId: "ashe", score: 2 },
      { championId: "caitlyn", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "ezreal", score: 1 },
    ],
    mustWith: ["lulu", "milio", "nami"],
  },
  "azir:mid": {
    goodVs: [
      { championId: "aurora", score: 3 },
      { championId: "galio", score: 3 },
      { championId: "twisted-fate", score: 3 },
      { championId: "sylas", score: 2 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "yone", score: 2 },
      { championId: "ziggs", score: 2 },
    ],
    mustWith: [],
  },
  "xin-zhao:jungle": {
    goodVs: [
      { championId: "nocturne", score: 2 },
      { championId: "pantheon", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește E-ul lui Xin" },
      { championId: "ambessa", score: 2 },
      { championId: "khazix", score: 2 },
      { championId: "skarner", score: 2 },
    ],
    mustWith: [],
  },
  "karma:support": {
    goodVs: [
      { championId: "braum", score: 2 },
      { championId: "nami", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "leona", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "thresh", score: 2 },
    ],
    mustWith: [],
  },
  "ezreal:adc": {
    goodVs: [
      { championId: "miss-fortune", score: 2 },
      { championId: "ziggs", score: 2 },
      { championId: "corki", score: 1 },
      { championId: "jhin", score: 1 },
    ],
    weakVs: [
      { championId: "sivir", score: 3 },
      { championId: "draven", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: [],
  },
  "pantheon:jungle": {
    goodVs: [
      { championId: "lee-sin", score: 2 },
      { championId: "lillia", score: 2 },
      { championId: "nocturne", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește leap-ul lui W" },
      { championId: "maokai", score: 3 },
      { championId: "sejuani", score: 3 },
      { championId: "skarner", score: 3 },
      { championId: "jarvan-iv", score: 1 },
    ],
    mustWith: [],
  },
  "caitlyn:adc": {
    goodVs: [],
    weakVs: [
      { championId: "kaisa", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "draven", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "lucian", score: 2 },
    ],
    mustWith: [],
  },
  "ahri:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
      { championId: "syndra", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "aurelion-sol", score: 3 },
      { championId: "cassiopeia", score: 2 },
      { championId: "leblanc", score: 2 },
      { championId: "lissandra", score: 2 },
      { championId: "sylas", score: 1 },
    ],
    mustWith: [],
  },
  "bard:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
    ],
    weakVs: [
      { championId: "janna", score: 2 },
      { championId: "karma", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "renata-glasc", score: 2 },
      { championId: "yuumi", score: 1 },
    ],
    mustWith: [],
  },
  "taliyah:mid": {
    goodVs: [
      { championId: "hwei", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "kassadin", score: 3 },
      { championId: "ziggs", score: 2 },
      { championId: "leblanc", score: 1 },
      { championId: "yone", score: 1 },
    ],
    mustWith: [],
  },
  "taliyah:adc": {
    goodVs: [],
    weakVs: [
      { championId: "ziggs", score: 2 },
    ],
    mustWith: [],
  },
  "sion:top": {
    goodVs: [
      { championId: "aurora", score: 3 },
      { championId: "jayce", score: 3 },
      { championId: "renekton", score: 3 },
      { championId: "volibear", score: 3 },
    ],
    weakVs: [
      { championId: "gwen", score: 4, note: "damage pe %HP contra tank-ului" },
      { championId: "mordekaiser", score: 4, note: "ult-ul și damage-ul contra tank-urilor" },
      { championId: "camille", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "kennen", score: 2 },
    ],
    mustWith: [],
  },
  "ksante:top": {
    goodVs: [
      { championId: "jayce", score: 3 },
      { championId: "aurora", score: 1 },
      { championId: "jax", score: 1 },
      { championId: "sion", score: 1 },
    ],
    weakVs: [
      { championId: "vayne", score: 4, note: "true damage și kite contra tank-ului" },
      { championId: "yorick", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
      { championId: "ambessa", score: 1 },
    ],
    mustWith: [],
  },
  "dr-mundo:jungle": {
    goodVs: [
      { championId: "lillia", score: 3 },
      { championId: "viego", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "jarvan-iv", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "pantheon", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "dr-mundo:top": {
    goodVs: [],
    weakVs: [
      { championId: "aatrox", score: 2 },
    ],
    mustWith: [],
  },
  "zaahen:jungle": {
    goodVs: [
      { championId: "vi", score: 2 },
      { championId: "wukong", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "ambessa", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "zaahen:top": {
    goodVs: [
      { championId: "ksante", score: 2 },
      { championId: "sion", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "ambessa", score: 2 },
      { championId: "gnar", score: 2 },
    ],
    mustWith: [],
  },
  "ashe:adc": {
    goodVs: [
      { championId: "lucian", score: 3 },
      { championId: "corki", score: 2 },
      { championId: "jinx", score: 2 },
    ],
    weakVs: [
      { championId: "aphelios", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "varus", score: 2 },
      { championId: "ezreal", score: 1 },
    ],
    mustWith: ["seraphine"],
  },
  "corki:adc": {
    goodVs: [
      { championId: "jhin", score: 2 },
      { championId: "jinx", score: 2 },
      { championId: "tristana", score: 2 },
      { championId: "yunara", score: 2 },
      { championId: "zeri", score: 2 },
    ],
    weakVs: [
      { championId: "kaisa", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "varus", score: 2 },
    ],
    mustWith: [],
  },
  "aurora:mid": {
    goodVs: [
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 4, note: "pasivul de MR și engage-ul anulează burst-ul" },
      { championId: "annie", score: 2 },
      { championId: "orianna", score: 2 },
      { championId: "taliyah", score: 2 },
    ],
    mustWith: [],
  },
  "aurora:top": {
    goodVs: [],
    weakVs: [
      { championId: "galio", score: 4, note: "pasivul de MR și engage-ul anulează burst-ul" },
      { championId: "gnar", score: 2 },
    ],
    mustWith: [],
  },
  "gwen:top": {
    goodVs: [],
    weakVs: [
      { championId: "aurora", score: 2 },
      { championId: "jayce", score: 2 },
      { championId: "zaahen", score: 2 },
      { championId: "jax", score: 1 },
    ],
    mustWith: [],
  },
  "renekton:top": {
    goodVs: [],
    weakVs: [
      { championId: "camille", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "vayne", score: 3 },
      { championId: "gnar", score: 2 },
    ],
    mustWith: [],
  },
  "lulu:support": {
    goodVs: [
      { championId: "neeko", score: 2 },
      { championId: "braum", score: 1 },
      { championId: "karma", score: 1 },
    ],
    weakVs: [
      { championId: "blitzcrank", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "thresh", score: 2 },
      { championId: "milio", score: 1 },
    ],
    mustWith: [],
  },
  "wukong:jungle": {
    goodVs: [
      { championId: "dr-mundo", score: 2 },
      { championId: "lillia", score: 2 },
      { championId: "viego", score: 2 },
      { championId: "nocturne", score: 1 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește Nimbus Strike" },
      { championId: "maokai", score: 3 },
      { championId: "skarner", score: 2 },
      { championId: "vi", score: 2 },
      { championId: "qiyana", score: 1 },
    ],
    mustWith: [],
  },
  "gnar:top": {
    goodVs: [
      { championId: "ksante", score: 2 },
    ],
    weakVs: [
      { championId: "jax", score: 3 },
      { championId: "vayne", score: 3 },
      { championId: "jayce", score: 2 },
      { championId: "kennen", score: 2 },
    ],
    mustWith: [],
  },
  "aatrox:jungle": {
    goodVs: [
      { championId: "ambessa", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    weakVs: [
      { championId: "jarvan-iv", score: 2 },
      { championId: "pantheon", score: 2 },
    ],
    mustWith: [],
  },
  "aatrox:top": {
    goodVs: [
      { championId: "ambessa", score: 2 },
    ],
    weakVs: [
      { championId: "camille", score: 4, note: "true damage și duel superior în sidelane" },
      { championId: "gwen", score: 3 },
      { championId: "gnar", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "akali:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
    ],
    weakVs: [
      { championId: "lissandra", score: 4, note: "ult point-click și W care o prind în shroud" },
      { championId: "ahri", score: 2 },
      { championId: "annie", score: 2 },
      { championId: "twisted-fate", score: 2 },
    ],
    mustWith: [],
  },
  "nocturne:jungle": {
    goodVs: [
      { championId: "sejuani", score: 2 },
    ],
    weakVs: [
      { championId: "skarner", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "lee-sin", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "nami:support": {
    goodVs: [
      { championId: "milio", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "neeko", score: 2 },
      { championId: "seraphine", score: 2 },
      { championId: "thresh", score: 2 },
    ],
    mustWith: ["lucian", "corki", "jhin", "caitlyn"],
  },
  "alistar:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
      { championId: "leona", score: 1 },
    ],
    weakVs: [
      { championId: "janna", score: 4, note: "disengage care anulează combo-ul de engage" },
      { championId: "bard", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "renata-glasc", score: 2 },
      { championId: "seraphine", score: 2 },
    ],
    mustWith: [],
  },
  "kaisa:adc": {
    goodVs: [
      { championId: "ezreal", score: 3 },
      { championId: "samira", score: 1 },
    ],
    weakVs: [
      { championId: "aphelios", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "jinx", score: 1 },
      { championId: "zeri", score: 1 },
    ],
    mustWith: ["nautilus", "neeko", "alistar"],
  },
  "galio:mid": {
    goodVs: [
      { championId: "sylas", score: 4, note: "pasivul de MR contra burst-ului AP" },
      { championId: "viktor", score: 4, note: "pasivul de MR și engage pe un mage imobil" },
    ],
    weakVs: [
      { championId: "ahri", score: 2 },
      { championId: "annie", score: 2 },
      { championId: "orianna", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "yone", score: 1 },
    ],
    mustWith: [],
  },
  "galio:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "sivir:adc": {
    goodVs: [
      { championId: "ashe", score: 3 },
      { championId: "jhin", score: 3 },
      { championId: "zeri", score: 2 },
    ],
    weakVs: [
      { championId: "yunara", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "tristana", score: 2 },
      { championId: "kaisa", score: 1 },
    ],
    mustWith: [],
  },
  "seraphine:support": {
    goodVs: [
      { championId: "karma", score: 2 },
      { championId: "lulu", score: 2 },
    ],
    weakVs: [
      { championId: "bard", score: 2 },
      { championId: "braum", score: 2 },
      { championId: "leona", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "thresh", score: 2 },
    ],
    mustWith: ["ashe"],
  },
  "seraphine:adc": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "anivia:mid": {
    goodVs: [
      { championId: "galio", score: 2 },
    ],
    weakVs: [
      { championId: "azir", score: 2 },
      { championId: "orianna", score: 2 },
      { championId: "swain", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    mustWith: [],
  },
  "anivia:support": {
    goodVs: [
      { championId: "seraphine", score: 2 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "rakan:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește dash-urile lui Rakan" },
      { championId: "bard", score: 2 },
      { championId: "neeko", score: 2 },
      { championId: "renata-glasc", score: 2 },
      { championId: "seraphine", score: 2 },
    ],
    mustWith: ["xayah"],
  },
  "syndra:mid": {
    goodVs: [
      { championId: "azir", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "hwei", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "annie", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "vex", score: 2 },
      { championId: "twisted-fate", score: 1 },
    ],
    mustWith: [],
  },
  "syndra:adc": {
    goodVs: [],
    weakVs: [
      { championId: "taliyah", score: 2 },
    ],
    mustWith: [],
  },
  "leona:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
      { championId: "nami", score: 2 },
    ],
    weakVs: [
      { championId: "milio", score: 4, note: "ult-ul curăță CC-ul lui Leona" },
      { championId: "poppy", score: 4, note: "W oprește E-ul lui Leona" },
      { championId: "bard", score: 2 },
      { championId: "neeko", score: 2 },
      { championId: "rakan", score: 1 },
    ],
    mustWith: [],
  },
  "mel:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
      { championId: "galio", score: 2 },
      { championId: "yone", score: 2 },
      { championId: "annie", score: 1 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "azir", score: 2 },
      { championId: "hwei", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "syndra", score: 2 },
    ],
    mustWith: [],
  },
  "mel:adc": {
    goodVs: [],
    weakVs: [
      { championId: "syndra", score: 2 },
    ],
    mustWith: [],
  },
  "ornn:top": {
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "gnar", score: 1 },
      { championId: "ksante", score: 1 },
      { championId: "volibear", score: 1 },
    ],
    weakVs: [
      { championId: "gwen", score: 4, note: "damage pe %HP contra tank-ului" },
      { championId: "jax", score: 3 },
      { championId: "jayce", score: 2 },
      { championId: "poppy", score: 2 },
    ],
    mustWith: [],
  },
  "braum:support": {
    goodVs: [
      { championId: "poppy", score: 2 },
      { championId: "soraka", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "bard", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "rell", score: 2 },
    ],
    mustWith: [],
  },
  "jhin:adc": {
    goodVs: [
      { championId: "aphelios", score: 2 },
      { championId: "kogmaw", score: 2 },
    ],
    weakVs: [
      { championId: "jinx", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "caitlyn", score: 2 },
    ],
    mustWith: [],
  },
  "aphelios:adc": {
    goodVs: [
      { championId: "ezreal", score: 3 },
    ],
    weakVs: [
      { championId: "caitlyn", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "sivir", score: 2 },
      { championId: "yunara", score: 1 },
      { championId: "zeri", score: 1 },
    ],
    mustWith: [],
  },
  "xayah:adc": {
    goodVs: [
      { championId: "corki", score: 3 },
    ],
    weakVs: [
      { championId: "ashe", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "sivir", score: 1 },
    ],
    mustWith: ["rakan"],
  },
  "jax:top": {
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "renekton", score: 3 },
    ],
    weakVs: [
      { championId: "gangplank", score: 2 },
      { championId: "gragas", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "rumble", score: 2 },
      { championId: "ambessa", score: 1 },
    ],
    mustWith: [],
  },
  "jayce:top": {
    goodVs: [
      { championId: "ambessa", score: 2 },
      { championId: "kennen", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 3 },
      { championId: "yorick", score: 3 },
      { championId: "gragas", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "rell:support": {
    goodVs: [
      { championId: "seraphine", score: 2 },
      { championId: "leona", score: 1 },
    ],
    weakVs: [
      { championId: "milio", score: 4, note: "ult-ul curăță CC-ul lui Rell" },
      { championId: "poppy", score: 4, note: "W oprește W-ul lui Rell" },
      { championId: "bard", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "neeko", score: 2 },
    ],
    mustWith: [],
  },
  "poppy:support": {
    goodVs: [
      { championId: "camille", score: 4, note: "W oprește E-ul Camillei" },
    ],
    weakVs: [
      { championId: "shen", score: 2 },
    ],
    mustWith: [],
  },
  "poppy:jungle": {
    goodVs: [],
    weakVs: [
      { championId: "trundle", score: 3 },
      { championId: "aatrox", score: 2 },
    ],
    mustWith: [],
  },
  "poppy:top": {
    goodVs: [
      { championId: "camille", score: 4, note: "W oprește E-ul Camillei" },
    ],
    weakVs: [
      { championId: "gwen", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "jayce", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "shen", score: 2 },
    ],
    mustWith: [],
  },
  "viktor:mid": {
    goodVs: [
      { championId: "cassiopeia", score: 2 },
      { championId: "kassadin", score: 2 },
      { championId: "mel", score: 2 },
      { championId: "xerath", score: 1 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "annie", score: 2 },
      { championId: "azir", score: 2 },
      { championId: "leblanc", score: 2 },
      { championId: "orianna", score: 1 },
    ],
    mustWith: [],
  },
  "malphite:jungle": {
    goodVs: [
      { championId: "xin-zhao", score: 3 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "jarvan-iv", score: 2 },
    ],
    mustWith: [],
  },
  "malphite:top": {
    goodVs: [
      { championId: "tryndamere", score: 5, note: "armura și ult-ul anulează complet Tryndamere" },
      { championId: "gangplank", score: 4, note: "armura și ult-ul anulează GP-ul AD" },
      { championId: "jayce", score: 4, note: "armura anulează poke-ul AD" },
      { championId: "gnar", score: 1 },
    ],
    weakVs: [
      { championId: "gwen", score: 4, note: "damage AP și true damage contra tank-ului de armură" },
      { championId: "camille", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "gragas", score: 2 },
      { championId: "ornn", score: 1 },
    ],
    mustWith: [],
  },
  "annie:mid": {
    goodVs: [
      { championId: "hwei", score: 2 },
      { championId: "leblanc", score: 2 },
    ],
    weakVs: [
      { championId: "ryze", score: 3 },
      { championId: "ahri", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "lissandra", score: 2 },
    ],
    mustWith: [],
  },
  "naafiri:jungle": {
    goodVs: [
      { championId: "lillia", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește dash-ul" },
      { championId: "jarvan-iv", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "vi", score: 2 },
      { championId: "wukong", score: 2 },
    ],
    mustWith: [],
  },
  "leblanc:mid": {
    goodVs: [
      { championId: "azir", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "ziggs", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 4, note: "pasivul de MR și taunt-ul anulează burst-ul" },
      { championId: "lissandra", score: 4, note: "CC point-click pe LeBlanc" },
      { championId: "malzahar", score: 4, note: "spell shield și ult point-click" },
      { championId: "vex", score: 4, note: "pasivul pedepsește dash-urile" },
      { championId: "kassadin", score: 3 },
    ],
    mustWith: [],
  },
  "qiyana:jungle": {
    goodVs: [
      { championId: "xin-zhao", score: 2 },
    ],
    weakVs: [
      { championId: "nocturne", score: 2 },
      { championId: "pantheon", score: 2 },
      { championId: "trundle", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "sylas:mid": {
    goodVs: [
      { championId: "leblanc", score: 2 },
    ],
    weakVs: [
      { championId: "kassadin", score: 3 },
      { championId: "aurora", score: 2 },
      { championId: "hwei", score: 2 },
    ],
    mustWith: [],
  },
  "sylas:jungle": {
    goodVs: [
      { championId: "sejuani", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],
    weakVs: [
      { championId: "lee-sin", score: 2 },
      { championId: "skarner", score: 2 },
      { championId: "trundle", score: 2 },
    ],
    mustWith: [],
  },
  "cassiopeia:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
      { championId: "yone", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 4, note: "pasivul de MR și engage pe un mage imobil" },
      { championId: "aurelion-sol", score: 3 },
      { championId: "anivia", score: 2 },
      { championId: "malzahar", score: 2 },
      { championId: "yasuo", score: 1 },
    ],
    mustWith: [],
  },
  "trundle:jungle": {
    goodVs: [
      { championId: "naafiri", score: 2 },
    ],
    weakVs: [
      { championId: "khazix", score: 2 },
      { championId: "kindred", score: 2 },
      { championId: "lillia", score: 2 },
      { championId: "nidalee", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "lee-sin:jungle": {
    goodVs: [
      { championId: "trundle", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește Q2 și insec-ul" },
      { championId: "aatrox", score: 2 },
      { championId: "vi", score: 2 },
      { championId: "qiyana", score: 1 },
      { championId: "wukong", score: 1 },
    ],
    mustWith: [],
  },
  "kennen:top": {
    goodVs: [
      { championId: "malphite", score: 4, note: "AP la distanță, armura nu ajută" },
      { championId: "ksante", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 5, note: "pasivul de MR al lui W anulează burst-ul AP" },
      { championId: "ornn", score: 3 },
      { championId: "camille", score: 2 },
      { championId: "gwen", score: 2 },
      { championId: "rumble", score: 1 },
    ],
    mustWith: [],
  },
  "yone:mid": {
    goodVs: [
      { championId: "leblanc", score: 2 },
      { championId: "sylas", score: 1 },
    ],
    weakVs: [
      { championId: "annie", score: 2 },
      { championId: "aurora", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "swain", score: 2 },
      { championId: "twisted-fate", score: 2 },
    ],
    mustWith: [],
  },
  "zoe:mid": {
    goodVs: [
      { championId: "azir", score: 2 },
      { championId: "orianna", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 4, note: "pasivul de MR și engage pe un mage fragil" },
      { championId: "ahri", score: 2 },
      { championId: "akali", score: 2 },
      { championId: "leblanc", score: 2 },
      { championId: "lissandra", score: 2 },
    ],
    mustWith: [],
  },
  "lux:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "yuumi", score: 2 },
    ],
    weakVs: [
      { championId: "blitzcrank", score: 4, note: "hook pe un support imobil" },
      { championId: "leona", score: 4, note: "engage pe un support imobil" },
      { championId: "nautilus", score: 4, note: "hook și CC point-click pe un support imobil" },
      { championId: "alistar", score: 2 },
      { championId: "braum", score: 2 },
    ],
    mustWith: [],
  },
  "yasuo:mid": {
    goodVs: [
      { championId: "hwei", score: 2 },
      { championId: "twisted-fate", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "lissandra", score: 4, note: "CC point-click pe un campion care trăiește din dash-uri" },
      { championId: "vex", score: 4, note: "pasivul pedepsește dash-urile" },
    ],
    mustWith: [],
  },
  "yasuo:top": {
    goodVs: [
      { championId: "gnar", score: 2 },
    ],
    weakVs: [
      { championId: "malphite", score: 4, note: "armura și ult-ul de neoprit prin windwall" },
      { championId: "renekton", score: 2 },
    ],
    mustWith: [],
  },
  "rengar:jungle": {
    goodVs: [
      { championId: "graves", score: 2 },
      { championId: "khazix", score: 2 },
    ],
    weakVs: [
      { championId: "rammus", score: 4, note: "armură și taunt contra burst-ului AD" },
      { championId: "sejuani", score: 4, note: "tank cu CC, nu poate fi one-shot" },
      { championId: "skarner", score: 4, note: "tank cu suppression, nu poate fi one-shot" },
      { championId: "zac", score: 2 },
      { championId: "ivern", score: 1 },
    ],
    mustWith: [],
  },
  "rengar:top": {
    goodVs: [],
    weakVs: [
      { championId: "zac", score: 2 },
    ],
    mustWith: [],
  },
  "aurelion-sol:mid": {
    goodVs: [
      { championId: "orianna", score: 3 },
      { championId: "ryze", score: 3 },
      { championId: "veigar", score: 3 },
      { championId: "viktor", score: 3 },
    ],
    weakVs: [
      { championId: "annie", score: 2 },
      { championId: "azir", score: 2 },
      { championId: "syndra", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "yone", score: 2 },
    ],
    mustWith: [],
  },
  "olaf:top": {
    goodVs: [
      { championId: "ornn", score: 4, note: "true damage și imunitate la CC în ult" },
      { championId: "gnar", score: 2 },
      { championId: "ksante", score: 2 },
      { championId: "sion", score: 2 },
    ],
    weakVs: [
      { championId: "kennen", score: 4, note: "kite la distanță contra juggernaut-ului" },
      { championId: "fiora", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "rumble", score: 2 },
      { championId: "udyr", score: 1 },
    ],
    mustWith: [],
  },
  "maokai:jungle": {
    goodVs: [
      { championId: "lillia", score: 4, note: "CC point-click contra kite-ului" },
      { championId: "poppy", score: 2 },
    ],
    weakVs: [
      { championId: "trundle", score: 4, note: "ult-ul fură rezistențele tank-ului" },
      { championId: "dr-mundo", score: 3 },
      { championId: "kindred", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "naafiri", score: 2 },
    ],
    mustWith: [],
  },
  "maokai:support": {
    goodVs: [
      { championId: "alistar", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "poppy", score: 2 },
    ],
    weakVs: [
      { championId: "braum", score: 2 },
      { championId: "nami", score: 2 },
    ],
    mustWith: [],
  },
  "nidalee:jungle": {
    goodVs: [
      { championId: "jarvan-iv", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "viego", score: 2 },
      { championId: "wukong", score: 2 },
    ],
    weakVs: [
      { championId: "vi", score: 4, note: "ult point-click, Nidalee nu poate scăpa" },
      { championId: "sejuani", score: 3 },
      { championId: "skarner", score: 3 },
      { championId: "zac", score: 3 },
      { championId: "volibear", score: 2 },
    ],
    mustWith: ["renekton", "twisted-fate"],
  },
  "lucian:adc": {
    goodVs: [
      { championId: "jhin", score: 2 },
    ],
    weakVs: [
      { championId: "senna", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "yunara", score: 3 },
      { championId: "draven", score: 2 },
      { championId: "kalista", score: 2 },
    ],
    mustWith: ["nami", "milio", "braum"],
  },
  "irelia:top": {
    goodVs: [
      { championId: "gnar", score: 2 },
      { championId: "jayce", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "shen", score: 2 },
      { championId: "poppy", score: 1 },
    ],
    weakVs: [
      { championId: "ornn", score: 4, note: "prea tanky pentru all-in, CC care oprește stack-urile" },
      { championId: "sion", score: 3 },
      { championId: "renekton", score: 2 },
      { championId: "camille", score: 1 },
    ],
    mustWith: [],
  },
  "irelia:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "jinx:adc": {
    goodVs: [
      { championId: "ezreal", score: 3 },
    ],
    weakVs: [
      { championId: "samira", score: 4, note: "dive pe un carry imobil" },
      { championId: "caitlyn", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "zeri", score: 1 },
    ],
    mustWith: ["lulu", "milio"],
  },
  "sejuani:jungle": {
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "naafiri", score: 3 },
      { championId: "viego", score: 3 },
      { championId: "wukong", score: 3 },
    ],
    weakVs: [
      { championId: "trundle", score: 4, note: "ult-ul fură rezistențele tank-ului" },
      { championId: "dr-mundo", score: 3 },
      { championId: "jarvan-iv", score: 2 },
      { championId: "khazix", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "pyke:support": {
    goodVs: [
      { championId: "braum", score: 2 },
      { championId: "karma", score: 2 },
    ],
    weakVs: [
      { championId: "tahm-kench", score: 4, note: "devour salvează aliatul de execute" },
      { championId: "bard", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "lux", score: 2 },
      { championId: "shen", score: 2 },
    ],
    mustWith: [],
  },
  "kogmaw:adc": {
    goodVs: [
      { championId: "caitlyn", score: 3 },
      { championId: "sivir", score: 3 },
      { championId: "tristana", score: 3 },
    ],
    weakVs: [
      { championId: "aphelios", score: 2 },
      { championId: "ezreal", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "xayah", score: 2 },
      { championId: "jinx", score: 1 },
    ],
    mustWith: ["lulu", "braum", "milio"],
  },
  "yorick:top": {
    goodVs: [
      { championId: "ornn", score: 3 },
      { championId: "jax", score: 1 },
    ],
    weakVs: [
      { championId: "gangplank", score: 4, note: "butoaiele curăță ghoul-ii" },
      { championId: "aatrox", score: 2 },
      { championId: "ambessa", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "sion", score: 1 },
    ],
    mustWith: [],
  },
  "thresh:support": {
    goodVs: [],
    weakVs: [
      { championId: "lux", score: 2 },
      { championId: "pyke", score: 2 },
      { championId: "shen", score: 2 },
      { championId: "rell", score: 1 },
    ],
    mustWith: [],
  },
  "nunu:jungle": {
    goodVs: [
      { championId: "nidalee", score: 3 },
      { championId: "karthus", score: 2 },
      { championId: "kindred", score: 2 },
      { championId: "lillia", score: 2 },
      { championId: "graves", score: 1 },
    ],
    weakVs: [
      { championId: "trundle", score: 4, note: "ult-ul fură stats-urile tank-ului și invade-uri" },
      { championId: "jarvan-iv", score: 2 },
      { championId: "lee-sin", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "camille:top": {
    goodVs: [
      { championId: "ksante", score: 3 },
      { championId: "ornn", score: 3 },
    ],
    weakVs: [
      { championId: "olaf", score: 4, note: "ult-ul ignoră stun-ul și ult-ul Camillei" },
      { championId: "gwen", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "vladimir", score: 3 },
      { championId: "shen", score: 1 },
    ],
    mustWith: [],
  },
  "camille:support": {
    goodVs: [],
    weakVs: [
      { championId: "shen", score: 1 },
    ],
    mustWith: [],
  },
  "twisted-fate:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
      { championId: "leblanc", score: 2 },
    ],
    weakVs: [
      { championId: "ahri", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "lissandra", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "zoe", score: 2 },
    ],
    mustWith: [],
  },
  "kindred:jungle": {
    goodVs: [
      { championId: "wukong", score: 3 },
      { championId: "sejuani", score: 2 },
    ],
    weakVs: [
      { championId: "lillia", score: 2 },
      { championId: "nidalee", score: 2 },
      { championId: "poppy", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "vayne:adc": {
    goodVs: [
      { championId: "sivir", score: 3 },
      { championId: "kogmaw", score: 1 },
    ],
    weakVs: [
      { championId: "ezreal", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "samira", score: 2 },
      { championId: "jinx", score: 1 },
    ],
    mustWith: [],
  },
  "vayne:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "viego:jungle": {
    goodVs: [
      { championId: "xin-zhao", score: 3 },
      { championId: "karthus", score: 2 },
    ],
    weakVs: [
      { championId: "zac", score: 3 },
      { championId: "naafiri", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "pantheon", score: 2 },
      { championId: "vi", score: 2 },
    ],
    mustWith: [],
  },
  "renata-glasc:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
      { championId: "seraphine", score: 2 },
    ],
    weakVs: [
      { championId: "blitzcrank", score: 2 },
      { championId: "maokai", score: 2 },
      { championId: "neeko", score: 2 },
      { championId: "thresh", score: 2 },
      { championId: "yuumi", score: 1 },
    ],
    mustWith: [],
  },
  "tristana:adc": {
    goodVs: [
      { championId: "jhin", score: 4, note: "all-in pe un carry imobil" },
      { championId: "samira", score: 2 },
      { championId: "ziggs", score: 2 },
    ],
    weakVs: [
      { championId: "aphelios", score: 3 },
      { championId: "ashe", score: 2 },
      { championId: "lucian", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: [],
  },
  "tristana:mid": {
    goodVs: [
      { championId: "ziggs", score: 2 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "elise:support": {
    goodVs: [
      { championId: "leona", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "poppy", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "renata-glasc", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "karma", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "neeko", score: 2 },
      { championId: "rell", score: 2 },
    ],
    mustWith: [],
  },
  "zed:mid": {
    goodVs: [
      { championId: "cassiopeia", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "talon", score: 2 },
      { championId: "vladimir", score: 2 },
    ],
    weakVs: [
      { championId: "lissandra", score: 4, note: "ult-ul o face imună la all-in-ul lui Zed" },
      { championId: "azir", score: 2 },
      { championId: "syndra", score: 2 },
      { championId: "zoe", score: 2 },
      { championId: "leblanc", score: 1 },
    ],
    mustWith: [],
  },
  "garen:top": {
    goodVs: [
      { championId: "ksante", score: 2 },
    ],
    weakVs: [
      { championId: "jax", score: 3 },
    ],
    mustWith: [],
  },
  "miss-fortune:adc": {
    goodVs: [
      { championId: "corki", score: 2 },
    ],
    weakVs: [
      { championId: "aphelios", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "caitlyn", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "varus", score: 2 },
    ],
    mustWith: [],
  },
  "hwei:mid": {
    goodVs: [
      { championId: "akali", score: 2 },
      { championId: "aurora", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "galio", score: 4, note: "MR și engage pe un mage imobil" },
      { championId: "aurelion-sol", score: 3 },
      { championId: "ahri", score: 2 },
      { championId: "twisted-fate", score: 2 },
      { championId: "yone", score: 2 },
    ],
    mustWith: [],
  },
  "volibear:jungle": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "sejuani", score: 2 },
      { championId: "viego", score: 2 },
    ],
    weakVs: [
      { championId: "kindred", score: 3 },
      { championId: "poppy", score: 3 },
    ],
    mustWith: [],
  },
  "volibear:top": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "gangplank", score: 2 },
    ],
    weakVs: [
      { championId: "gnar", score: 4, note: "kite contra juggernaut-ului" },
      { championId: "camille", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "poppy", score: 3 },
    ],
    mustWith: [],
  },
  "yuumi:support": {
    goodVs: [
      { championId: "lulu", score: 1 },
      { championId: "nami", score: 1 },
      { championId: "tahm-kench", score: 1 },
    ],
    weakVs: [
      { championId: "braum", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "thresh", score: 2 },
      { championId: "milio", score: 1 },
    ],
    mustWith: [],
  },
  "graves:jungle": {
    goodVs: [
      { championId: "jarvan-iv", score: 2 },
      { championId: "sejuani", score: 2 },
      { championId: "wukong", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    weakVs: [
      { championId: "khazix", score: 2 },
      { championId: "lee-sin", score: 2 },
      { championId: "nidalee", score: 2 },
      { championId: "nocturne", score: 2 },
      { championId: "pantheon", score: 2 },
    ],
    mustWith: [],
  },
  "zeri:adc": {
    goodVs: [
      { championId: "jhin", score: 3 },
      { championId: "ziggs", score: 2 },
    ],
    weakVs: [
      { championId: "caitlyn", score: 2 },
      { championId: "nilah", score: 2 },
      { championId: "senna", score: 2 },
      { championId: "seraphine", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: ["lulu", "yuumi"],
  },
  "milio:support": {
    goodVs: [
      { championId: "karma", score: 1 },
    ],
    weakVs: [
      { championId: "blitzcrank", score: 2 },
      { championId: "braum", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "senna", score: 2 },
    ],
    mustWith: [],
  },
  "gragas:top": {
    goodVs: [
      { championId: "chogath", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "sett", score: 2 },
      { championId: "shen", score: 2 },
    ],
    weakVs: [
      { championId: "fiora", score: 4, note: "vitals și duel superior pe tot jocul" },
      { championId: "poppy", score: 4, note: "W oprește body slam-ul lui Gragas" },
      { championId: "camille", score: 2 },
      { championId: "kled", score: 2 },
    ],
    mustWith: [],
  },
  "reksai:top": {
    goodVs: [
      { championId: "ksante", score: 2 },
      { championId: "sion", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "ambessa", score: 2 },
      { championId: "renekton", score: 2 },
    ],
    mustWith: [],
  },
  "draven:adc": {
    goodVs: [
      { championId: "jhin", score: 2 },
      { championId: "jinx", score: 2 },
      { championId: "kaisa", score: 2 },
      { championId: "sivir", score: 2 },
    ],
    weakVs: [
      { championId: "ashe", score: 2 },
      { championId: "miss-fortune", score: 2 },
      { championId: "tristana", score: 2 },
      { championId: "varus", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: [],
  },
  "smolder:adc": {
    goodVs: [
      { championId: "corki", score: 3 },
      { championId: "senna", score: 3 },
      { championId: "xayah", score: 3 },
      { championId: "zeri", score: 3 },
      { championId: "jinx", score: 1 },
    ],
    weakVs: [
      { championId: "ashe", score: 2 },
      { championId: "ezreal", score: 2 },
      { championId: "jhin", score: 2 },
      { championId: "kalista", score: 2 },
      { championId: "varus", score: 2 },
    ],
    mustWith: [],
  },
  "smolder:mid": {
    goodVs: [],
    weakVs: [
      { championId: "leblanc", score: 2 },
      { championId: "zed", score: 2 },
    ],
    mustWith: [],
  },
  "kalista:adc": {
    goodVs: [
      { championId: "kogmaw", score: 2 },
      { championId: "zeri", score: 2 },
    ],
    weakVs: [
      { championId: "aphelios", score: 3 },
      { championId: "senna", score: 3 },
      { championId: "twitch", score: 3 },
      { championId: "draven", score: 2 },
      { championId: "ziggs", score: 2 },
    ],
    mustWith: [],
  },
  "blitzcrank:support": {
    goodVs: [
      { championId: "karma", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "ashe", score: 2 },
      { championId: "leona", score: 2 },
      { championId: "nautilus", score: 2 },
      { championId: "rakan", score: 2 },
    ],
    mustWith: [],
  },
  "diana:jungle": {
    goodVs: [
      { championId: "jarvan-iv", score: 3 },
      { championId: "udyr", score: 3 },
      { championId: "volibear", score: 3 },
      { championId: "nidalee", score: 2 },
      { championId: "sejuani", score: 2 },
    ],
    weakVs: [
      { championId: "trundle", score: 3 },
      { championId: "nocturne", score: 2 },
      { championId: "viego", score: 2 },
      { championId: "wukong", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "veigar:mid": {
    goodVs: [
      { championId: "orianna", score: 3 },
      { championId: "taliyah", score: 3 },
      { championId: "akali", score: 2 },
    ],
    weakVs: [
      { championId: "sylas", score: 4, note: "fură ult-ul lui Veigar" },
      { championId: "ahri", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    mustWith: [],
  },
  "kled:top": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "dr-mundo", score: 2 },
      { championId: "renekton", score: 1 },
    ],
    weakVs: [
      { championId: "sion", score: 3 },
      { championId: "gangplank", score: 2 },
      { championId: "gnar", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "sett:top": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "ornn", score: 2 },
      { championId: "sion", score: 2 },
      { championId: "volibear", score: 2 },
    ],
    weakVs: [
      { championId: "kennen", score: 4, note: "kite la distanță contra juggernaut-ului" },
      { championId: "camille", score: 3 },
      { championId: "jayce", score: 2 },
    ],
    mustWith: [],
  },
  "vex:mid": {
    goodVs: [
      { championId: "akali", score: 4, note: "pasivul pedepsește fiecare dash" },
      { championId: "sylas", score: 2 },
    ],
    weakVs: [
      { championId: "ahri", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    mustWith: [],
  },
  "shen:support": {
    goodVs: [
      { championId: "leona", score: 2 },
    ],
    weakVs: [
      { championId: "braum", score: 2 },
      { championId: "nautilus", score: 2 },
    ],
    mustWith: [],
  },
  "shen:top": {
    goodVs: [
      { championId: "gnar", score: 3 },
      { championId: "kennen", score: 1 },
      { championId: "ksante", score: 1 },
    ],
    weakVs: [
      { championId: "jax", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "kled", score: 2 },
      { championId: "renekton", score: 2 },
    ],
    mustWith: [],
  },
  "darius:top": {
    goodVs: [
      { championId: "camille", score: 2 },
      { championId: "gragas", score: 2 },
      { championId: "ksante", score: 2 },
      { championId: "sion", score: 2 },
      { championId: "gnar", score: 1 },
    ],
    weakVs: [
      { championId: "kennen", score: 4, note: "kite la distanță, Darius nu-l poate prinde" },
      { championId: "jax", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "renekton", score: 1 },
    ],
    mustWith: [],
  },
  "kayle:top": {
    goodVs: [
      { championId: "gangplank", score: 3 },
      { championId: "ornn", score: 3 },
    ],
    weakVs: [
      { championId: "gnar", score: 2 },
      { championId: "gwen", score: 2 },
    ],
    mustWith: [],
  },
  "khazix:jungle": {
    goodVs: [
      { championId: "jarvan-iv", score: 2 },
    ],
    weakVs: [
      { championId: "maokai", score: 4, note: "tank cu CC point-click, nu poate fi izolat" },
      { championId: "poppy", score: 4, note: "W oprește leap-ul" },
      { championId: "zac", score: 3 },
      { championId: "evelynn", score: 2 },
      { championId: "ivern", score: 1 },
    ],
    mustWith: [],
  },
  "mordekaiser:top": {
    goodVs: [
      { championId: "shen", score: 3 },
      { championId: "yorick", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "gangplank", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "ornn", score: 1 },
      { championId: "sett", score: 1 },
    ],
    mustWith: [],
  },
  "zilean:support": {
    goodVs: [
      { championId: "leona", score: 4, note: "ult-ul anulează all-in-ul" },
      { championId: "thresh", score: 2 },
    ],
    weakVs: [
      { championId: "alistar", score: 2 },
      { championId: "renata-glasc", score: 2 },
      { championId: "yuumi", score: 1 },
    ],
    mustWith: [],
  },
  "zilean:mid": {
    goodVs: [
      { championId: "leblanc", score: 2 },
      { championId: "malzahar", score: 2 },
      { championId: "ahri", score: 1 },
    ],
    weakVs: [
      { championId: "orianna", score: 2 },
      { championId: "ryze", score: 2 },
    ],
    mustWith: [],
  },
  "morgana:support": {
    goodVs: [
      { championId: "galio", score: 4, vsRole: "mid", note: "black shield anulează CC-ul lui Galio pe aliat" },
      { championId: "vi", score: 4, vsRole: "jungle", note: "black shield anulează CC-ul ult-ului lui Vi pe aliat" },
      { championId: "nami", score: 2 },
      { championId: "soraka", score: 2 },
    ],
    weakVs: [
      { championId: "bard", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "pyke", score: 2 },
      { championId: "shen", score: 2 },
      { championId: "tahm-kench", score: 2 },
    ],
    mustWith: [],
  },
  "fiora:top": {
    goodVs: [
      { championId: "aatrox", score: 4, note: "parry pe Q3 și vitals" },
      { championId: "malphite", score: 4, note: "vitals ignoră armura" },
      { championId: "ornn", score: 4, note: "vitals contra tank-ului" },
      { championId: "jax", score: 3 },
    ],
    weakVs: [
      { championId: "mordekaiser", score: 4, note: "ult-ul o izolează fără ajutorul echipei" },
      { championId: "gwen", score: 3 },
      { championId: "gnar", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "camille", score: 1 },
    ],
    mustWith: [],
  },
  "kassadin:mid": {
    goodVs: [
      { championId: "galio", score: 3 },
      { championId: "orianna", score: 3 },
      { championId: "syndra", score: 3 },
    ],
    weakVs: [
      { championId: "cassiopeia", score: 5, note: "W-ul îl ține pe loc și anulează ult-ul" },
      { championId: "lissandra", score: 4, note: "CC point-click și burst înainte de nivelul 6" },
      { championId: "ryze", score: 2 },
      { championId: "vladimir", score: 2 },
      { championId: "zoe", score: 2 },
    ],
    mustWith: [],
  },
  "riven:top": {
    goodVs: [
      { championId: "gnar", score: 2 },
      { championId: "ornn", score: 2 },
      { championId: "vladimir", score: 2 },
    ],
    weakVs: [
      { championId: "camille", score: 3 },
      { championId: "gwen", score: 3 },
      { championId: "aatrox", score: 2 },
    ],
    mustWith: [],
  },
  "singed:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "soraka:support": {
    goodVs: [
      { championId: "leona", score: 2 },
      { championId: "shen", score: 2 },
      { championId: "bard", score: 1 },
      { championId: "janna", score: 1 },
    ],
    weakVs: [
      { championId: "karma", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "renata-glasc", score: 2 },
      { championId: "lulu", score: 1 },
    ],
    mustWith: [],
  },
  "swain:mid": {
    goodVs: [
      { championId: "galio", score: 3 },
      { championId: "sylas", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "akali", score: 2 },
      { championId: "azir", score: 2 },
      { championId: "cassiopeia", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "syndra", score: 2 },
    ],
    mustWith: [],
  },
  "swain:top": {
    goodVs: [
      { championId: "galio", score: 3 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "warwick:top": {
    goodVs: [],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește ult-ul lui Warwick" },
      { championId: "gnar", score: 2 },
    ],
    mustWith: [],
  },
  "warwick:jungle": {
    goodVs: [
      { championId: "karthus", score: 2 },
    ],
    weakVs: [
      { championId: "poppy", score: 4, note: "W oprește ult-ul lui Warwick" },
    ],
    mustWith: [],
  },
  "zyra:support": {
    goodVs: [],
    weakVs: [
      { championId: "blitzcrank", score: 2 },
      { championId: "nautilus", score: 2 },
    ],
    mustWith: [],
  },
  "zyra:jungle": {
    goodVs: [
      { championId: "wukong", score: 2 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "senna:support": {
    goodVs: [
      { championId: "nautilus", score: 2 },
    ],
    weakVs: [
      { championId: "bard", score: 2 },
      { championId: "blitzcrank", score: 2 },
      { championId: "nami", score: 2 },
    ],
    mustWith: [],
  },
  "senna:adc": {
    goodVs: [
      { championId: "jhin", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    weakVs: [
      { championId: "kaisa", score: 4, note: "dive pe un carry imobil" },
      { championId: "caitlyn", score: 2 },
    ],
    mustWith: [],
  },
  "lillia:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "skarner:jungle": {
    goodVs: [
      { championId: "zac", score: 2 },
      { championId: "maokai", score: 1 },
    ],
    weakVs: [
      { championId: "dr-mundo", score: 3 },
      { championId: "viego", score: 3 },
      { championId: "lee-sin", score: 2 },
      { championId: "lillia", score: 2 },
      { championId: "naafiri", score: 2 },
    ],
    mustWith: [],
  },
  "ziggs:adc": {
    goodVs: [
      { championId: "syndra", score: 2 },
    ],
    weakVs: [
      { championId: "kaisa", score: 4, note: "dive pe un mage imobil" },
      { championId: "jhin", score: 2 },
      { championId: "jinx", score: 2 },
      { championId: "tahm-kench", score: 2 },
      { championId: "xayah", score: 2 },
    ],
    mustWith: [],
  },
  "ziggs:mid": {
    goodVs: [
      { championId: "orianna", score: 2 },
      { championId: "syndra", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "illaoi:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "lissandra:mid": {
    goodVs: [
      { championId: "viktor", score: 2 },
    ],
    weakVs: [
      { championId: "swain", score: 3 },
      { championId: "vladimir", score: 3 },
      { championId: "orianna", score: 2 },
      { championId: "sylas", score: 2 },
      { championId: "irelia", score: 1 },
    ],
    mustWith: [],
  },
  "tryndamere:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "xerath:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "samira:adc": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "gangplank:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "vladimir:mid": {
    goodVs: [
      { championId: "azir", score: 3 },
      { championId: "viktor", score: 3 },
      { championId: "yasuo", score: 2 },
    ],
    weakVs: [
      { championId: "ahri", score: 2 },
      { championId: "anivia", score: 2 },
      { championId: "syndra", score: 2 },
      { championId: "zoe", score: 2 },
    ],
    mustWith: [],
  },
  "vladimir:top": {
    goodVs: [
      { championId: "poppy", score: 3 },
      { championId: "yasuo", score: 2 },
    ],
    weakVs: [
      { championId: "aatrox", score: 2 },
      { championId: "renekton", score: 2 },
      { championId: "urgot", score: 2 },
    ],
    mustWith: [],
  },
  "fiddlesticks:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "amumu:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "brand:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "chogath:top": {
    goodVs: [
      { championId: "jayce", score: 3 },
      { championId: "renekton", score: 3 },
      { championId: "jax", score: 2 },
    ],
    weakVs: [
      { championId: "dr-mundo", score: 3 },
      { championId: "yorick", score: 3 },
      { championId: "aatrox", score: 2 },
      { championId: "kennen", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "chogath:jungle": {
    goodVs: [],
    weakVs: [
      { championId: "dr-mundo", score: 3 },
      { championId: "aatrox", score: 2 },
    ],
    mustWith: [],
  },
  "chogath:mid": {
    goodVs: [
      { championId: "katarina", score: 4, note: "silence-ul și knock-up-ul întrerup ult-ul Katarinei" },
    ],
    weakVs: [
      { championId: "xerath", score: 2 },
    ],
    mustWith: [],
  },
  "evelynn:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "fizz:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "hecarim:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "heimerdinger:support": {
    goodVs: [
      { championId: "karma", score: 2 },
      { championId: "nautilus", score: 2 },
    ],
    weakVs: [
      { championId: "leona", score: 4, note: "engage pe un support imobil" },
      { championId: "rakan", score: 4, note: "engage pe un support imobil" },
      { championId: "ashe", score: 2 },
      { championId: "lux", score: 2 },
      { championId: "nami", score: 2 },
    ],
    mustWith: [],
  },
  "janna:support": {
    goodVs: [
      { championId: "karma", score: 1 },
      { championId: "lulu", score: 1 },
      { championId: "nami", score: 1 },
    ],
    weakVs: [
      { championId: "braum", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "rell", score: 2 },
      { championId: "taric", score: 2 },
      { championId: "thresh", score: 2 },
    ],
    mustWith: [],
  },
  "karthus:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "katarina:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "malzahar:mid": {
    goodVs: [
      { championId: "galio", score: 2 },
      { championId: "ryze", score: 2 },
      { championId: "vladimir", score: 2 },
      { championId: "zoe", score: 2 },
    ],
    weakVs: [
      { championId: "veigar", score: 3 },
      { championId: "azir", score: 2 },
      { championId: "taliyah", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    mustWith: [],
  },
  "master-yi:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "nasus:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "quinn:top": {
    goodVs: [
      { championId: "gnar", score: 2 },
      { championId: "renekton", score: 2 },
    ],
    weakVs: [
      { championId: "gangplank", score: 3 },
    ],
    mustWith: [],
  },
  "rammus:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "shaco:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "shyvana:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "sona:support": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "talon:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "talon:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "taric:support": {
    goodVs: [
      { championId: "karma", score: 2 },
      { championId: "lulu", score: 2 },
      { championId: "tahm-kench", score: 2 },
    ],
    weakVs: [
      { championId: "senna", score: 3 },
      { championId: "leona", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "thresh", score: 2 },
      { championId: "yuumi", score: 1 },
    ],
    mustWith: [],
  },
  "teemo:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "twitch:adc": {
    goodVs: [
      { championId: "lucian", score: 3 },
      { championId: "xayah", score: 2 },
      { championId: "jinx", score: 1 },
      { championId: "kogmaw", score: 1 },
    ],
    weakVs: [
      { championId: "aphelios", score: 2 },
      { championId: "jhin", score: 2 },
      { championId: "varus", score: 2 },
      { championId: "zeri", score: 1 },
    ],
    mustWith: [],
  },
  "udyr:top": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "jax", score: 1 },
      { championId: "volibear", score: 1 },
    ],
    weakVs: [
      { championId: "gnar", score: 4, note: "kite contra lui Udyr fără gap-closer" },
      { championId: "darius", score: 2 },
      { championId: "ksante", score: 2 },
      { championId: "rumble", score: 2 },
    ],
    mustWith: [],
  },
  "udyr:jungle": {
    goodVs: [
      { championId: "aatrox", score: 2 },
      { championId: "graves", score: 2 },
      { championId: "pantheon", score: 2 },
      { championId: "volibear", score: 1 },
    ],
    weakVs: [
      { championId: "jarvan-iv", score: 2 },
      { championId: "wukong", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "urgot:top": {
    goodVs: [
      { championId: "gangplank", score: 4, note: "presiune constantă și shotgun knees pe GP fără mobilitate" },
      { championId: "ksante", score: 3 },
      { championId: "ornn", score: 3 },
      { championId: "sion", score: 3 },
      { championId: "aatrox", score: 2 },
    ],
    weakVs: [
      { championId: "gnar", score: 4, note: "kite constant contra lui Urgot lent" },
      { championId: "camille", score: 3 },
      { championId: "jax", score: 3 },
      { championId: "kennen", score: 2 },
      { championId: "renekton", score: 2 },
    ],
    mustWith: [],
  },
  "zac:top": {
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "reksai", score: 1 },
      { championId: "rumble", score: 1 },
    ],
    weakVs: [
      { championId: "poppy", score: 5, note: "W oprește complet E-ul lui Zac" },
      { championId: "ksante", score: 2 },
      { championId: "ornn", score: 2 },
    ],
    mustWith: [],
  },
  "zac:jungle": {
    goodVs: [
      { championId: "aatrox", score: 3 },
      { championId: "xin-zhao", score: 3 },
    ],
    weakVs: [
      { championId: "poppy", score: 5, note: "W oprește complet E-ul lui Zac" },
      { championId: "maokai", score: 3 },
      { championId: "nocturne", score: 2 },
    ],
    mustWith: [],
  },
  "velkoz:mid": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "ekko:mid": {
    goodVs: [],
    weakVs: [
      { championId: "lissandra", score: 4, note: "CC point-click pe un asasin" },
      { championId: "vex", score: 4, note: "pasivul pedepsește dash-urile" },
    ],
    mustWith: [],
  },
  "ekko:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "tahm-kench:support": {
    goodVs: [
      { championId: "lulu", score: 2 },
      { championId: "shen", score: 2 },
      { championId: "thresh", score: 2 },
      { championId: "zilean", score: 2 },
    ],
    weakVs: [
      { championId: "blitzcrank", score: 2 },
      { championId: "janna", score: 2 },
      { championId: "leona", score: 2 },
      { championId: "nami", score: 2 },
      { championId: "rakan", score: 2 },
      { championId: "rell", score: 2 },
      { championId: "soraka", score: 1 },
    ],
    mustWith: [],
  },
  "ivern:jungle": {
    goodVs: [
      { championId: "jarvan-iv", score: 1 },
      { championId: "nidalee", score: 1 },
      { championId: "sejuani", score: 1 },
      { championId: "skarner", score: 1 },
      { championId: "xin-zhao", score: 1 },
    ],
    weakVs: [
      { championId: "pantheon", score: 4, note: "invade-uri timpurii pe un clear fragil" },
      { championId: "trundle", score: 4, note: "invade și pilon pe un jungler fără duel" },
      { championId: "lillia", score: 2 },
      { championId: "viego", score: 2 },
    ],
    mustWith: [],
  },
  "kayn:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "akshan:mid": {
    goodVs: [
      { championId: "velkoz", score: 2 },
      { championId: "xerath", score: 2 },
    ],
    weakVs: [],
    mustWith: [],
  },
  "akshan:top": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "belveth:jungle": {
    goodVs: [
      { championId: "lee-sin", score: 3 },
      { championId: "trundle", score: 3 },
      { championId: "vi", score: 3 },
      { championId: "viego", score: 3 },
    ],
    weakVs: [
      { championId: "maokai", score: 4, note: "CC point-click și tank pe care nu-l poate topi" },
      { championId: "sejuani", score: 4, note: "CC în lanț contra lui Bel'Veth" },
      { championId: "wukong", score: 2 },
      { championId: "xin-zhao", score: 2 },
    ],
    mustWith: [],
  },
  "nilah:adc": {
    goodVs: [
      { championId: "aphelios", score: 2 },
      { championId: "kaisa", score: 2 },
    ],
    weakVs: [
      { championId: "lucian", score: 2 },
      { championId: "sivir", score: 2 },
    ],
    mustWith: [],
  },
  "briar:jungle": {
    goodVs: [],
    weakVs: [],
    mustWith: [],
  },
  "locke:mid": {
    goodVs: [
      { championId: "aurora", score: 2 },
      { championId: "hwei", score: 2 },
      { championId: "orianna", score: 2 },
      { championId: "syndra", score: 2 },
    ],
    weakVs: [
      { championId: "lissandra", score: 4, note: "CC point-click pe un asasin" },
      { championId: "ahri", score: 2 },
      { championId: "leblanc", score: 2 },
      { championId: "viktor", score: 2 },
    ],
    mustWith: [],
  },
};
