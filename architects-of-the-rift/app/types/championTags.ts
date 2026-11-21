// COMP_ATTRIBUTES_EXPANSION §5 — vocabularul fix al tag-urilor de campion (`roleData[rol].profile.tags`,
// `championTags` și tag-urile derivate în championProfileSystem.ts). Validatorul dă eroare pentru orice alt tag.
// Lista = tag-urile citite în cod + cele derivate (+ cele 4 care se mapează pe date, până vin datele).

export const CHAMPION_TAGS = [
  // ─── Derivate (championProfileSystem.ts, `toTags`) și citite în cod ───
  "melee", "ranged", "frontline", "engage", "dive", "pick", "poke", "dps", "burst", "peel", "anti-dive",
  "waveclear", "self-sufficient", "warden", "enchanter", "follow-up", "zone-control",
  // Derivat, citit doar prin identitatea echipelor (`preferredTags`, teamIdentitySystem.ts).
  "objectiveControl",
  // ─── Scrise doar manual, citite în cod ───
  "tank", "utility", "setup", "carry", "assassin", "teamfight", "front-to-back", "scaling", "early-game",
  "lane-bully", "primary-carry",
  // ─── Citite prin identitatea echipelor (`preferredTags` / `avoidTags`, teamIdentitySystem.ts) ───
  "skirmish", "snowball",
] as const;

export type ChampionTag = (typeof CHAMPION_TAGS)[number];

export const isChampionTag = (value: unknown): value is ChampionTag => CHAMPION_TAGS.includes(value as ChampionTag);
