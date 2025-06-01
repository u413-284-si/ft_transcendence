export interface Match {
  tournament?: {
    id: number;
    name: string;
  } | null;
  userId?: number | null;
  playedAs?: string | null;
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
};
