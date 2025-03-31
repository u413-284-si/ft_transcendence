import AbstractView from "./AbstractView.js";
import { Match, MatchData } from "../types/IMatch.js";
import { UserStats, UserStatsData } from "../types/IUserStats.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Stats");
	}

	async createHTML() {
		return `
			<h1 class="text-4xl font-bold text-blue-300 mb-8">Player Statistics</h1>
			<div class="overflow-x-auto">
				<table class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500">
					<thead class="bg-blue-800">
						<tr>
							<th class="border border-blue-500 px-4 py-2">Username</th>
							<th class="border border-blue-500 px-4 py-2">Total Matches</th>
							<th class="border border-blue-500 px-4 py-2">Matches Won</th>
							<th class="border border-blue-500 px-4 py-2">Matches Lost</th>
							<th class="border border-blue-500 px-4 py-2">Win Rate</th>
						</tr>
					</thead>
					<tbody id="user-stats-body" class="bg-blue-700 divide-y divide-blue-500">
						<!-- Player stats will be inserted here -->
					</tbody>
				</table>
			</div>

			<h1 class="text-4xl font-bold text-blue-300 mt-12 mb-8">Match History</h1>
			<div class="overflow-x-auto">
				<table class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500">
					<thead class="bg-blue-800">
						<tr>
							<th class="border border-blue-500 px-4 py-2">Nickname</th>
							<th class="border border-blue-500 px-4 py-2">Score</th>
							<th class="border border-blue-500 px-4 py-2">Opponent</th>
							<th class="border border-blue-500 px-4 py-2">Opponent Score</th>
							<th class="border border-blue-500 px-4 py-2">Result</th>
							<th class="border border-blue-500 px-4 py-2">Date</th>
						</tr>
					</thead>
					<tbody id="matches-table-body" class="bg-blue-700 divide-y divide-blue-500">
						<!-- Matches will be inserted here -->
					</tbody>
				</table>
			</div>
		`;
	}

	async render() {
		await this.updateHTML();
		await this.fetchAndDisplayMatches();
		await this.fetchAndDisplayUserStats();
	}

	async fetchAndDisplayMatches() {
		try {
			const response = await fetch('http://localhost:4000/api/users/1/matches');
			if (!response.ok) throw new Error('Failed to fetch matches');

			const matchData: MatchData = await response.json();
			const { matches } = matchData;

			const matchesTableBody = document.getElementById('matches-table-body');
			if (!matchesTableBody) return;

			matches.forEach(match => {
				const result = match.playerScore > match.opponentScore ? "Won" : "Lost";
				const row = document.createElement('tr');
				row.innerHTML = `
						<td class="border border-blue-500 px-4 py-2">${match.playerNickname}</td>
						<td class="border border-blue-500 px-4 py-2">${match.playerScore}</td>
						<td class="border border-blue-500 px-4 py-2">${match.opponentNickname}</td>
						<td class="border border-blue-500 px-4 py-2">${match.opponentScore}</td>
						<td class="border border-blue-500 px-4 py-2">${result}</td>
						<td class="border border-blue-500 px-4 py-2">${new Date(match.date!).toLocaleString()}</td>
				`;
				matchesTableBody.appendChild(row);
			});
		} catch (error) {
			console.error('Error fetching match data:', error);
		}
	};

	async fetchAndDisplayUserStats() {
		const user: String = "Herta";
		try {
			const response = await fetch(`http://localhost:4000/api/user-stats/1`);
			if (!response.ok) throw new Error('Failed to fetch user stats');

			const userStatsData: UserStatsData = await response.json();
			const { userStats: stats } = userStatsData;

			const tableBody = document.getElementById('user-stats-body');
			if (!tableBody) return;

			const formattedWinRate = (stats.winRate).toFixed(2) + "%";

			tableBody.innerHTML = `
				<tr>
						<td class="border border-blue-500 px-4 py-2">${user}</td>
						<td class="border border-blue-500 px-4 py-2">${stats.matchesPlayed}</td>
						<td class="border border-blue-500 px-4 py-2">${stats.matchesWon}</td>
						<td class="border border-blue-500 px-4 py-2">${stats.matchesLost}</td>
						<td class="border border-blue-500 px-4 py-2">${formattedWinRate}</td>
				</tr>
			`;
		} catch (error) {
			console.error('Error fetching user stats:', error);
		}
	};
}
