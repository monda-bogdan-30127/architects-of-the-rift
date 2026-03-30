import { championProfileOverrides } from "@/app/data/championProfileOverrides";
import type { Champion, ChampionRoleProfile, ChampionSynergyRule, Role } from "@/app/types/champion";
import type { CompAttribute } from "@/app/types/compAttributes";

const clamp = (value: number, min = 0, max = 10) => Math.max(min, Math.min(max, value));
const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

function lanePressureValue(champion: Champion, role: Role) {
  const waveclear = offer(champion, "waveclear") * 2;
  const poke = offer(champion, "poke") * 2;
  const pick = offer(champion, "pick") * 2;
  const engage = offer(champion, "engage") * 2;
  const roamPressure = offer(champion, "roamPressure") * 2;
  const sustainedDamage = offer(champion, "sustainedDamage") * 2;

  switch (role) {
    case "mid":
      return clamp(avg([waveclear, poke, pick, roamPressure, 5]));
    case "support":
      return clamp(avg([poke, pick, engage, roamPressure, 4]));
    case "adc":
      return clamp(avg([poke, sustainedDamage, waveclear, 4]));
    case "top":
      return clamp(avg([waveclear, poke, engage, 4]));
    case "jungle":
      return clamp(avg([engage, pick, roamPressure, 4]));
    default:
      return clamp(avg([waveclear, poke, pick, 4]));
  }
}

function offer(champion: Champion, type: CompAttribute) {
  return champion.offers.find((entry) => entry.type === type)?.strength ?? 0;
}

function needPriority(champion: Champion, type: CompAttribute) {
  return champion.needs.find((entry) => entry.type === type)?.priority ?? 0;
}

function hasRole(champion: Champion, role: Role) {
  return champion.roles.includes(role);
}

function toTags(champion: Champion, role: Role): string[] {
  const tags = new Set<string>(champion.championTags ?? []);
  if (role === "adc" || offer(champion, "poke") >= 3) tags.add("ranged");
  if (!tags.has("ranged")) tags.add("melee");
  if (offer(champion, "frontline") >= 3) tags.add("frontline");
  if (offer(champion, "engage") >= 3) tags.add("engage");
  if (offer(champion, "dive") >= 3 || offer(champion, "backlineAccess") >= 3) tags.add("dive");
  if (offer(champion, "pick") >= 3) tags.add("pick");
  if (offer(champion, "poke") >= 3) tags.add("poke");
  if (offer(champion, "sustainedDamage") >= 4) tags.add("dps");
  if (offer(champion, "burstDamage") >= 4) tags.add("burst");
  if (offer(champion, "peel") >= 3) tags.add("peel");
  if (offer(champion, "antiDive") >= 3) tags.add("anti-dive");
  if (offer(champion, "waveclear") >= 3) tags.add("waveclear");
  if (offer(champion, "objectiveControl") >= 3) tags.add("objectiveControl");
  if (champion.carryProfile?.selfPeel || champion.carryProfile?.selfSave) tags.add("self-sufficient");
  if (role === "support" && offer(champion, "peel") >= 3) tags.add("warden");
  if (role === "support" && offer(champion, "peel") >= 3 && offer(champion, "engage") <= 2) tags.add("enchanter");
  if (offer(champion, "followUp") >= 3) tags.add("follow-up");
  if (offer(champion, "zoneControl") >= 3) tags.add("zone-control");
  return Array.from(tags);
}

