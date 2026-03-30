// draftTypes.ts

export type Side = "blue" | "red";
export type Action = "pick" | "ban";

export interface DraftStep {
  label: string;
  side: Side;
  action: Action;
}

export const DRAFT_SEQUENCE: DraftStep[] = [
  // Bans 1
  { label: "B1", side: "blue", action: "ban" },
  { label: "R1", side: "red", action: "ban" },
  { label: "B2", side: "blue", action: "ban" },
  { label: "R2", side: "red", action: "ban" },
  { label: "B3", side: "blue", action: "ban" },
  { label: "R3", side: "red", action: "ban" },

  // Picks 1
  { label: "B1", side: "blue", action: "pick" },
  { label: "R1", side: "red", action: "pick" },
  { label: "R2", side: "red", action: "pick" },
  { label: "B2", side: "blue", action: "pick" },
  { label: "B3", side: "blue", action: "pick" },

  // Bans 2
  { label: "R4", side: "red", action: "ban" },
  { label: "B4", side: "blue", action: "ban" },
  { label: "R5", side: "red", action: "ban" },
  { label: "B5", side: "blue", action: "ban" },

  // Picks 2
  { label: "R3", side: "red", action: "pick" },
  { label: "B4", side: "blue", action: "pick" },
  { label: "R4", side: "red", action: "pick" },
  { label: "B5", side: "blue", action: "pick" },
];
