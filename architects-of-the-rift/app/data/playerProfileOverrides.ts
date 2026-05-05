import type { PlayerAdaptationProfile, PlayerArchetypeAffinity, PlayerPhaseProfile, PlayerStyleLabel } from "@/app/types/player";

// ─── PATCH: 3 câmpuri noi față de versiunea anterioară ───────────────────────
// primaryStyle         → override intern al labelului primary (PlayerStyleLabel)
//                        afectează logica de secondary și scores
// primaryDisplayOverride → override DOAR vizual pe card/tooltip (string liber)
//                          folosit când labelul calculat e corect intern dar
//                          vrei un display diferit (ex. "Hypercarry" în loc de "Carry")
// tagOverrides         → control manual asupra tagurilor după auto-derivare
//                          add:    injectezi taguri specifice jucătorului
//                          remove: elimini taguri corect calculate dar înșelătoare
type PlayerProfileOverride = {
  phaseProfile?: PlayerPhaseProfile;
  archetypeAffinity?: Partial<PlayerArchetypeAffinity>;
  adaptationProfile?: Partial<PlayerAdaptationProfile>;
  secondaryStyle?: PlayerStyleLabel;
  primaryStyle?: PlayerStyleLabel;
  primaryDisplayOverride?: string;
  tagOverrides?: {
    add?: string[];
    remove?: string[];
  };
};

