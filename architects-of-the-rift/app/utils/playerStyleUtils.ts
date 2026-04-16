import type { Player } from "@/app/types/player";
import { playerProfileOverrides } from "@/app/data/playerProfileOverrides";

type StyleInfo = {
  primary: string;
  secondary: string;
  tags: string[];
};

type ScoredEntry = {
  label: string;
  score: number;
};

const sortByScoreDesc = (entries: ScoredEntry[]) =>
  [...entries].sort((a, b) => b.score - a.score);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const norm100 = (value: number) => clamp01(value / 100);
const norm10  = (value: number) => clamp01(value / 10);

// Threshold helpers — score only fires when value is in a meaningful range
const needsTeamLabel    = (v: number) => clamp01((v - 0.58) / 0.24);
const resourceHeavyLabel = (v: number) => clamp01((v - 0.66) / 0.20);
const resourceLightLabel = (v: number) => clamp01((0.56 - v) / 0.24);
const lowRiskLabel       = (v: number) => clamp01((0.60 - v) / 0.26);
const highRiskLabel      = (v: number) => clamp01((v - 0.60) / 0.24);
const highVolatileLabel  = (v: number) => clamp01((v - 0.65) / 0.22);

// ─── Fallbacks ───────────────────────────────────────────────────────────────
const byRoleFallback: Record<Player["role"], { secondary: string; tags: string[] }> = {
  top:     { secondary: "Controller", tags: ["Stable", "Flexible"]   },
  jungle:  { secondary: "Tempo",      tags: ["Objective", "Tempo"]   },
  mid:     { secondary: "Controller", tags: ["Stable", "Flexible"]   },
  adc:     { secondary: "Teamfighter",tags: ["Teamfight", "Stable"]  },
  support: { secondary: "Facilitator",tags: ["Utility", "Vision"]    },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uniquePush = (values: string[], next: string) => {
  if (!values.includes(next)) values.push(next);
};

const pickTopTagLabels = (
  candidates: ScoredEntry[],
  excluded: string[],
  fallbackTags: string[],
  maxTags = 3,
): string[] => {
  const chosen: string[] = [];
  const loweredExcluded = new Set(excluded.map((item) => item.toLowerCase()));

  for (const entry of sortByScoreDesc(candidates)) {
    // ── PATCH: raised threshold 0.44 → 0.48 for tighter tag quality ──────
    if (entry.score < 0.48) continue;
    if (loweredExcluded.has(entry.label.toLowerCase())) continue;
    uniquePush(chosen, entry.label);
    if (chosen.length >= maxTags) break;
  }

  for (const fallback of fallbackTags) {
    if (chosen.length >= maxTags) break;
    if (loweredExcluded.has(fallback.toLowerCase())) continue;
    uniquePush(chosen, fallback);
  }

  return chosen;
};

// ─── Override score readers ───────────────────────────────────────────────────
const overrideScore = (
  player: Player,
  key: keyof NonNullable<Player["archetypeAffinity"]>,
  scale = 1,
) => norm10(player.archetypeAffinity?.[key] ?? 0) * scale;

const adaptationScore = (
  player: Player,
  key: keyof NonNullable<Player["adaptationProfile"]>,
  scale = 1,
) => norm10(player.adaptationProfile?.[key] ?? 0) * scale;

// ─── Internal label → display string ─────────────────────────────────────────
// ─── Valid display secondary labels per role ─────────────────────────────────
// Prevents an internal override like "assassin" from showing on a support card
// as secondary — if the converted display label isn't role-appropriate, fall
// back to the role fallback secondary.
const ROLE_VALID_DISPLAY_SECONDARIES: Record<Player["role"], Set<string>> = {
  top:     new Set(["Carry", "Scaler", "Lane Bully", "Aggressive", "Brawler", "Tank", "Weakside", "Flexible", "Poke", "Controller", "Splitpush"]),
  jungle:  new Set(["Carry", "Playmaker", "Setup", "Roamer", "Aggressive", "Assassin", "Farmer", "Flexible", "Controller", "Tempo"]),
  mid:     new Set(["Carry", "Scaler", "Playmaker", "Aggressive", "Assassin", "Poke", "Roamer", "Flexible", "Controller"]),
  adc:     new Set(["Carry", "Scaler", "Hypercarry", "Lane Bully", "Weakside", "Aggressive", "Flexible", "Teamfighter"]),
  support: new Set(["Utility", "Setup", "Playmaker", "Tank", "Lane Bully", "Roamer", "Flexible", "Facilitator", "Engage", "Enchanter"]),
};

const toDisplayStyleLabel = (
  style?: Player["playstyleIdentity"]["secondary"],
): string | undefined => {
  switch (style) {
    case "carry":       return "Carry";
    case "utility":     return "Utility";
    case "playmaker":   return "Playmaker";
    case "scaler":      return "Scaler";
    case "lane_bully":  return "Lane Bully";
    case "roamer":      return "Roamer";
    case "aggressive":  return "Aggressive";
    case "setup":       return "Setup";
    case "flex":        return "Flexible";
    case "weakside":    return "Weakside";
    // ── PATCH: new labels ──────────────────────────────────────────────────
    case "brawler":     return "Brawler";
    case "tank":        return "Tank";
    case "assassin":    return "Assassin";
    case "farmer":      return "Farmer";
    case "poke_style":  return "Poke";
    case "hypercarry":  return "Hypercarry";
    default:            return undefined;
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// getPlayerStyleInfo — called ONCE per player inside createPlayer (players.ts)
// Results are stored on player.playstyleIdentity as:
//   displayPrimary, displaySecondary, displayTags
//
// DO NOT call this function directly in UI components or gameplay systems.
// Read from player.playstyleIdentity.displayPrimary / displayTags instead.
// ═════════════════════════════════════════════════════════════════════════════
export function getPlayerStyleInfo(player: Player): StyleInfo {
  const playstyle   = player.advancedProfile.playstyle;
  const primary     = player.advancedProfile.primary;
  const tendencies  = player.advancedProfile.tendencies;
  const substats    = player.advancedProfile.substats;
  const hidden      = player.advancedProfile.hiddenTraits; // PATCH: added

  // ── Playstyle floats (0–1) ─────────────────────────────────────────────
  const carryUsage        = norm100(playstyle.carryResourceUsage);
  const utilityComfort    = norm100(playstyle.utilityComfort);
  const playmakingIntent  = norm100(playstyle.playmakingIntent);
  const scalingOrientation= norm100(playstyle.scalingOrientation);
  const laneControlBias   = norm100(playstyle.laneControlBias);
  const roamBias          = norm100(playstyle.roamBias);
  const riskAppetite      = norm100(playstyle.riskAppetite);
  const setupDependence   = norm100(playstyle.setupDependence);
  const styleFlex         = norm100(playstyle.styleFlex);

  // ── Primary stat floats ────────────────────────────────────────────────
  const mechanics       = norm100(primary.mechanics);
  const laning          = norm100(primary.laning);
  const teamfighting    = norm100(primary.teamfighting);
  const skirmishing     = norm100(primary.skirmishing);
  const mapAwareness    = norm100(primary.mapAwareness);
  const objectiveControl= norm100(primary.objectiveControl);
  const consistency     = norm100(primary.consistency);
  const discipline      = norm100(primary.discipline);
  const clutchFactor    = norm100(primary.clutchFactor);
  const metaReadiness   = norm100(primary.metaReadiness);
  const riskManagement  = norm100(primary.riskManagement);
  const aggression      = norm100(primary.aggression);
  const rotationTiming  = norm100(primary.rotationTiming);

  // ── Tendency floats ────────────────────────────────────────────────────
  const splitPushBias       = norm100(tendencies.splitPushBias);
  const flankPreference     = norm100(tendencies.flankPreference);
  const invadeFrequency     = norm100(tendencies.invadeFrequency);
  const safeLanePreference  = norm100(tendencies.safeLanePreference);
  const towerDiveFrequency  = norm100(tendencies.towerDiveFrequency); // PATCH: added

  // ── Hidden trait floats (for tags) ────────────────────────────────────
  const volatility = norm100(hidden.volatility); // PATCH: added

  const role = player.role;

  let styleCandidates: ScoredEntry[] = [];
  let tagCandidates:   ScoredEntry[] = [];

  // ═══════════════════════════════════════════════════════════════════════
  // TOP
  // ═══════════════════════════════════════════════════════════════════════
  switch (role) {
    case "top": {
      const weaksideScore =
        resourceLightLabel(carryUsage) * 0.34 +
        safeLanePreference             * 0.18 +
        consistency                    * 0.18 +
        riskManagement                 * 0.16 +
        norm100(substats.blindStability) * 0.14;

      const carryTopScore =
        carryUsage   * 0.32 +
        mechanics    * 0.18 +
        laning       * 0.14 +
        aggression   * 0.10 +
        splitPushBias* 0.10 +
        overrideScore(player, "carry", 0.14) -
        resourceLightLabel(carryUsage) * 0.22;

      const splitpushScore =
        splitPushBias * 0.40 +
        laning        * 0.18 +
        mechanics     * 0.12 +
        carryUsage    * 0.10 +
        norm100(primary.counterPickStrength) * 0.10 -
        resourceLightLabel(carryUsage) * 0.16;

      styleCandidates = [
        { label: "Carry",     score: carryTopScore },
        { label: "Weakside",  score: weaksideScore },
        {
          label: "Controller",
          score:
            mapAwareness   * 0.24 +
            discipline     * 0.22 +
            consistency    * 0.18 +
            riskManagement * 0.16 +
            metaReadiness  * 0.10 +
            overrideScore(player, "utility", 0.10),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation * 0.46 +
            teamfighting       * 0.18 +
            consistency        * 0.16 +
            clutchFactor       * 0.08 +
            overrideScore(player, "frontToBack", 0.10),
        },
        { label: "Splitpush", score: splitpushScore },
        // ── PATCH: new styles ─────────────────────────────────────────────
        {
          label: "Brawler",
          score:
            skirmishing          * 0.36 +
            aggression           * 0.28 +
            highRiskLabel(riskAppetite) * 0.20 +
            (1 - teamfighting)   * 0.16 +
            overrideScore(player, "dive", 0.10),
        },
        {
          label: "Tank",
          score:
            discipline                           * 0.36 +
            riskManagement                       * 0.30 +
            resourceLightLabel(carryUsage)       * 0.20 +
            overrideScore(player, "tank", 0.28)  +
            overrideScore(player, "engage", 0.10),
        },
      ];

      tagCandidates = [
        {
          label: "Lane Dominant",
          score:
            laneControlBias * 0.34 +
            laning          * 0.24 +
            aggression      * 0.16 +
            carryUsage      * 0.12 +
            splitPushBias   * 0.08 -
            weaksideScore   * 0.32,
        },
        {
          label: "Counterpick",
          score:
            norm100(primary.counterPickStrength) * 0.34 +
            laning          * 0.18 +
            carryTopScore   * 0.24 +
            splitpushScore  * 0.14 -
            weaksideScore   * 0.30,
        },
        { label: "Weakside",  score: weaksideScore * 0.86 + consistency * 0.14 },
        {
          label: "Scaling",
          score: scalingOrientation * 0.62 + teamfighting * 0.24 + consistency * 0.14,
        },
        {
          label: "Teamfight",
          score: teamfighting * 0.58 + scalingOrientation * 0.14 + clutchFactor * 0.16 + consistency * 0.12,
        },
        { label: "Stable",   score: consistency * 0.50 + riskManagement * 0.30 + discipline * 0.20 },
        { label: "Flexible", score: styleFlex * 0.70 + metaReadiness * 0.30 },
        // ── PATCH: new tags ───────────────────────────────────────────────
        {
          label: "Early Game",
          score:
            aggression           * 0.30 +
            laning               * 0.28 +
            (1 - scalingOrientation) * 0.28 +
            invadeFrequency      * 0.14,
        },
        {
          label: "Dive",
          score:
            towerDiveFrequency              * 0.46 +
            aggression                      * 0.22 +
            skirmishing                     * 0.18 +
            overrideScore(player, "dive", 0.24),
        },
        {
          label: "Poke",
          score:
            overrideScore(player, "poke", 0.70) +
            laning          * 0.18 +
            laneControlBias * 0.12,
        },
        {
          label: "Volatile",
          score: highVolatileLabel(volatility) * 0.70 + (1 - consistency) * 0.30,
        },
        {
          label: "Systematic",
          score: discipline * 0.36 + riskManagement * 0.34 + consistency * 0.30,
        },
      ];
      break;
    }

    // ═════════════════════════════════════════════════════════════════════
    // JUNGLE
    // ═════════════════════════════════════════════════════════════════════
    case "jungle": {
      styleCandidates = [
        {
          label: "Carry",
          score:
            resourceHeavyLabel(carryUsage) * 0.30 +
            mechanics           * 0.16 +
            skirmishing         * 0.20 +
            aggression          * 0.14 +
            teamfighting        * 0.08 +
            highRiskLabel(riskAppetite) * 0.06 +
            overrideScore(player, "carry", 0.16),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent    * 0.28 +
            skirmishing         * 0.22 +
            aggression          * 0.16 +
            flankPreference     * 0.10 +
            highRiskLabel(riskAppetite) * 0.08 +
            invadeFrequency     * 0.06 +
            overrideScore(player, "engage", 0.12) +
            overrideScore(player, "dive", 0.10),
        },
        {
          label: "Setup",
          score:
            utilityComfort      * 0.20 +
            objectiveControl    * 0.22 +
            mapAwareness        * 0.18 +
            discipline          * 0.12 +
            riskManagement      * 0.08 +
            overrideScore(player, "setup", 0.12) +
            overrideScore(player, "tank", 0.08),
        },
        {
          label: "Controller",
          score:
            mapAwareness        * 0.24 +
            objectiveControl    * 0.24 +
            discipline          * 0.18 +
            consistency         * 0.16 +
            riskManagement      * 0.12 +
            rotationTiming      * 0.06,
        },
        // ── PATCH: new styles ─────────────────────────────────────────────
        {
          label: "Assassin",
          score:
            mechanics                    * 0.34 +
            skirmishing                  * 0.26 +
            aggression                   * 0.20 +
            highRiskLabel(riskAppetite)  * 0.12 +
            overrideScore(player, "dive", 0.18) -
            utilityComfort               * 0.14,
        },
        {
          label: "Farmer",
          score:
            scalingOrientation           * 0.40 +
            consistency                  * 0.26 +
            (1 - aggression)             * 0.20 +
            safeLanePreference           * 0.14 -
            invadeFrequency              * 0.10,
        },
      ];

      tagCandidates = [
        {
          label: "Tempo",
          score:
            rotationTiming      * 0.44 +
            mapAwareness        * 0.30 +
            playmakingIntent    * 0.14 +
            invadeFrequency     * 0.12,
        },
        { label: "Objective", score: objectiveControl * 0.72 + discipline * 0.10 + mapAwareness * 0.18 },
        { label: "Invader",   score: invadeFrequency * 0.74 + aggression * 0.12 + skirmishing * 0.14 },
        { label: "Stable",    score: consistency * 0.50 + riskManagement * 0.30 + discipline * 0.20 },
        {
          label: "High Risk",
          score: highRiskLabel(riskAppetite) * 0.66 + aggression * 0.20 + skirmishing * 0.14,
        },
        {
          label: "Pathing",
          score: mapAwareness * 0.54 + objectiveControl * 0.22 + rotationTiming * 0.24,
        },
        { label: "Scaling",   score: scalingOrientation * 0.70 + teamfighting * 0.30 },
        // ── PATCH: new tags ───────────────────────────────────────────────
        {
          label: "Early Game",
          score:
            invadeFrequency     * 0.36 +
            aggression          * 0.30 +
            (1 - scalingOrientation) * 0.22 +
            skirmishing         * 0.12,
        },
        {
          label: "Farm First",
          score:
            scalingOrientation  * 0.44 +
            safeLanePreference  * 0.32 +
            (1 - invadeFrequency) * 0.24,
        },
        {
          label: "Dive",
          score:
            towerDiveFrequency             * 0.48 +
            aggression                     * 0.22 +
            skirmishing                    * 0.14 +
            overrideScore(player, "dive", 0.26),
        },
        {
          label: "Carry Focused",
          score: resourceHeavyLabel(carryUsage) * 0.58 + mechanics * 0.24 + (1 - utilityComfort) * 0.18,
        },
        {
          label: "Volatile",
          score: highVolatileLabel(volatility) * 0.70 + (1 - consistency) * 0.30,
        },
        {
          label: "Systematic",
          score: discipline * 0.36 + riskManagement * 0.34 + consistency * 0.30,
        },
      ];
      break;
    }

    // ═════════════════════════════════════════════════════════════════════
    // MID
    // ═════════════════════════════════════════════════════════════════════
    case "mid": {
      styleCandidates = [
        {
          label: "Carry",
          score:
            carryUsage          * 0.34 +
            mechanics           * 0.18 +
            teamfighting        * 0.14 +
            laning              * 0.10 +
            aggression          * 0.10 +
            overrideScore(player, "carry", 0.14),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent    * 0.22 +
            skirmishing         * 0.18 +
            aggression          * 0.18 +
            flankPreference     * 0.12 +
            roamBias            * 0.10 +
            highRiskLabel(riskAppetite) * 0.08 +
            overrideScore(player, "engage", 0.12),
        },
        {
          label: "Controller",
          score:
            mapAwareness        * 0.22 +
            discipline          * 0.18 +
            consistency         * 0.16 +
            metaReadiness       * 0.16 +
            laning              * 0.12 +
            riskManagement      * 0.10 +
            overrideScore(player, "setup", 0.10),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation  * 0.46 +
            teamfighting        * 0.16 +
            consistency         * 0.12 +
            clutchFactor        * 0.08 +
            overrideScore(player, "frontToBack", 0.10),
        },
        // ── PATCH: new styles ─────────────────────────────────────────────
        {
          label: "Assassin",
          score:
            mechanics                    * 0.34 +
            skirmishing                  * 0.24 +
            aggression                   * 0.20 +
            highRiskLabel(riskAppetite)  * 0.12 +
            overrideScore(player, "dive", 0.16) -
            utilityComfort               * 0.12,
        },
        {
          label: "Poke",
          score:
            laning              * 0.36 +
            mechanics           * 0.22 +
            laneControlBias     * 0.18 +
            mapAwareness        * 0.12 +
            overrideScore(player, "poke", 0.46),
        },
      ];

      tagCandidates = [
        { label: "Lane Control",score: laneControlBias * 0.58 + laning * 0.42 },
        { label: "Scaling",     score: scalingOrientation * 0.70 + teamfighting * 0.30 },
        { label: "Aggressive",  score: aggression * 0.50 + highRiskLabel(riskAppetite) * 0.30 + skirmishing * 0.20 },
        { label: "Stable",      score: consistency * 0.50 + riskManagement * 0.28 + discipline * 0.22 },
        { label: "Flexible",    score: styleFlex * 0.68 + metaReadiness * 0.32 },
        { label: "Roaming",     score: roamBias * 0.58 + flankPreference * 0.22 + playmakingIntent * 0.20 },
        {
          label: "Setup",
          score: playmakingIntent * 0.26 + mapAwareness * 0.18 + overrideScore(player, "setup", 0.56),
        },
        // ── PATCH: new tags ───────────────────────────────────────────────
        {
          label: "Early Game",
          score:
            aggression           * 0.30 +
            laning               * 0.28 +
            (1 - scalingOrientation) * 0.28 +
            highRiskLabel(riskAppetite) * 0.14,
        },
        {
          label: "Late Game",
          score: scalingOrientation * 0.54 + consistency * 0.26 + discipline * 0.20,
        },
        {
          label: "Priority Lane",
          score:
            laneControlBias     * 0.44 +
            laning              * 0.32 +
            aggression          * 0.24,
        },
        {
          label: "High Risk",
          score: highRiskLabel(riskAppetite) * 0.66 + aggression * 0.20 + skirmishing * 0.14,
        },
        {
          label: "Volatile",
          score: highVolatileLabel(volatility) * 0.70 + (1 - consistency) * 0.30,
        },
        {
          label: "Systematic",
          score: discipline * 0.36 + riskManagement * 0.34 + consistency * 0.30,
        },
        {
          label: "Snowball",
          score:
            aggression           * 0.32 +
            carryUsage           * 0.28 +
            highRiskLabel(riskAppetite) * 0.24 +
            (1 - riskManagement) * 0.16,
        },
      ];
      break;
    }

    // ═════════════════════════════════════════════════════════════════════
    // ADC
    // ═════════════════════════════════════════════════════════════════════
    case "adc": {
      const selfSufficient =
        (1 - setupDependence) * 0.62 +
        riskManagement        * 0.22 +
        consistency           * 0.16;

      styleCandidates = [
        {
          label: "Carry",
          score:
            carryUsage      * 0.34 +
            teamfighting    * 0.24 +
            mechanics       * 0.14 +
            scalingOrientation * 0.08 +
            overrideScore(player, "carry", 0.12) +
            overrideScore(player, "frontToBack", 0.08),
        },
        {
          label: "Scaler",
          score:
            scalingOrientation  * 0.50 +
            teamfighting        * 0.20 +
            consistency         * 0.14 +
            clutchFactor        * 0.06 +
            overrideScore(player, "frontToBack", 0.10),
        },
        {
          label: "Lane Bully",
          score:
            laneControlBias * 0.34 +
            laning          * 0.22 +
            aggression      * 0.20 +
            highRiskLabel(riskAppetite) * 0.08 +
            overrideScore(player, "poke", 0.16),
        },
        {
          label: "Teamfighter",
          score:
            teamfighting    * 0.54 +
            consistency     * 0.16 +
            clutchFactor    * 0.10 +
            scalingOrientation * 0.12 +
            overrideScore(player, "frontToBack", 0.08),
        },
        {
          label: "Weakside",
          score:
            selfSufficient                  * 0.46 +
            resourceLightLabel(carryUsage)  * 0.24 +
            lowRiskLabel(riskAppetite)      * 0.12 +
            safeLanePreference              * 0.18,
        },
        // ── PATCH: new style ──────────────────────────────────────────────
        {
          label: "Hypercarry",
          score:
            scalingOrientation  * 0.36 +
            carryUsage          * 0.30 +
            teamfighting        * 0.22 +
            needsTeamLabel(setupDependence) * 0.18 +
            overrideScore(player, "frontToBack", 0.10) -
            aggression          * 0.08,
        },
      ];

      tagCandidates = [
        { label: "Teamfight",     score: teamfighting * 0.68 + clutchFactor * 0.16 + scalingOrientation * 0.16 },
        { label: "Scaling",       score: scalingOrientation * 0.70 + consistency * 0.12 + teamfighting * 0.18 },
        { label: "Aggressive",    score: aggression * 0.50 + highRiskLabel(riskAppetite) * 0.30 + laning * 0.20 },
        { label: "Weakside",      score: selfSufficient * 0.54 + resourceLightLabel(carryUsage) * 0.18 + safeLanePreference * 0.28 },
        { label: "Stable",        score: consistency * 0.54 + riskManagement * 0.30 + clutchFactor * 0.16 },
        { label: "Self-Sufficient",score: selfSufficient * 0.72 + lowRiskLabel(riskAppetite) * 0.28 },
        {
          label: "Poke",
          score: overrideScore(player, "poke", 0.74) + laneControlBias * 0.10 + laning * 0.16,
        },
        // ── PATCH: new tags ───────────────────────────────────────────────
        {
          label: "Late Game",
          score: scalingOrientation * 0.54 + consistency * 0.26 + discipline * 0.20,
        },
        {
          label: "Early Game",
          score:
            aggression           * 0.32 +
            laning               * 0.30 +
            (1 - scalingOrientation) * 0.24 +
            laneControlBias      * 0.14,
        },
        {
          label: "Farm First",
          score:
            scalingOrientation   * 0.44 +
            safeLanePreference   * 0.32 +
            (1 - aggression)     * 0.24,
        },
        {
          label: "Priority Lane",
          score:
            laneControlBias      * 0.44 +
            laning               * 0.32 +
            aggression           * 0.24,
        },
        {
          label: "Volatile",
          score: highVolatileLabel(volatility) * 0.70 + (1 - consistency) * 0.30,
        },
        {
          label: "Systematic",
          score: discipline * 0.36 + riskManagement * 0.34 + consistency * 0.30,
        },
      ];
      break;
    }

    // ═════════════════════════════════════════════════════════════════════
    // SUPPORT
    // ═════════════════════════════════════════════════════════════════════
    case "support": {
      styleCandidates = [
        {
          label: "Facilitator",
          score:
            utilityComfort   * 0.28 +
            mapAwareness     * 0.18 +
            discipline       * 0.12 +
            overrideScore(player, "utility", 0.18) +
            overrideScore(player, "setup", 0.14),
        },
        {
          label: "Engage",
          score:
            playmakingIntent * 0.22 +
            skirmishing      * 0.12 +
            teamfighting     * 0.10 +
            overrideScore(player, "engage", 0.26) +
            overrideScore(player, "dive", 0.10),
        },
        {
          label: "Enchanter",
          score:
            utilityComfort   * 0.24 +
            consistency      * 0.10 +
            teamfighting     * 0.08 +
            overrideScore(player, "enchanter", 0.24) +
            overrideScore(player, "frontToBack", 0.10),
        },
        {
          label: "Playmaker",
          score:
            playmakingIntent          * 0.22 +
            flankPreference           * 0.12 +
            aggression                * 0.10 +
            roamBias                  * 0.10 +
            adaptationScore(player, "creativity", 0.14) +
            overrideScore(player, "engage", 0.14),
        },
        // ── PATCH: new styles ─────────────────────────────────────────────
        {
          label: "Tank",
          score:
            discipline                        * 0.34 +
            riskManagement                    * 0.26 +
            overrideScore(player, "tank", 0.36) +
            overrideScore(player, "engage", 0.16) -
            utilityComfort                    * 0.10,
        },
        {
          label: "Lane Bully",
          score:
            laning           * 0.36 +
            aggression       * 0.26 +
            laneControlBias  * 0.20 +
            overrideScore(player, "poke", 0.18),
        },
      ];

      tagCandidates = [
        { label: "Utility",       score: utilityComfort * 0.54 + overrideScore(player, "utility", 0.46) },
        {
          label: "Roaming",
          score:
            roamBias             * 0.34 +
            rotationTiming       * 0.28 +
            playmakingIntent     * 0.12 +
            adaptationScore(player, "creativity", 0.12) +
            overrideScore(player, "engage", 0.14),
        },
        {
          label: "Setup",
          score:
            playmakingIntent     * 0.18 +
            overrideScore(player, "setup", 0.62) +
            overrideScore(player, "engage", 0.20),
        },
        {
          label: "Peel",
          score:
            utilityComfort       * 0.16 +
            consistency          * 0.12 +
            overrideScore(player, "enchanter", 0.44) +
            overrideScore(player, "frontToBack", 0.28),
        },
        { label: "Vision",    score: mapAwareness * 0.62 + discipline * 0.16 + utilityComfort * 0.22 },
        {
          label: "Creative",
          score:
            adaptationScore(player, "creativity", 0.62) +
            styleFlex            * 0.18 +
            playmakingIntent     * 0.20,
        },
        { label: "Stable",    score: consistency * 0.54 + riskManagement * 0.30 + discipline * 0.16 },
        {
          label: "Lane Pressure",
          score:
            laning               * 0.42 +
            playmakingIntent     * 0.22 +
            overrideScore(player, "engage", 0.14) +
            overrideScore(player, "poke", 0.22),
        },
        // ── PATCH: new tags ───────────────────────────────────────────────
        {
          label: "Aggressive",
          score:
            aggression           * 0.46 +
            highRiskLabel(riskAppetite) * 0.28 +
            laning               * 0.16 +
            towerDiveFrequency   * 0.10,
        },
        {
          label: "Early Game",
          score:
            aggression           * 0.32 +
            laning               * 0.30 +
            (1 - scalingOrientation) * 0.24 +
            laneControlBias      * 0.14,
        },
        {
          label: "Volatile",
          score: highVolatileLabel(volatility) * 0.70 + (1 - consistency) * 0.30,
        },
        {
          label: "Systematic",
          score: discipline * 0.36 + riskManagement * 0.34 + consistency * 0.30,
        },
      ];
      break;
    }
  }

  // ─── Resolve primary and secondary display styles ────────────────────────
  const sortedStyles = sortByScoreDesc(styleCandidates);
  const primaryStyle = sortedStyles[0]?.label ?? "Flexible";

  // ── PATCH: raised threshold 0.42 → 0.50 ──────────────────────────────────
  const derivedSecondary =
    sortedStyles[1] && sortedStyles[1].score >= 0.50
      ? sortedStyles[1].label
      : byRoleFallback[role].secondary;

  const overriddenSecondary = toDisplayStyleLabel(player.playstyleIdentity?.secondary);
  // Fix 1: Only use the overridden secondary if it's a valid display label for this role.
  // Prevents internal labels like "assassin" from bleeding through to support/adc cards.
  const validDisplaySecondaries = ROLE_VALID_DISPLAY_SECONDARIES[role];
  const sanitizedSecondary = overriddenSecondary && validDisplaySecondaries.has(overriddenSecondary)
    ? overriddenSecondary
    : undefined;

  const secondaryStyle =
    sanitizedSecondary && sanitizedSecondary !== primaryStyle
      ? sanitizedSecondary
      : derivedSecondary;

  // ─── Resolve tags ─────────────────────────────────────────────────────────
  const tags = pickTopTagLabels(
    tagCandidates,
    [primaryStyle, secondaryStyle],
    byRoleFallback[role].tags,
    3,
  );

  // ── Apply playerProfileOverrides tag/primary overrides ───────────────────
  const profileOverride = playerProfileOverrides[player.id];

  const finalPrimary = profileOverride?.primaryDisplayOverride ?? primaryStyle;

  // Step 1: override adds have priority — go in first
  const priorityTags: string[] = [];
  if (profileOverride?.tagOverrides?.add) {
    for (const t of profileOverride.tagOverrides.add) {
      uniquePush(priorityTags, t);
    }
  }

  // Step 2: fill remaining slots from auto-derived tags, skipping removes
  const toRemove = new Set(profileOverride?.tagOverrides?.remove ?? []);
  const autoTags = tags.filter((t) => !toRemove.has(t));

  const finalTags: string[] = [...priorityTags];
  for (const t of autoTags) {
    if (finalTags.length >= 3) break;
    uniquePush(finalTags, t);
  }

  // ── FIX 1: Mutual exclusion ───────────────────────────────────────────────
  // Tags in the same semantic group contradict each other.
  // Keep only the first (highest priority) — override tags always beat auto-derived.
  const TAG_EXCLUSION_GROUPS: string[][] = [
    ["Stable", "Systematic"],     // redundant — same stat base, pick one
    ["Early Game", "Late Game"],  // logically impossible simultaneously
    ["Snowball", "Systematic"],   // character contradiction
    ["Volatile", "Stable"],       // direct contradiction
    ["Volatile", "Systematic"],   // direct contradiction
  ];

  for (const group of TAG_EXCLUSION_GROUPS) {
    const inGroup = group.filter((g) => finalTags.includes(g));
    if (inGroup.length > 1) {
      for (let i = 1; i < inGroup.length; i++) {
        const idx = finalTags.indexOf(inGroup[i]!);
        if (idx !== -1) finalTags.splice(idx, 1);
      }
    }
  }

  // ── FIX 2: Style-tag coherence ────────────────────────────────────────────
  // Certain tags contradict the primary/secondary playstyle.
  // Only removes auto-derived tags — override (priority) tags are protected.
  const activeStyles = new Set([finalPrimary, secondaryStyle]);
  const prioritySet = new Set(priorityTags);

  const AGGRESSIVE_STYLES = new Set([
    "Aggressive", "Brawler", "Assassin", "Lane Bully",
  ]);
  const SCALING_STYLES = new Set([
    "Scaler", "Farmer", "Weakside", "Hypercarry",
  ]);
  const STABLE_STYLES = new Set([
    "Tank", "Facilitator", "Enchanter", "Controller", "Setup",
  ]);

  const coherenceRemovals = new Set<string>();

  for (const style of activeStyles) {
    if (!style) continue;
    if (AGGRESSIVE_STYLES.has(style)) {
      coherenceRemovals.add("Stable");
      coherenceRemovals.add("Systematic");
    }
    if (SCALING_STYLES.has(style)) {
      coherenceRemovals.add("Early Game");
      coherenceRemovals.add("Snowball");
      coherenceRemovals.add("Invader");
    }
    if (STABLE_STYLES.has(style)) {
      coherenceRemovals.add("Volatile");
      coherenceRemovals.add("High Risk");
      coherenceRemovals.add("Snowball");
    }
  }

  for (const tag of coherenceRemovals) {
    if (prioritySet.has(tag)) continue; // override tags sunt protejate
    const idx = finalTags.indexOf(tag);
    if (idx !== -1) finalTags.splice(idx, 1);
  }

  // Fix 2: If coherence removal left fewer than 3 tags, fill remaining slots
  // from a role-specific reserve pool — ordered by relevance, skip anything
  // already present, excluded by style, or contradicted by coherenceRemovals.
  if (finalTags.length < 3) {
    const ROLE_RESERVE_TAGS: Record<Player["role"], string[]> = {
      top:     ["Stable", "Flexible", "Scaling", "Teamfight", "Counterpick"],
      jungle:  ["Objective", "Tempo", "Stable", "Pathing", "Scaling"],
      mid:     ["Stable", "Flexible", "Lane Control", "Scaling", "Roaming"],
      adc:     ["Teamfight", "Stable", "Scaling", "Self-Sufficient", "Flexible"],
      support: ["Utility", "Vision", "Stable", "Roaming", "Peel"],
    };

    const reserve = ROLE_RESERVE_TAGS[role] ?? [];
    for (const tag of reserve) {
      if (finalTags.length >= 3) break;
      if (finalTags.includes(tag)) continue;
      if (coherenceRemovals.has(tag)) continue; // still contradicted
      if ([primaryStyle, secondaryStyle].some(
        (s) => s?.toLowerCase() === tag.toLowerCase()
      )) continue; // same as a style label
      uniquePush(finalTags, tag);
    }
  }

  return {
    primary: finalPrimary,
    secondary: secondaryStyle,
    tags: finalTags,
  };
}