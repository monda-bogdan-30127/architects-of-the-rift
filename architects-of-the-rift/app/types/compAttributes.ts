// Global comp attributes used by champion offers / needs / weaknesses and team evaluation.

export const COMP_ATTRIBUTE_ORDER = [
  'frontline',
  'peel',
  'antiDive',
  'disengage',
  'zoneControl',
  'engage',
  'pick',
  'reliableCC',
  'followUp',
  'dive',
  'backlineAccess',
  'burstDamage',
  'sustainedDamage',
  'poke',
  'waveclear',
  'depush',
  'earlyPrio',
  'roamPressure',
  'objectiveControl',
  'siege',
  'splitpush',
  'sideLanePressure',
  'scaling',
] as const;

export type CompAttribute = (typeof COMP_ATTRIBUTE_ORDER)[number];

export type CompAttributeCategory =
  | 'defense'
  | 'engage'
  | 'damage'
  | 'lane'
  | 'macro';

export type CompAttributeInfo = {
  label: string;
  shortLabel: string;
  category: CompAttributeCategory;
  offerPositiveLabel: string;
  needLabel: string;
  weaknessLabel: string;
};

export const COMP_ATTRIBUTE_INFO: Record<CompAttribute, CompAttributeInfo> = {
  frontline: {
    label: 'Frontline',
    shortLabel: 'Frontline',
    category: 'defense',
    offerPositiveLabel: 'Frontline',
    needLabel: 'Frontline',
    weaknessLabel: 'Lacks frontline into',
  },
  peel: {
    label: 'Peel',
    shortLabel: 'Peel',
    category: 'defense',
    offerPositiveLabel: 'Peel',
    needLabel: 'Peel',
    weaknessLabel: 'Struggles into peel',
  },
  antiDive: {
    label: 'Anti-dive',
    shortLabel: 'Anti-dive',
    category: 'defense',
    offerPositiveLabel: 'Anti-dive',
    needLabel: 'Anti-dive',
    weaknessLabel: 'Struggles into anti-dive',
  },
  disengage: {
    label: 'Disengage',
    shortLabel: 'Disengage',
    category: 'defense',
    offerPositiveLabel: 'Disengage',
    needLabel: 'Disengage',
    weaknessLabel: 'Struggles into disengage',
  },
  zoneControl: {
    label: 'Zone control',
    shortLabel: 'Zone control',
    category: 'defense',
    offerPositiveLabel: 'Zone control',
    needLabel: 'Zone control',
    weaknessLabel: 'Struggles into zone control',
  },
  engage: {
    label: 'Engage',
    shortLabel: 'Engage',
    category: 'engage',
    offerPositiveLabel: 'Engage',
    needLabel: 'Engage',
    weaknessLabel: 'Can lose to engage',
  },
  pick: {
    label: 'Pick',
    shortLabel: 'Pick',
    category: 'engage',
    offerPositiveLabel: 'Pick',
    needLabel: 'Pick',
    weaknessLabel: 'Can lose to pick',
  },
  reliableCC: {
    label: 'Reliable CC',
    shortLabel: 'Reliable CC',
    category: 'engage',
    offerPositiveLabel: 'Reliable CC',
    needLabel: 'Reliable CC',
    weaknessLabel: 'Can lose to reliable CC',
  },
  followUp: {
    label: 'Follow-up',
    shortLabel: 'Follow-up',
    category: 'engage',
    offerPositiveLabel: 'Follow-up',
    needLabel: 'Follow-up',
    weaknessLabel: 'Can lose to strong follow-up',
  },
  dive: {
    label: 'Dive',
    shortLabel: 'Dive',
    category: 'engage',
    offerPositiveLabel: 'Dive',
    needLabel: 'Dive',
    weaknessLabel: 'Can lose to dive',
  },
  backlineAccess: {
    label: 'Backline access',
    shortLabel: 'Backline access',
    category: 'engage',
    offerPositiveLabel: 'Backline access',
    needLabel: 'Backline access',
    weaknessLabel: 'Can lose to backline access',
  },
  burstDamage: {
    label: 'Burst damage',
    shortLabel: 'Burst',
    category: 'damage',
    offerPositiveLabel: 'Burst damage',
    needLabel: 'Burst damage',
    weaknessLabel: 'Can lose to burst damage',
  },
  sustainedDamage: {
    label: 'Sustained damage',
    shortLabel: 'Sustained dmg',
    category: 'damage',
    offerPositiveLabel: 'Sustained damage',
    needLabel: 'Sustained damage',
    weaknessLabel: 'Can lose to sustained damage',
  },
  poke: {
    label: 'Poke',
    shortLabel: 'Poke',
    category: 'damage',
    offerPositiveLabel: 'Poke',
    needLabel: 'Poke',
    weaknessLabel: 'Can lose to poke',
  },
  waveclear: {
    label: 'Waveclear',
    shortLabel: 'Waveclear',
    category: 'lane',
    offerPositiveLabel: 'Waveclear',
    needLabel: 'Waveclear',
    weaknessLabel: 'Can lose to waveclear',
  },
  depush: {
    label: 'Depush',
    shortLabel: 'Depush',
    category: 'lane',
    offerPositiveLabel: 'Depush',
    needLabel: 'Depush',
    weaknessLabel: 'Can lose to depush',
  },
  earlyPrio: {
    label: 'Early prio',
    shortLabel: 'Early prio',
    category: 'lane',
    offerPositiveLabel: 'Early prio',
    needLabel: 'Early prio',
    weaknessLabel: 'Can lose to early prio',
  },
  roamPressure: {
    label: 'Roam pressure',
    shortLabel: 'Roam pressure',
    category: 'lane',
    offerPositiveLabel: 'Roam pressure',
    needLabel: 'Roam pressure',
    weaknessLabel: 'Can lose to roam pressure',
  },
  objectiveControl: {
    label: 'Objective control',
    shortLabel: 'Objectives',
    category: 'macro',
    offerPositiveLabel: 'Objective control',
    needLabel: 'Objective control',
    weaknessLabel: 'Can lose on objective control',
  },
  siege: {
    label: 'Siege',
    shortLabel: 'Siege',
    category: 'macro',
    offerPositiveLabel: 'Siege',
    needLabel: 'Siege',
    weaknessLabel: 'Can lose to siege',
  },
  splitpush: {
    label: 'Splitpush',
    shortLabel: 'Splitpush',
    category: 'macro',
    offerPositiveLabel: 'Splitpush',
    needLabel: 'Splitpush',
    weaknessLabel: 'Can lose to splitpush',
  },
  sideLanePressure: {
    label: 'Side lane pressure',
    shortLabel: 'Side lane',
    category: 'macro',
    offerPositiveLabel: 'Side lane pressure',
    needLabel: 'Side lane pressure',
    weaknessLabel: 'Can lose to side lane pressure',
  },
  scaling: {
    label: 'Scaling',
    shortLabel: 'Scaling',
    category: 'macro',
    offerPositiveLabel: 'Scaling',
    needLabel: 'Scaling',
    weaknessLabel: 'Can lose to scaling',
  },
};