export const playerProfileOverrides: Record<string, PlayerProfileOverride> = {
  // ══════════════════════════════════════════════════════════════════
  // LCK — BFX
  // ══════════════════════════════════════════════════════════════════
  "clear": {
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Scaling", "Stable", "Systematic"] },
  },
  "raptor": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Pathing"] },
  },
  "vicla": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Dive"] },
  },
  "diable": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Teamfight"] },
  },
  "kellin": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — DNS
  // ══════════════════════════════════════════════════════════════════
  "dudu": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "pyosik": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Snowball", "Roaming"] },
  },
  "clozer": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Roaming"] },
  },
  "deokdam": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "peter": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Roaming", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — DRX
  // ══════════════════════════════════════════════════════════════════
  "rich": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Flexible"] },
  },
  "willer": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Systematic", "Pathing"] },
  },
  "ucal": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible", "Scaling", "Roaming"] },
  },
  "jiwoo": {
    primaryStyle: "hypercarry",
    primaryDisplayOverride: "Hypercarry",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Scaling", "Late Game", "Teamfight"] },
  },
  "andil": {
    primaryStyle: "roamer",
    primaryDisplayOverride: "Roamer",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Roaming", "Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — DPlus KIA
  // ══════════════════════════════════════════════════════════════════
  "siwoo": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "lucid": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Dive", "Tempo"] },
  },
  "showmaker": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Flexible", "Late Game"] },
  },
  "smash": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Stable"] },
  },
  "career": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Systematic", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — Gen.G  ★ SUPERSTARS
  // ══════════════════════════════════════════════════════════════════
  "kiin": {
    // Kiin is a brawler duelist — 7 solo kills at First Stand, consistently aggressive
    primaryStyle: "brawler",
    primaryDisplayOverride: "Brawler",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Dive", "Snowball", "Lane Dominant"] },
  },
  "canyon": {
    // Canyon: intelligent, systematic, objective-focused jungler — not a chaos player
    phaseProfile: {
      early: { laneControl: 6.2, skirmish: 9.5, stability: 8.2, mapPlay: 9.4, teamfight: 8.1, clutch: 8.3 },
      mid: { laneControl: 6.0, skirmish: 9.3, stability: 8.5, mapPlay: 9.5, teamfight: 8.5, clutch: 8.5 },
      late: { laneControl: 5.8, skirmish: 8.4, stability: 8.7, mapPlay: 9.1, teamfight: 8.8, clutch: 8.4 },
    },
    archetypeAffinity: { engage: 9.0, carry: 8.8, tank: 8.5, dive: 9.3, setup: 9.1 },
    adaptationProfile: { draftFlex: 8.8, creativity: 8.3, composure: 8.8, matchupLearning: 9.1 },
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Systematic", "Pathing", "Stable"] },
  },
  "chovy": {
    // Chovy: best laner in the world, dominant carry, late-game monster
    phaseProfile: {
      early: { laneControl: 9.5, skirmish: 8.1, stability: 9.4, mapPlay: 8.3, teamfight: 8.5, clutch: 8.4 },
      mid: { laneControl: 9.4, skirmish: 8.5, stability: 9.2, mapPlay: 8.6, teamfight: 8.9, clutch: 8.6 },
      late: { laneControl: 9.1, skirmish: 8.6, stability: 9.3, mapPlay: 8.8, teamfight: 9.3, clutch: 8.9 },
    },
    archetypeAffinity: { carry: 9.8, poke: 9.2, frontToBack: 9.0, setup: 8.4 },
    adaptationProfile: { draftFlex: 8.8, creativity: 8.2, composure: 9.1, matchupLearning: 9.0 },
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Lane Dominant", "Systematic", "Late Game", "Scaling"] },
  },
  "ruler": {
    // Ruler: premier scaling ADC, consistent and methodical
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Late Game", "Systematic", "Stable", "Teamfight"] },
  },
  "duro": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Flexible", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — Brion (bottom tier)
  // ══════════════════════════════════════════════════════════════════
  "casting": {
    primaryStyle: "weakside",
    primaryDisplayOverride: "Weakside",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "gideon": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "roamer": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "teddy": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight", "Scaling"] },
  },
  "namgung": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Flexible", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — HLE
  // ══════════════════════════════════════════════════════════════════
  "zeus": {
    // Zeus: aggressive carry top who can also teamfight well
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Snowball", "Teamfight", "Early Game"] },
  },
  "kanavi": {
    // Kanavi: early-aggression jungler, dive-heavy, known for invades
    archetypeAffinity: { engage: 9.2, dive: 9.4, carry: 8.7, setup: 8.6 },
    adaptationProfile: { draftFlex: 8.7, creativity: 8.5, composure: 8.3, matchupLearning: 9.1 },
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Invader", "Tempo"] },
  },
  "zeka": {
    // Zeka: #1 POTM in LCK Spring. High-lane-control carry mid
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Early Game", "Snowball", "Teamfight"] },
  },
  "gumayusi": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight", "Scaling"] },
  },
  "delight": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Roaming", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — KT Rolster  ★ SUPERSTAR: Bdd
  // ══════════════════════════════════════════════════════════════════
  "perfect": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "cuzz": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Systematic", "Pathing"] },
  },
  "bdd": {
    // Bdd: 9RP mid, extremely systematic and stable. Controller identity with carry threat.
    // POTM top3 in LCK Spring. Best player on 7-0 KT.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Systematic", "Late Game", "Stable", "Flexible"] },
  },
  "aiming": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Stable", "Teamfight"] },
  },
  "effort": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Flexible", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — Nongshim RedForce
  // ══════════════════════════════════════════════════════════════════
  "kingen": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "sponge": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Invader", "Tempo"] },
  },
  "scout": {
    // Scout: 8RP mid, strong carry and playmaking mid laner
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Teamfight", "Flexible"] },
  },
  "taeyoon": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "lehends": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "High Risk"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCK — T1  ★ SUPERSTARS: Faker, Keria
  // ══════════════════════════════════════════════════════════════════
  "doran": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "brawler",
    tagOverrides: { add: ["Teamfight", "Stable", "Lane Dominant"] },
  },
  "oner": {
    phaseProfile: {
      early: { laneControl: 5.8, skirmish: 9.0, stability: 8.0, mapPlay: 8.7, teamfight: 8.2, clutch: 8.1 },
      mid: { laneControl: 5.8, skirmish: 8.9, stability: 8.2, mapPlay: 8.9, teamfight: 8.6, clutch: 8.5 },
      late: { laneControl: 5.5, skirmish: 8.1, stability: 8.4, mapPlay: 8.8, teamfight: 8.9, clutch: 8.8 },
    },
    archetypeAffinity: { engage: 9.1, dive: 9.0, setup: 8.8, tank: 8.0 },
    adaptationProfile: { draftFlex: 8.5, creativity: 8.2, composure: 8.7, matchupLearning: 8.6 },
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Invader", "Dive"] },
  },
  "faker": {
    // Faker in 2026: cerebral macro god. Not a laner anymore — plays for
    // team structure, IQ wins, and knowledge edge. Controller identity.
    phaseProfile: {
      early: { laneControl: 7.8, skirmish: 7.9, stability: 9.1, mapPlay: 8.8, teamfight: 8.4, clutch: 9.2 },
      mid: { laneControl: 8.0, skirmish: 8.3, stability: 9.0, mapPlay: 9.4, teamfight: 8.9, clutch: 9.4 },
      late: { laneControl: 8.2, skirmish: 8.4, stability: 9.3, mapPlay: 9.3, teamfight: 9.5, clutch: 9.7 },
    },
    archetypeAffinity: { setup: 9.7, utility: 9.4, carry: 8.9, poke: 8.7, frontToBack: 9.2 },
    adaptationProfile: { draftFlex: 9.5, creativity: 9.0, composure: 9.8, matchupLearning: 9.7 },
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Systematic", "Late Game", "Flexible", "Vision"] },
  },
  "peyz": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Early Game", "Snowball", "Teamfight"] },
  },
  "keria": {
    // Keria: most creative support in the world. Unorthodox picks, high-variance
    // plays, roaming impact. NOT a passive utility support.
    phaseProfile: {
      early: { laneControl: 9.2, skirmish: 8.8, stability: 8.4, mapPlay: 9.0, teamfight: 8.5, clutch: 8.2 },
      mid: { laneControl: 8.7, skirmish: 8.6, stability: 8.4, mapPlay: 9.5, teamfight: 8.9, clutch: 8.6 },
      late: { laneControl: 8.2, skirmish: 8.2, stability: 8.8, mapPlay: 9.2, teamfight: 9.1, clutch: 8.9 },
    },
    archetypeAffinity: { enchanter: 9.5, engage: 9.3, utility: 9.8, setup: 9.6, poke: 8.8 },
    adaptationProfile: { draftFlex: 9.8, creativity: 9.7, composure: 8.9, matchupLearning: 9.4 },
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Creative", "High Risk", "Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // Free Agents
  // ══════════════════════════════════════════════════════════════════
  "theshy": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "High Risk", "Volatile"] },
  },
  "baus": {
    primaryStyle: "aggressive",
    primaryDisplayOverride: "Aggressive",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Volatile", "Selfless", "Coinflip"] }
  },
  "peanut": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Snowball", "Roaming"] },
  },
  "clid": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Stable"] },
  },
  "doinb": {
    primaryStyle: "flex",
    primaryDisplayOverride: "Flex",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Creative", "Flexible", "Roaming"] },
  },
  "rookie": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: {
      add: ["Scaling", "Control", "Teamfight"]
    },
  },
  "perkz": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: {
      add: ["Flexible", "Clutch", "High Variance"]
    },
  },
  "crownie": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "scaler",
    tagOverrides: {
      add: ["Scaling", "Teamfight", "Stable"]
    },
  },
  "deft": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "beryl": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Flexible"] },
  },
  "rekkles": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    tagOverrides: {
      add: ["Stable", "Vision", "Teamfight"]
    },
  },
  "ghost": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Stable", "Systematic"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Fnatic (weak Spring 2026, 1-3)
  // ══════════════════════════════════════════════════════════════════
  "empyros": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "razork": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Dive"] },
  },
  "vladi": {
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Scaling", "Lane Dominant", "Flexible"] },
  },
  "upset": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "lospa": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Roaming", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — G2 Esports  ★ LEC BEST PER ROLE: BB, SkewMond, Caps, Hans, Labrov
  // ══════════════════════════════════════════════════════════════════
  "brokenblade": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "brawler",
    tagOverrides: { add: ["Early Game", "Snowball", "Teamfight", "High Risk"] },
  },
  "skewmond": {
    // SkewMond: dominant playmaker, swept two LCK teams at First Stand.
    // Smart pathing, tempo-based, early objective focus.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Tempo", "Early Game", "Pathing", "Objective"] },
  },
  "caps": {
    // Caps: high-variance aggressive mid. Known for solo kills, risky plays,
    // occasional feeding but enormous ceiling. NOT systematic.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Creative", "High Risk", "Snowball", "Volatile"] },
  },
  "hans-sama": {
    // Hans Sama at First Stand: NOT weakside. High vision score (1.58 VSPM),
    // aggressive early, carry-focused. Second ADC by GPM.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Vision", "Early Game", "Teamfight"] },
  },
  "labrov": {
    // Labrov: protect-the-carry style. Peel-heavy, systematic, stable.
    // Best LEC support by First Stand performance.
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Peel", "Vision", "Systematic", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — GIANTX (4-2 Spring)
  // ══════════════════════════════════════════════════════════════════
  "lot": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "isma": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Tempo"] },
  },
  "jackies": {
    // Jackies: best GX player, 4x Player of Series. Lane control mid.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Scaling"] },
  },
  "noah": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "jun": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Roaming", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Karmine Corp  ★ Best team: G2/KC can contest GenG/BLG
  // ══════════════════════════════════════════════════════════════════
  "canna": {
    // Canna: 3-0 at First Stand for KC. Stable teamfight top, carry threat.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "brawler",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Stable", "Snowball"] },
  },
  "yike": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Snowball", "Dive"] },
  },
  "kyeahoo": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Flexible", "Roaming"] },
  },
  "caliste": {
    // Caliste: best LEC ADC. Aggressive, NOT weakside. Very strong laner.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Early Game", "Snowball", "Teamfight"] },
  },
  "busio": {
    // Busio: best LEC support alongside Labrov. Systematic, high vision.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Systematic", "Teamfight", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Movistar KOI (3-2 Spring)
  // ══════════════════════════════════════════════════════════════════
  "myrwn": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Lane Dominant"] },
  },
  "elyoya": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Dive", "Snowball"] },
  },
  "jojopyun": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Roaming"] },
  },
  "supa": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight", "Scaling"] },
  },
  "alvaro": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Flexible", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Natus Vincere (4-1 Spring)
  // ══════════════════════════════════════════════════════════════════
  "maynter": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Teamfight", "Lane Dominant"] },
  },
  "rhilech": {
    // Rhilech: 4x Player of Series at NAVI. Very impactful early jungler.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Invader", "Dive"] },
  },
  "poby": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "samd": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Stable", "Teamfight", "Scaling"] },
  },
  "parus": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Stable", "Systematic"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Shifters (0-4 Spring)
  // ══════════════════════════════════════════════════════════════════
  "rooster": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "boukada": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "nuc": {
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Scaling", "Lane Dominant"] },
  },
  "paduck": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "trymbi": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — SK Gaming (2-6 Spring)
  // ══════════════════════════════════════════════════════════════════
  "wunder": {
    primaryStyle: "flex",
    primaryDisplayOverride: "Flex",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Flexible"] },
  },
  "skeanz": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Pathing", "Objective"] },
  },
  "lider": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "jopa": {
    // Jopa: 2x POTM at SK despite poor team record. Solid ADC.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Stable", "Teamfight", "Snowball"] },
  },
  "mikyx": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Flexible", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Team Heretics (1-6 Spring)
  // ══════════════════════════════════════════════════════════════════
  "tracyn": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "sheo": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "serin": {
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "ice": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Scaling", "Teamfight"] },
  },
  "way": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LEC — Team Vitality  ★ Best LEC: 6-1 Spring
  // ══════════════════════════════════════════════════════════════════
  "naak-nako": {
    // Naak-Nako: aggressive carry top on best LEC team. Strong laning.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "brawler",
    tagOverrides: { add: ["Early Game", "Dive", "Snowball", "Lane Dominant"] },
  },
  "lyncas": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Dive", "Tempo"] },
  },
  "humanoid": {
    // Humanoid: best VIT player, scaling mid laner. NOT a poke player.
    // Strong late game, systematic, Carzzy synergy.
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Scaling", "Late Game", "Systematic", "Teamfight"] },
  },
  "carzzy": {
    // Carzzy: 2x POTM at VIT. Aggressive but consistent carry ADC.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Teamfight", "Stable", "Snowball"] },
  },
  "fleshy": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Flexible", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Anyone's Legend (Tarzan's team)
  // ══════════════════════════════════════════════════════════════════
  "flandre": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "tarzan": {
    // Tarzan: 9RP jungler. High IQ, objective-focused, systematic play.
    // Rotation timing 94, Objective control 92 from player profile.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Pathing", "Systematic", "Tempo"] },
  },
  "shanks": {
    // Shanks: strong carry mid on AL. Best LPL non-superstar mid.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Teamfight", "Late Game"] },
  },
  "hope": {
    // Hope at First Stand: aggressive ADC, high damage, NOT weakside.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Snowball"] },
  },
  "kael": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Teamfight"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — BLG  ★ SUPERSTARS: Bin, Knight, Viper + strong: ON, XUN
  // ══════════════════════════════════════════════════════════════════
  "bin": {
    // Bin: THE brawler. Most aggressive top in the world. 80% WR at First Stand,
    // 4 solo kills, dominates every laning phase physically.
    phaseProfile: {
      early: { laneControl: 9.3, skirmish: 9.0, stability: 7.6, mapPlay: 7.5, teamfight: 8.4, clutch: 8.0 },
      mid: { laneControl: 9.0, skirmish: 9.1, stability: 7.6, mapPlay: 7.8, teamfight: 8.7, clutch: 8.2 },
      late: { laneControl: 8.6, skirmish: 8.6, stability: 7.8, mapPlay: 7.9, teamfight: 8.9, clutch: 8.4 },
    },
    archetypeAffinity: { carry: 9.6, dive: 9.1, engage: 8.0, poke: 7.5 },
    adaptationProfile: { draftFlex: 8.4, creativity: 8.8, composure: 7.8, matchupLearning: 8.7 },
    primaryStyle: "brawler",
    primaryDisplayOverride: "Brawler",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Dive", "Snowball", "Lane Dominant"] },
  },
  "xun": {
    // XUN: best early-game jungler at First Stand. 46.7% FB%. Invade specialist.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Invader", "Snowball", "Tempo"] },
  },
  "knight": {
    // Knight: best mid in LPL. Dominant laner (8 solo kills at FS), carry threat.
    // 80% WR, 5.3 KDA. NOT a poke player — mechanical carry with roaming.
    phaseProfile: {
      early: { laneControl: 9.4, skirmish: 8.6, stability: 9.2, mapPlay: 8.8, teamfight: 8.7, clutch: 8.8 },
      mid: { laneControl: 9.3, skirmish: 8.8, stability: 9.1, mapPlay: 9.0, teamfight: 9.0, clutch: 9.0 },
      late: { laneControl: 9.1, skirmish: 8.7, stability: 9.3, mapPlay: 9.1, teamfight: 9.4, clutch: 9.2 },
    },
    archetypeAffinity: { carry: 9.8, poke: 9.2, frontToBack: 8.8, setup: 8.4 },
    adaptationProfile: { draftFlex: 9.1, creativity: 8.7, composure: 9.0, matchupLearning: 9.2 },
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Early Game", "Snowball", "Creative"] },
  },
  "viper": {
    // Viper: 9RP ADC. Best ADC at First Stand — highest damage%, highest GPM.
    // Aggressive, NOT weakside. Very dominant in lane.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Snowball", "Teamfight", "Scaling"] },
  },
  "on": {
    // ON: 9RP support. Best support by KP% at First Stand (73.5%), most assists.
    // Engage-heavy, systematic, vision-oriented.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Systematic", "Dive", "Teamfight"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — EDward Gaming
  // ══════════════════════════════════════════════════════════════════
  "zdz": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "xiaohao": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Pathing", "Tempo"] },
  },
  "angel": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Flexible"] },
  },
  "leave": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "parukia": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Roaming", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Invictus Gaming
  // ══════════════════════════════════════════════════════════════════
  "breathe": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Teamfight", "Systematic"] },
  },
  "wei": {
    // Wei: 3x POTM at iG Spring. Active jungler with good game reads.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Objective", "Early Game", "Roaming"] },
  },
  "renard": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "jiaqi": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Scaling", "Teamfight"] },
  },
  "meiko": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Systematic", "Teamfight"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — JD Gaming
  // ══════════════════════════════════════════════════════════════════
  "xiaoxu": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "junjia": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Early Game", "Pathing"] },
  },
  "hongq": {
    // HongQ: solid JDG mid, 3x POTG. Improving carry player.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Scaling", "Teamfight", "Flexible"] },
  },
  "gala": {
    // GALA: 8RP ADC. Systematic, scaling. Very stable and consistent.
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Late Game", "Systematic", "Stable", "Teamfight"] },
  },
  "vampire": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Stable", "Systematic"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — LGD Gaming
  // ══════════════════════════════════════════════════════════════════
  "burdol": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "heng": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "tangyuan": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "shaoye": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "ycx": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — LNG Esports
  // ══════════════════════════════════════════════════════════════════
  "sheer": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "croco": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Objective", "Pathing", "Flexible"] },
  },
  "bulldog": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Scaling", "Teamfight", "Flexible"] },
  },
  "1xn": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Stable"] },
  },
  "missing": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Teamfight"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Ninjas in Pyjamas
  // ══════════════════════════════════════════════════════════════════
  "hoya": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "guwon": {
    // Guwon: 3x POTG at NIP. Active playmaking jungler.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Objective"] },
  },
  "care": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Teamfight"] },
  },
  "assum": {
    // Assum: best NIP player, 3x POTM and 4x POTG. Strong ADC.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Late Game", "Teamfight"] },
  },
  "zhuo": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Roaming", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Oh My God
  // ══════════════════════════════════════════════════════════════════
  "hery": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "re0": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "haichao": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "starry": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "moham": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Top Esports  ★ Group Ascend leaders
  // ══════════════════════════════════════════════════════════════════
  "369": {
    // 369: veteran stable top. Consistent teamfighter, not flashy.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight", "Late Game"] },
  },
  "tian": {
    // Tian: 3x POTM and 3x POTG at TES, Best Jungle two weeks in a row.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Dive", "Tempo"] },
  },
  "creme": {
    // Creme: strong mid at TES. Good laner and carry threat.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Teamfight"] },
  },
  "jackeylove": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Snowball", "Early Game", "Teamfight"] },
  },
  "fengyue": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — ThunderTalk Gaming
  // ══════════════════════════════════════════════════════════════════
  "ahn": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Systematic"] },
  },
  "junhao": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Objective", "Pathing"] },
  },
  "heru": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "keshi": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "feather": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Ultra Prime
  // ══════════════════════════════════════════════════════════════════
  "sasi": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "climber": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "utility",
    tagOverrides: { add: ["Pathing"] },
  },
  "saber": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible"] },
  },
  "hena": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "xiaoxia": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Flexible"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Team WE
  // ══════════════════════════════════════════════════════════════════
  "cube": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Systematic"] },
  },
  "monki": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Roaming"] },
  },
  "karis": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Flexible"] },
  },
  "about": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "erha": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Systematic", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LPL — Weibo Gaming
  // ══════════════════════════════════════════════════════════════════
  "zika": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable", "Teamfight", "Systematic"] },
  },
  "jiejie": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Dive", "Tempo"] },
  },
  "xiaohu": {
    // Xiaohu: veteran stable mid. Systematic, strong late game.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Stable", "Systematic", "Late Game", "Teamfight"] },
  },
  "elk": {
    // Elk: 8RP ADC. Lane dominant and aggressive. NOT weakside.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Early Game", "Teamfight", "Snowball"] },
  },
  "hang": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Stable", "Roaming"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Cloud9  ★ 3-0 Spring co-1st
  // ══════════════════════════════════════════════════════════════════
  "thanatos": {
    // Best LCS top alongside Dhokla. C9 Week 1 Player of Week. Aggressive.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "brawler",
    tagOverrides: { add: ["Early Game", "Snowball", "Lane Dominant", "Dive"] },
  },
  "blaber": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Invader"] },
  },
  "apa": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Lane Dominant", "Scaling", "Flexible"] },
  },
  "zven": {
    // Zven: best LCS ADC. Veteran, systematic, consistent.
    primaryStyle: "scaler",
    primaryDisplayOverride: "Scaler",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Late Game", "Teamfight"] },
  },
  "vulcan": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Systematic"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Team Liquid  ★ 3-0 Spring co-1st
  // ══════════════════════════════════════════════════════════════════
  "morgan": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Stable", "Systematic", "Teamfight"] },
  },
  "josedeodo": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Dive", "Roaming"] },
  },
  "quid": {
    // Quid: best LCS mid. Scaling playmaker.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Scaling", "Lane Dominant", "Teamfight"] },
  },
  "yeon": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "corejj": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Systematic", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — LYON  ★ Inspired: best LCS jungler by far
  // ══════════════════════════════════════════════════════════════════
  "dhokla": {
    // Dhokla at First Stand: poor stats (33% WR, -517 GD@15). Best LCS top
    // is debatable. More of a stable carry than aggressive carry.
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Flexible", "Teamfight"] },
  },
  "inspired": {
    // Inspired: CLEARLY best LCS player. 50% FB% at First Stand, dominant.
    // High-carry, snowball jungler with exceptional early game.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "carry",
    tagOverrides: { add: ["Early Game", "Snowball", "Invader", "Dive"] },
  },
  "saint": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "berserker": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Lane Dominant", "Teamfight", "Stable"] },
  },
  "isles": {
    // Isles: best LCS support. 43% VS% (very high), consistent.
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "roamer",
    tagOverrides: { add: ["Vision", "Peel", "Systematic", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Sentinels
  // ══════════════════════════════════════════════════════════════════
  "impact": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Systematic"] },
  },
  "hambak": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Pathing", "Objective"] },
  },
  "darkwings": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "rahel": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "huhi": {
    // Huhi: 3x MVP at SEN. Best SEN player.
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Roaming", "Creative"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — FlyQuest
  // ══════════════════════════════════════════════════════════════════
  "gakgos": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "gryffinn": {
    // Gryffinn: 3x MVP, 2x POTW at FLY. Clearly best FLY player.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Invader"] },
  },
  "quad": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible", "Scaling"] },
  },
  "massu": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "cryogen": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Shopify Rebellion
  // ══════════════════════════════════════════════════════════════════
  "fudge": {
    primaryStyle: "flex",
    primaryDisplayOverride: "Flex",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Flexible", "Stable"] },
  },
  "contractz": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Pathing", "Objective"] },
  },
  "zinie": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible"] },
  },
  "bvoy": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Stable", "Teamfight"] },
  },
  "ceos": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "lane_bully",
    tagOverrides: { add: ["Vision", "Stable"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Disguised
  // ══════════════════════════════════════════════════════════════════
  "castle": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "tank",
    tagOverrides: { add: ["Stable"] },
  },
  "kryra": {
    // KryRa: 2x MVP at DSG despite poor team record.
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball"] },
  },
  "callme": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible"] },
  },
  "sajed": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "lyonz": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision"] },
  },

  // ══════════════════════════════════════════════════════════════════
  // LCS — Dignitas
  // ══════════════════════════════════════════════════════════════════
  "photon": {
    primaryStyle: "tank",
    primaryDisplayOverride: "Controller",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "exyu": {
    primaryStyle: "setup",
    primaryDisplayOverride: "Setup",
    secondaryStyle: "playmaker",
    tagOverrides: { add: ["Pathing"] },
  },
  "palafox": {
    primaryStyle: "playmaker",
    primaryDisplayOverride: "Playmaker",
    secondaryStyle: "scaler",
    tagOverrides: { add: ["Flexible"] },
  },
  "fbi": {
    primaryStyle: "carry",
    primaryDisplayOverride: "Carry",
    secondaryStyle: "weakside",
    tagOverrides: { add: ["Stable"] },
  },
  "ignar": {
    primaryStyle: "utility",
    primaryDisplayOverride: "Utility",
    secondaryStyle: "setup",
    tagOverrides: { add: ["Vision", "Stable"] },
  },
};