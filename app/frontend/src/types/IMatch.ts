export interface Match {
  playerId: number;
  tournamentId?: number;
  playerNickname: string;
  opponentNickname: string;
  playerScore: number;
  opponentScore: number;
  date?: string;
}
