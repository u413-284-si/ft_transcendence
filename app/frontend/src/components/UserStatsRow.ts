import { UserStats } from "../types/IUserStats.js";

export function UserStatsRow(user: string, userStats: UserStats): string {
  const formattedWinRate = userStats.winRate.toFixed(2) + "%";
  return /* HTML */ `
    <tr>
      <td class="border border-dark-emerald px-4 py-2">${user}</td>
      <td class="border border-dark-emerald px-4 py-2">
        ${userStats.matchesPlayed}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${userStats.matchesWon}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${userStats.matchesLost}
      </td>
      <td class="border border-dark-emerald px-4 py-2">${formattedWinRate}</td>
    </tr>
  `;
}