export const OFFER_STRENGTH_LABEL: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Minor',
  2: 'Some',
  3: 'Good',
  4: 'Very good',
  5: 'Great',
};

export const NEED_PRIORITY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'Benefits from',
  2: 'Prefers',
  3: 'Needs',
};

export const WEAKNESS_SEVERITY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'Minor risk into',
  2: 'Risky into',
  3: 'Very risky into',
};

export const ATTRIBUTE_COUNTERS: Partial<Record<CompAttribute, CompAttribute[]>> = {
  dive: ['peel', 'antiDive', 'disengage', 'frontline'],
  backlineAccess: ['peel', 'antiDive', 'frontline', 'reliableCC'],
  engage: ['disengage', 'peel', 'zoneControl', 'frontline'],
  pick: ['peel', 'frontline', 'disengage'],
  burstDamage: ['frontline', 'peel', 'antiDive'],
  sustainedDamage: ['frontline', 'zoneControl', 'disengage', 'burstDamage'],
  poke: ['engage', 'waveclear', 'zoneControl'],
  zoneControl: ['poke', 'engage', 'waveclear'],
  splitpush: ['sideLanePressure', 'waveclear', 'pick'],
  sideLanePressure: ['sideLanePressure', 'waveclear', 'pick'],
  siege: ['waveclear', 'engage', 'pick'],
  earlyPrio: ['waveclear', 'frontline', 'roamPressure'],
  roamPressure: ['waveclear', 'reliableCC', 'frontline'],
  objectiveControl: ['pick', 'zoneControl', 'frontline'],
  scaling: ['earlyPrio', 'objectiveControl', 'sideLanePressure'],
};

export const getAttributeCounters = (attribute: CompAttribute): CompAttribute[] => {
  return ATTRIBUTE_COUNTERS[attribute] ?? [];
};

export const ATTRIBUTE_THREAT_LABEL: Record<CompAttribute, string> = {
  frontline: 'heavy frontline',
  peel: 'strong peel',
  antiDive: 'anti-dive',
  disengage: 'disengage',
  zoneControl: 'zone control',
  engage: 'engage',
  pick: 'pick threat',
  reliableCC: 'reliable CC',
  followUp: 'follow-up',
  dive: 'dive',
  backlineAccess: 'backline access',
  burstDamage: 'burst damage',
  sustainedDamage: 'sustained damage',
  poke: 'poke',
  waveclear: 'waveclear',
  depush: 'depush',
  earlyPrio: 'early prio',
  roamPressure: 'roam pressure',
  objectiveControl: 'objective control',
  siege: 'siege',
  splitpush: 'splitpush',
  sideLanePressure: 'side-lane pressure',
  scaling: 'scaling',
};
