export interface Match {
  playerId: number;
  tournamentId?: number;
  playerNickname: string;
  opponentNickname: string;
  playerScore: number;
  opponentScore: number;
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
