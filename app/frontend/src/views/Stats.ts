import AbstractView from "./AbstractView.js";
import { MatchData } from "../types/match.js";
import { UserStats } from "../types/userStats.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Stats");
	}

	async createHTML() {
		return `
		<h1>Player Statistics</h1>
		<table border="1">
			<thead>
				<tr>
					<th>Player</th>
					<th>Total Matches</th>
					<th>Matches Won</th>
					<th>Matches Lost</th>
					<th>Win Rate</th>
				</tr>
			</thead>
			<tbody id="user-stats-body">
				<!-- Player stats will be inserted here -->
			</tbody>
		</table>

		<h1>Match History</h1>
		<table border="1">
			<thead>
				<tr>
					<th>Player 1</th>
					<th>Score 1</th>
					<th>Player 2</th>
					<th>Score 2</th>
					<th>Winner</th>
					<th>Date</th>
				</tr>
			</thead>
			<tbody id="matches-table-body">
				<!-- Matches will be inserted here -->
			</tbody>
		</table>
		`;
	}

	async render() {
		await this.updateHTML();
		await this.fetchAndDisplayMatches();
		await this.fetchAndDisplayUserStats();
	}

	async fetchAndDisplayMatches() {
		try {
			const response = await fetch('http://localhost:4000/api/match/user/1');
			if (!response.ok) throw new Error('Failed to fetch matches');

			const matches: MatchData[] = await response.json();

			const matchesTableBody = document.getElementById('matches-table-body');
			if (!matchesTableBody) return;

			matches.forEach(match => {
				const result = match.playerScore > match.opponentScore ? "Won" : "Lost";
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${match.playerNickname}</td>
					<td>${match.playerScore}</td>
					<td>${match.opponentNickname}</td>
					<td>${match.opponentScore}</td>
					<td>${result}</td>
					<td>${new Date(match.timestamp!).toLocaleString()}</td>
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
			const response = await fetch(`http://localhost:4000/api/user_stats/1`);
			if (!response.ok) throw new Error('Failed to fetch user stats');

			const stats: UserStats = await response.json();

			const tableBody = document.getElementById('user-stats-body');
			if (!tableBody) return;

			tableBody.innerHTML = `
				<tr>
					<td>${user}</td>
					<td>${stats.matchesPlayed}</td>
					<td>${stats.matchesWon}</td>
					<td>${stats.matchesLost}</td>
					<td>${stats.winRate}</td>
				</tr>
			`;
		} catch (error) {
			console.error('Error fetching user stats:', error);
		}
	};
}
