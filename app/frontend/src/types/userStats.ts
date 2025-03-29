export interface UserStats {
	matchesPlayed: number;
	matchesWon: number;
	matchesLost: number;
	winRate: number;
}

export interface UserStatsData {
	message: string;
	userStats: UserStats;
}
