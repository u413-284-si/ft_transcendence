export interface Match {
  tournamentId?: number;
  player1Id?: number | null;
  player2Id?: number | null;
  player1Nickname: string;
  player2Nickname: string;
  player1Score: number;
  player2Score: number;
  date?: string;
}

export type BracketMatch = {
  matchId: number;
  round: number;
  player1: string | null;
  player2: string | null;
  winner: string | null;
  nextMatchId?: number;
  winnerSlot?: 1 | 2;
  player1IsActiveUser?: boolean;
  player2IsActiveUser?: boolean;
};