function buildSynergyRules(champion: Champion): ChampionRoleProfile["synergy"] {
  const wantsAllies: ChampionSynergyRule[] = [];
  const wantsTeam: ChampionSynergyRule[] = [];
  const goodVs: ChampionSynergyRule[] = [];
  const weakVs: ChampionSynergyRule[] = [];
  const goodWith: ChampionSynergyRule[] = [];
  const mustWith: ChampionSynergyRule[] = [];

  if (needPriority(champion, "frontline") >= 2) {
    wantsTeam.push({
      id: `${champion.id}-needs-frontline`,
      type: "team",
      targetTags: ["frontline"],
      minCount: 1,
      effect: { score: 4 + needPriority(champion, "frontline"), reason: "Needs frontline structure" },
    });
  }

  if (needPriority(champion, "peel") >= 2) {
    wantsAllies.push({
      id: `${champion.id}-needs-peel`,
      type: "ally",
      targetTags: ["peel", "warden", "enchanter"],
      effect: { score: 4 + needPriority(champion, "peel"), reason: "Needs allied protection" },
    });
  }

  if (needPriority(champion, "engage") >= 2) {
    wantsAllies.push({
      id: `${champion.id}-needs-engage`,
      type: "ally",
      targetTags: ["engage", "pick", "setup", "follow-up"],
      effect: { score: 4 + needPriority(champion, "engage"), reason: "Needs allied setup / engage" },
    });
  }

  for (const relation of champion.synergyWith) {
    goodWith.push({
      id: `${champion.id}-goodwith-${relation.championId}`,
      type: "ally",
      targetChampionIds: [relation.championId],
      effect: { score: relation.score ?? 4, reason: "Known champion synergy" },
    });
  }

  for (const relation of champion.mustWith) {
    mustWith.push({
      id: `${champion.id}-mustwith-${relation.championId}`,
      type: "ally",
      targetChampionIds: [relation.championId],
      effect: { score: relation.score ?? 6, reason: "High-value structural pairing" },
    });
  }

  for (const relation of champion.goodVs) {
    goodVs.push({
      id: `${champion.id}-goodvs-${relation.championId}`,
      type: "enemy",
      targetChampionIds: [relation.championId],
      effect: { score: relation.score ?? 4, reason: "Positive matchup signal" },
    });
  }

  for (const relation of champion.weakVs) {
    weakVs.push({
      id: `${champion.id}-weakvs-${relation.championId}`,
      type: "enemy",
      targetChampionIds: [relation.championId],
      effect: { score: -(relation.score ?? 4), reason: "Negative matchup signal" },
    });
  }

  if (champion.id === "sejuani") {
    wantsTeam.push({
      id: "sejuani-melee-density",
      type: "team",
      targetTags: ["melee"],
      scalingByCount: [
        { count: 1, score: 2 },
        { count: 2, score: 6 },
        { count: 3, score: 10 },
      ],
      effect: { score: 0, reason: "Passive and stack access improve with melee allies" },
    });
  }

  if (champion.id === "zeri") {
    wantsTeam.push({
      id: "zeri-protection-shell",
      type: "team",
      targetTags: ["frontline", "enchanter", "warden"],
      minCount: 2,
      effect: { score: 8, reason: "Needs real protection structure to unlock full value" },
    });
  }

  if (champion.id === "xin-zhao") {
    goodWith.push({
      id: "xin-enchanter-shell",
      type: "ally",
      targetTags: ["enchanter", "shielding", "healing"],
      effect: { score: 6, reason: "Protection extends commit windows" },
    });
  }

  return { wantsAllies, wantsTeam, goodVs, weakVs, goodWith, mustWith };
}

function getOverride(champion: Champion, role: Role) {
  return championProfileOverrides[`${champion.id}:${role}`];
}

