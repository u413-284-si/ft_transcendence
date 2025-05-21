export type BracketLayout = {
  rounds: {
    round: number;
    matches: {
      matchId: number;
      player1Text: string;
      player2Text: string;
      isPlayed: boolean;
      isNext: boolean;
      winner: string | null;
    }[];
  }[];
};
