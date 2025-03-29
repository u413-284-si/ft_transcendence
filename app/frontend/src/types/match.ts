export interface Match {
	playerId: number;
	playerNickname: string;
	opponentNickname: string;
	playerScore: number;
	opponentScore: number;
	date?: string;
}

export interface MatchData {
	message: string;
	matches: Match[];
}