export function deriveChampionRoleProfile(champion: Champion, role: Role): ChampionRoleProfile {
  const baseDamageBurst = offer(champion, "burstDamage") * 2;
  const baseDamageDps = offer(champion, "sustainedDamage") * 2;
  const baseDamagePoke = offer(champion, "poke") * 2;
  const engage = offer(champion, "engage") * 2;
  const peel = offer(champion, "peel") * 2;
  const antiDive = offer(champion, "antiDive") * 2;
  const pick = offer(champion, "pick") * 2;
  const reliableCC = offer(champion, "reliableCC") * 2;
  const waveclear = offer(champion, "waveclear") * 2;
  const scaling = offer(champion, "scaling") * 2;
  const dive = offer(champion, "dive") * 2;
  const backline = offer(champion, "backlineAccess") * 2;

  const tags = toTags(champion, role);
  const executionLoad = avg(Object.values(champion.playerScaling ?? {}) as number[]) || 3.5;

  const profile: ChampionRoleProfile = {
    role,
    tags,
    abilities: [],
    damageProfileDetailed: {
      burst: clamp(baseDamageBurst || (role === "mid" ? 6 : 3)),
      dps: clamp(baseDamageDps || (role === "adc" ? 8 : 3)),
      poke: clamp(baseDamagePoke || (waveclear >= 6 ? 4 : 1)),
      execute: clamp(champion.id === "veigar" ? 9 : 0),
    },
    damageDelivery: {
      uptime: clamp(avg([baseDamageDps, scaling, role === "adc" ? 8 : 3])),
      reliability: clamp(avg([baseDamageBurst, baseDamageDps, reliableCC, 5])),
      aoe: clamp(avg([waveclear, pick, champion.id === "orianna" ? 8 : 2])),
    },
    ccProfile: {
      hard: clamp(avg([engage, pick, reliableCC])),
      soft: clamp(avg([offer(champion, "zoneControl") * 2, peel, 2])),
      pick: clamp(pick),
      lockdown: clamp(avg([reliableCC, engage, pick])),
      chainPotential: clamp(avg([reliableCC, pick, offer(champion, "followUp") * 2])),
    },
    peelProfile: {
      disengage: clamp(offer(champion, "disengage") * 2),
      antiDive: clamp(antiDive),
      bodyguard: clamp(peel),
      shield: clamp(role === "support" && peel >= 6 ? 6 : 0),
      resetProtection: clamp(avg([peel, antiDive, offer(champion, "disengage") * 2])),
    },
    accessProfile: {
      engageRange: clamp(avg([engage, pick, role === "support" ? 4 : 5])),
      targetAccess: clamp(avg([dive, backline, role === "adc" ? 4 : 5])),
      stickiness: clamp(avg([dive, backline, engage])),
    },
    special: {
      antiDash: 0,
      projectileBlock: champion.id === "braum" ? 10 : 0,
      ground: champion.id === "cassiopeia" ? 10 : 0,
      displacement: clamp(avg([pick, engage])),
      visionControl: clamp(avg([offer(champion, "roamPressure") * 2, offer(champion, "pick") * 2, 2])),
    },
    threatProfile: {
      backlineThreat: clamp(avg([dive, backline, baseDamageBurst])),
      frontlineThreat: clamp(avg([baseDamageDps, scaling, reliableCC])),
      pickThreat: clamp(avg([pick, reliableCC, baseDamageBurst])),
      zoneThreat: clamp(avg([offer(champion, "zoneControl") * 2, waveclear, pick])),
      antiDiveThreat: clamp(avg([antiDive, peel, offer(champion, "disengage") * 2])),
    },
    scaling: {
      early: { power: clamp(avg([lanePressureValue(champion, role), engage, dive, 4])), execution: clamp(4 + executionLoad * 1.1) },
      mid: { power: clamp(avg([engage, pick, baseDamageBurst, waveclear, 5])), execution: clamp(4.5 + executionLoad * 1.15) },
      late: { power: clamp(avg([scaling, baseDamageDps, pick, 5])), execution: clamp(5 + executionLoad * 1.2) },
    },
    phaseIdentity: {
      earlyRole: role === "adc" ? "secondary-carry" : role === "support" ? "utility" : "carry",
      midRole: role === "support" ? "setup" : role === "jungle" ? "pick" : "carry",
      lateRole: role === "adc" ? "carry" : role === "support" ? "peel" : role === "top" && tags.includes("frontline") ? "tank" : "carry",
    },
    conditions: {
      requiresFrontline: needPriority(champion, "frontline") >= 2,
      requiresSetup: needPriority(champion, "engage") >= 2,
      requiresPeel: needPriority(champion, "peel") >= 2,
      requiresEngage: needPriority(champion, "engage") >= 2,
      requiresFollowUp: offer(champion, "followUp") >= 3,
    },
    interactionProfile: {
      counters: [],
      counteredBy: [],
    },
    draftProfile: {
      flexValue: champion.roles.length >= 2 ? 7 : 2,
      blindPick: clamp(((champion.stats.blindPickRate ?? 40) / 10), 0, 10),
      contestPriority: clamp(getContestPriority(champion), 0, 10),
    },
    comboDependency: {
      needsKnockup: champion.id === "yasuo" ? 9 : 0,
      needsEngage: needPriority(champion, "engage") >= 2 ? 6 : 0,
      needsFrontline: needPriority(champion, "frontline") >= 2 ? 6 : 0,
      needsPeel: needPriority(champion, "peel") >= 2 ? 6 : 0,
      needsEnchanter: champion.id === "zeri" || champion.id === "xin-zhao" ? 7 : 0,
    },
    synergy: buildSynergyRules(champion),
    roleSpecific: buildRoleSpecific(role, champion),
  };

  const override = getOverride(champion, role);
  if (!override) return profile;
  return {
    ...profile,
    ...override,
    damageProfileDetailed: { ...profile.damageProfileDetailed, ...(override.damageProfileDetailed ?? {}) },
    damageDelivery: { ...profile.damageDelivery, ...(override.damageDelivery ?? {}) },
    ccProfile: { ...profile.ccProfile, ...(override.ccProfile ?? {}) },
    peelProfile: { ...profile.peelProfile, ...(override.peelProfile ?? {}) },
    accessProfile: { ...profile.accessProfile, ...(override.accessProfile ?? {}) },
    special: { ...profile.special, ...(override.special ?? {}) },
    threatProfile: { ...profile.threatProfile, ...(override.threatProfile ?? {}) },
    scaling: {
      early: { ...profile.scaling.early, ...(override.scaling?.early ?? {}) },
      mid: { ...profile.scaling.mid, ...(override.scaling?.mid ?? {}) },
      late: { ...profile.scaling.late, ...(override.scaling?.late ?? {}) },
    },
    phaseIdentity: { ...profile.phaseIdentity, ...(override.phaseIdentity ?? {}) },
    conditions: { ...profile.conditions, ...(override.conditions ?? {}) },
    interactionProfile: { ...profile.interactionProfile, ...(override.interactionProfile ?? {}) },
    draftProfile: { ...profile.draftProfile, ...(override.draftProfile ?? {}) },
    comboDependency: { ...profile.comboDependency, ...(override.comboDependency ?? {}) },
    synergy: {
      wantsAllies: override.synergy?.wantsAllies ?? profile.synergy.wantsAllies,
      wantsTeam: override.synergy?.wantsTeam ?? profile.synergy.wantsTeam,
      goodVs: override.synergy?.goodVs ?? profile.synergy.goodVs,
      weakVs: override.synergy?.weakVs ?? profile.synergy.weakVs,
      goodWith: override.synergy?.goodWith ?? profile.synergy.goodWith,
      mustWith: override.synergy?.mustWith ?? profile.synergy.mustWith,
    },
    roleSpecific: {
      ...(profile.roleSpecific ?? {}),
      ...(override.roleSpecific ?? {}),
    },
  };
}

