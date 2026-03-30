export type TeamIdentity = {
  preferredStyles: Array<"front-to-back" | "pick" | "dive" | "poke" | "teamfight" | "balanced">;
  preferredTags: string[];
  avoidTags?: string[];
  riskLevel: number;
  creativity: number;
  discipline: number;
  comfortBias: number;
  flexBias: number;
  counterpickBias: number;
  earlyPriorityBias: number;
};

export type Team = {
  id: string;
  slug: string;
  name: string;
  abbreviation: string;
  region: "lck";
  logo: string;
  sortOrder: number;
  identity?: TeamIdentity;
  isPlayerControlled?: boolean;
};
