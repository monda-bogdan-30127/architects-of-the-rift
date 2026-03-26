export type PlayoffRound = "quarters" | "semis" | "finals";

export type FinalsMvpResult = {
  playerName: string;
  team: string;
  grade: number;
};

export type PlayoffDialogState = {
  open: boolean;
  round: PlayoffRound;
  results: string[];
  finalsMvp?: FinalsMvpResult;
};