function buildRoleSpecific(role: Role, champion: Champion): ChampionRoleProfile["roleSpecific"] {
  switch (role) {
    case "jungle":
      return { jungle: {
        clearSpeed: clamp(avg([offer(champion, "waveclear") * 2, offer(champion, "objectiveControl") * 2, 4])),
        healthAfterClear: clamp(avg([offer(champion, "frontline") * 2, offer(champion, "peel") * 2, 5])),
        gankPower: clamp(avg([offer(champion, "engage") * 2, offer(champion, "pick") * 2, offer(champion, "roamPressure") * 2])),
        objectiveControl: clamp(offer(champion, "objectiveControl") * 2),
        invade: clamp(avg([lanePressureValue(champion, role), offer(champion, "burstDamage") * 2, 4])),
      } };
    case "support":
      return { support: {
        lanePressure: clamp(avg([lanePressureValue(champion, role), offer(champion, "poke") * 2, offer(champion, "pick") * 2])),
        roamValue: clamp(avg([offer(champion, "roamPressure") * 2, offer(champion, "pick") * 2, 4])),
        visionControl: clamp(avg([offer(champion, "pick") * 2, offer(champion, "roamPressure") * 2, 5])),
        peelExecution: clamp(avg([offer(champion, "peel") * 2, offer(champion, "antiDive") * 2, 4])),
      } };
    case "adc":
      return { adc: {
        laneSafety: clamp(avg([offer(champion, "disengage") * 2, offer(champion, "poke") * 2, 4])),
        spacingBurden: clamp(avg([offer(champion, "sustainedDamage") * 2, offer(champion, "scaling") * 2, 6])),
        sustainedFightValue: clamp(avg([offer(champion, "sustainedDamage") * 2, offer(champion, "scaling") * 2, offer(champion, "followUp") * 2])),
      } };
    case "top":
      return { top: {
        sideLaneControl: clamp(avg([offer(champion, "sideLanePressure") * 2, offer(champion, "burstDamage") * 2, 4])),
        blindStability: clamp((champion.stats.blindPickRate ?? 40) / 10, 0, 10),
        weaksideTolerance: clamp(avg([offer(champion, "frontline") * 2, offer(champion, "disengage") * 2, 5])),
      } };
    case "mid":
      return { mid: {
        waveControl: clamp(avg([offer(champion, "waveclear") * 2, lanePressureValue(champion, role), 5])),
        setupPower: clamp(avg([offer(champion, "pick") * 2, offer(champion, "followUp") * 2, offer(champion, "engage") * 2])),
        roamPressure: clamp(avg([offer(champion, "roamPressure") * 2, offer(champion, "pick") * 2, 4])),
      } };
    default:
      return undefined;
  }
}

function getContestPriority(champion: Champion) {
  const presence = Math.max(champion.stats.presence ?? 0, champion.stats.picks + champion.stats.bans);
  const avgPickRound = champion.stats.avgPickRound ?? 3;
  return presence / 12 + (6 - Math.min(5, avgPickRound));
}

export function getChampionRoleProfile(champion: Champion | null, requestedRole?: Role | null) {
  if (!champion) return null;
  const role = requestedRole && hasRole(champion, requestedRole) ? requestedRole : champion.roles[0] ?? null;
  if (!role) return null;
  if (champion.roleProfiles?.length) {
    const existing = champion.roleProfiles.find((profile) => profile.role === role) ?? champion.roleProfiles[0];
    if (existing) return existing;
  }
  return deriveChampionRoleProfile(champion, role);
}
