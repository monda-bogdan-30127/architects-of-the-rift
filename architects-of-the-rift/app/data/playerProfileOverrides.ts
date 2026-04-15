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
  faker: {
    phaseProfile: {
      early: { laneControl: 8.6, skirmish: 7.9, stability: 9.1, mapPlay: 8.8, teamfight: 8.4, clutch: 9.2 },
      mid: { laneControl: 8.5, skirmish: 8.3, stability: 9.0, mapPlay: 9.4, teamfight: 8.9, clutch: 9.4 },
      late: { laneControl: 8.2, skirmish: 8.4, stability: 9.3, mapPlay: 9.3, teamfight: 9.5, clutch: 9.7 },
    },
    archetypeAffinity: { setup: 9.7, utility: 9.4, carry: 8.9, poke: 8.7, frontToBack: 9.2 },
    adaptationProfile: { draftFlex: 9.5, creativity: 9.0, composure: 9.8, matchupLearning: 9.7 },
    tagOverrides: { add: ["Systematic", "Late Game"] },
  },
  chovy: {
    phaseProfile: {
      early: { laneControl: 9.5, skirmish: 8.1, stability: 9.4, mapPlay: 8.3, teamfight: 8.5, clutch: 8.4 },
      mid: { laneControl: 9.4, skirmish: 8.5, stability: 9.2, mapPlay: 8.6, teamfight: 8.9, clutch: 8.6 },
      late: { laneControl: 9.1, skirmish: 8.6, stability: 9.3, mapPlay: 8.8, teamfight: 9.3, clutch: 8.9 },
    },
    archetypeAffinity: { carry: 9.8, poke: 9.2, frontToBack: 9.0, setup: 8.4 },
    adaptationProfile: { draftFlex: 8.8, creativity: 8.2, composure: 9.1, matchupLearning: 9.0 },
    tagOverrides: { add: ["Priority Lane", "Late Game"] },
  },
  canyon: {
    phaseProfile: {
      early: { laneControl: 6.2, skirmish: 9.5, stability: 8.2, mapPlay: 9.4, teamfight: 8.1, clutch: 8.3 },
      mid: { laneControl: 6.0, skirmish: 9.3, stability: 8.5, mapPlay: 9.5, teamfight: 8.5, clutch: 8.5 },
      late: { laneControl: 5.8, skirmish: 8.4, stability: 8.7, mapPlay: 9.1, teamfight: 8.8, clutch: 8.4 },
    },
    archetypeAffinity: { engage: 9.0, carry: 8.8, tank: 8.5, dive: 9.3, setup: 9.1 },
    adaptationProfile: { draftFlex: 8.8, creativity: 8.3, composure: 8.8, matchupLearning: 9.1 },
    tagOverrides: { add: ["Early Game", "Dive"] },
  },
  oner: {
    phaseProfile: {
      early: { laneControl: 5.8, skirmish: 9.0, stability: 8.0, mapPlay: 8.7, teamfight: 8.2, clutch: 8.1 },
      mid: { laneControl: 5.8, skirmish: 8.9, stability: 8.2, mapPlay: 8.9, teamfight: 8.6, clutch: 8.5 },
      late: { laneControl: 5.5, skirmish: 8.1, stability: 8.4, mapPlay: 8.8, teamfight: 8.9, clutch: 8.8 },
    },
    archetypeAffinity: { engage: 9.1, dive: 9.0, setup: 8.8, tank: 8.0 },
    adaptationProfile: { draftFlex: 8.5, creativity: 8.2, composure: 8.7, matchupLearning: 8.6 },
    tagOverrides: { add: ["Dive", "Early Game"] },
  },
  keria: {
    phaseProfile: {
      early: { laneControl: 9.2, skirmish: 8.8, stability: 8.4, mapPlay: 9.0, teamfight: 8.5, clutch: 8.2 },
      mid: { laneControl: 8.7, skirmish: 8.6, stability: 8.4, mapPlay: 9.5, teamfight: 8.9, clutch: 8.6 },
      late: { laneControl: 8.2, skirmish: 8.2, stability: 8.8, mapPlay: 9.2, teamfight: 9.1, clutch: 8.9 },
    },
    archetypeAffinity: { enchanter: 9.5, engage: 9.3, utility: 9.8, setup: 9.6, poke: 8.8 },
    adaptationProfile: { draftFlex: 9.8, creativity: 9.7, composure: 8.9, matchupLearning: 9.4 },
    tagOverrides: { add: ["Creative", "Lane Pressure"] },
  },
  delight: {
    phaseProfile: {
      early: { laneControl: 8.1, skirmish: 8.3, stability: 8.7, mapPlay: 8.4, teamfight: 8.5, clutch: 8.0 },
      mid: { laneControl: 7.8, skirmish: 8.4, stability: 8.8, mapPlay: 8.8, teamfight: 8.9, clutch: 8.3 },
      late: { laneControl: 7.4, skirmish: 8.0, stability: 8.9, mapPlay: 8.7, teamfight: 9.1, clutch: 8.5 },
    },
    archetypeAffinity: { engage: 9.0, enchanter: 8.2, utility: 8.8, setup: 8.9, frontToBack: 8.6 },
    adaptationProfile: { draftFlex: 8.2, creativity: 7.9, composure: 8.8, matchupLearning: 8.4 },
    tagOverrides: { add: ["Systematic"] },
  },
  gumayusi: {
    phaseProfile: {
      early: { laneControl: 8.5, skirmish: 8.4, stability: 8.7, mapPlay: 7.8, teamfight: 8.8, clutch: 8.6 },
      mid: { laneControl: 8.2, skirmish: 8.3, stability: 8.8, mapPlay: 8.0, teamfight: 9.0, clutch: 8.8 },
      late: { laneControl: 8.0, skirmish: 8.1, stability: 9.1, mapPlay: 8.2, teamfight: 9.4, clutch: 9.1 },
    },
    archetypeAffinity: { carry: 9.5, poke: 8.8, frontToBack: 9.3 },
    adaptationProfile: { draftFlex: 8.4, creativity: 7.9, composure: 9.1, matchupLearning: 8.7 },
    tagOverrides: { add: ["Teamfight", "Late Game"] },
  },
  ruler: {
    phaseProfile: {
      early: { laneControl: 8.8, skirmish: 8.5, stability: 9.1, mapPlay: 8.0, teamfight: 9.0, clutch: 8.8 },
      mid: { laneControl: 8.5, skirmish: 8.4, stability: 9.2, mapPlay: 8.1, teamfight: 9.2, clutch: 8.9 },
      late: { laneControl: 8.3, skirmish: 8.1, stability: 9.4, mapPlay: 8.3, teamfight: 9.7, clutch: 9.2 },
    },
    archetypeAffinity: { carry: 9.8, frontToBack: 9.7, poke: 8.5 },
    adaptationProfile: { draftFlex: 8.0, creativity: 7.5, composure: 9.4, matchupLearning: 8.8 },
    tagOverrides: { add: ["Systematic", "Late Game"] },
  },
  viper: {
    phaseProfile: {
      early: { laneControl: 8.6, skirmish: 8.8, stability: 8.7, mapPlay: 7.9, teamfight: 8.9, clutch: 8.7 },
      mid: { laneControl: 8.3, skirmish: 8.7, stability: 8.8, mapPlay: 8.0, teamfight: 9.2, clutch: 8.9 },
      late: { laneControl: 8.0, skirmish: 8.4, stability: 9.0, mapPlay: 8.1, teamfight: 9.6, clutch: 9.3 },
    },
    archetypeAffinity: { carry: 9.7, frontToBack: 9.4, poke: 8.8 },
    adaptationProfile: { draftFlex: 8.5, creativity: 8.0, composure: 9.2, matchupLearning: 8.8 },
    tagOverrides: { add: ["Aggressive", "Late Game"] },
  },
  zeus: {
    phaseProfile: {
      early: { laneControl: 8.9, skirmish: 9.0, stability: 7.8, mapPlay: 7.9, teamfight: 8.4, clutch: 8.1 },
      mid: { laneControl: 8.7, skirmish: 8.9, stability: 8.0, mapPlay: 8.1, teamfight: 8.6, clutch: 8.2 },
      late: { laneControl: 8.4, skirmish: 8.5, stability: 8.3, mapPlay: 8.2, teamfight: 8.9, clutch: 8.5 },
    },
    archetypeAffinity: { carry: 9.1, dive: 9.0, engage: 8.2, poke: 8.3 },
    adaptationProfile: { draftFlex: 8.7, creativity: 8.8, composure: 8.1, matchupLearning: 8.5 },
    tagOverrides: { add: ["Early Game", "Snowball"], remove: ["Stable"] },
  },
  kiin: {
    phaseProfile: {
      early: { laneControl: 8.7, skirmish: 8.2, stability: 9.0, mapPlay: 7.8, teamfight: 8.3, clutch: 8.0 },
      mid: { laneControl: 8.5, skirmish: 8.4, stability: 9.2, mapPlay: 8.0, teamfight: 8.6, clutch: 8.2 },
      late: { laneControl: 8.4, skirmish: 8.1, stability: 9.4, mapPlay: 8.1, teamfight: 8.9, clutch: 8.3 },
    },
    archetypeAffinity: { tank: 9.0, carry: 8.8, frontToBack: 9.1, utility: 8.2 },
    adaptationProfile: { draftFlex: 8.6, creativity: 7.8, composure: 9.0, matchupLearning: 8.7 },
    secondaryStyle: "carry",
    tagOverrides: { add: ["Systematic", "Counterpick"] },
  },
  xiaohu: {
    phaseProfile: {
      early: { laneControl: 8.3, skirmish: 7.8, stability: 8.4, mapPlay: 8.5, teamfight: 8.1, clutch: 8.4 },
      mid: { laneControl: 8.1, skirmish: 8.0, stability: 8.6, mapPlay: 8.8, teamfight: 8.5, clutch: 8.7 },
      late: { laneControl: 7.9, skirmish: 7.8, stability: 8.8, mapPlay: 8.9, teamfight: 8.9, clutch: 8.8 },
    },
    archetypeAffinity: { setup: 9.0, utility: 8.9, carry: 8.4, frontToBack: 8.8 },
    adaptationProfile: { draftFlex: 8.9, creativity: 8.2, composure: 8.9, matchupLearning: 9.0 },
    tagOverrides: { add: ["Late Game", "Systematic"] },
  },
  meiko: {
    phaseProfile: {
      early: { laneControl: 8.1, skirmish: 7.9, stability: 8.6, mapPlay: 8.8, teamfight: 8.3, clutch: 8.4 },
      mid: { laneControl: 7.8, skirmish: 8.0, stability: 8.8, mapPlay: 9.0, teamfight: 8.7, clutch: 8.6 },
      late: { laneControl: 7.5, skirmish: 7.8, stability: 9.0, mapPlay: 9.1, teamfight: 9.0, clutch: 8.9 },
    },
    archetypeAffinity: { enchanter: 8.8, engage: 8.7, utility: 9.3, setup: 9.0, frontToBack: 9.1 },
    adaptationProfile: { draftFlex: 8.7, creativity: 8.0, composure: 9.0, matchupLearning: 8.9 },
    tagOverrides: { add: ["Vision", "Systematic"] },
  },
  tarzan: {
    phaseProfile: {
      early: { laneControl: 6.0, skirmish: 8.8, stability: 8.2, mapPlay: 9.0, teamfight: 8.0, clutch: 8.1 },
      mid: { laneControl: 5.8, skirmish: 8.5, stability: 8.4, mapPlay: 9.2, teamfight: 8.3, clutch: 8.3 },
      late: { laneControl: 5.6, skirmish: 7.9, stability: 8.7, mapPlay: 9.0, teamfight: 8.6, clutch: 8.4 },
    },
    archetypeAffinity: { engage: 8.8, tank: 8.6, dive: 8.8, setup: 9.0 },
    adaptationProfile: { draftFlex: 8.4, creativity: 7.8, composure: 8.8, matchupLearning: 8.9 },
    tagOverrides: { add: ["Objective", "Systematic"] },
  },
  bin: {
    phaseProfile: {
      early: { laneControl: 9.3, skirmish: 9.0, stability: 7.6, mapPlay: 7.5, teamfight: 8.4, clutch: 8.0 },
      mid: { laneControl: 9.0, skirmish: 9.1, stability: 7.6, mapPlay: 7.8, teamfight: 8.7, clutch: 8.2 },
      late: { laneControl: 8.6, skirmish: 8.6, stability: 7.8, mapPlay: 7.9, teamfight: 8.9, clutch: 8.4 },
    },
    archetypeAffinity: { carry: 9.6, dive: 9.1, engage: 8.0, poke: 7.5 },
    adaptationProfile: { draftFlex: 8.4, creativity: 8.8, composure: 7.8, matchupLearning: 8.7 },
    primaryStyle: "brawler",
    primaryDisplayOverride: "Brawler",
    secondaryStyle: "aggressive",
    tagOverrides: { add: ["Early Game", "Snowball", "Dive"], remove: ["Stable"] },
  },
  knight: {
    phaseProfile: {
      early: { laneControl: 9.4, skirmish: 8.6, stability: 9.2, mapPlay: 8.8, teamfight: 8.7, clutch: 8.8 },
      mid: { laneControl: 9.3, skirmish: 8.8, stability: 9.1, mapPlay: 9.0, teamfight: 9.0, clutch: 9.0 },
      late: { laneControl: 9.1, skirmish: 8.7, stability: 9.3, mapPlay: 9.1, teamfight: 9.4, clutch: 9.2 },
    },
    archetypeAffinity: { carry: 9.8, poke: 9.2, frontToBack: 8.8, setup: 8.4 },
    adaptationProfile: { draftFlex: 9.1, creativity: 8.7, composure: 9.0, matchupLearning: 9.2 },
    tagOverrides: { add: ["Priority Lane", "Late Game"] },
  },
  elk: {
    phaseProfile: {
      early: { laneControl: 8.6, skirmish: 8.7, stability: 8.4, mapPlay: 7.8, teamfight: 8.8, clutch: 8.6 },
      mid: { laneControl: 8.3, skirmish: 8.6, stability: 8.5, mapPlay: 8.0, teamfight: 9.0, clutch: 8.8 },
      late: { laneControl: 8.1, skirmish: 8.3, stability: 8.8, mapPlay: 8.1, teamfight: 9.4, clutch: 9.0 },
    },
    archetypeAffinity: { carry: 9.6, frontToBack: 9.2, poke: 8.5 },
    adaptationProfile: { draftFlex: 8.2, creativity: 8.0, composure: 8.8, matchupLearning: 8.4 },
    tagOverrides: { add: ["Teamfight", "Late Game"] },
  },

  // ── Secondary style nudges — derivare automată dar cu override semantic ──
  brokenblade: { secondaryStyle: "weakside" },
  carzzy: { secondaryStyle: "weakside" },
  myrwn: { secondaryStyle: "aggressive" },
  elyoya: { secondaryStyle: "carry" },
  jojopyun: { secondaryStyle: "carry" },
  empyros: { secondaryStyle: "weakside" },
  "naak-nako": { secondaryStyle: "carry" },
  wunder: { secondaryStyle: "weakside" },
  theshy: { secondaryStyle: "aggressive", tagOverrides: { add: ["Early Game", "Snowball"] } },
  kingen: { secondaryStyle: "weakside" },
  pyosik: { secondaryStyle: "aggressive" },
  casting: { secondaryStyle: "weakside" },
  xun: { secondaryStyle: "carry", tagOverrides: { add: ["Early Game"] } },
  zdz: { secondaryStyle: "weakside" },
  breathe: { secondaryStyle: "aggressive" },
  xiaoxu: { secondaryStyle: "aggressive" },
  hongq: { secondaryStyle: "aggressive", tagOverrides: { add: ["Snowball"] } },
  369: { secondaryStyle: "weakside", tagOverrides: { add: ["Systematic"] } },
  "hans-sama": { secondaryStyle: "aggressive", tagOverrides: { add: ["Aggressive"] } },
  caliste: { secondaryStyle: "aggressive" },
  maynter: { secondaryStyle: "weakside" },
  jackeylove: { secondaryStyle: "aggressive", tagOverrides: { add: ["Volatile"] } },
};