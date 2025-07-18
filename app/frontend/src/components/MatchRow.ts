import { Match, playedAs } from "../types/IMatch.js";
import { escapeHTML } from "../utility.js";

export function MatchRow(match: Match, user: string): string {
  const isPlayerOne = match.playedAs === playedAs.PLAYERONE;

  const result = isPlayerOne
    ? match.player1Score > match.player2Score
      ? i18next.t("global.wonText")
      : i18next.t("global.lostText")
    : match.player2Score > match.player1Score
      ? i18next.t("global.wonText")
      : i18next.t("global.lostText");

  const player1Display = isPlayerOne
    ? `${match.player1Nickname} (${user})`
    : match.player1Nickname;

  const player2Display = isPlayerOne
    ? match.player2Nickname
    : `${match.player2Nickname} (${user})`;

  const tournamentDisplay = match.tournament?.name
    ? i18next.t("global.tournamentText", {
        tournamentName: escapeHTML(match.tournament.name)
      })
    : "N/A";

  return /* HTML */ `
    <tr>
      <td class="border border-dark-emerald px-4 py-2">
        ${escapeHTML(player1Display)}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${match.player1Score}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${escapeHTML(player2Display)}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${match.player2Score}
      </td>
      <td class="border border-dark-emerald px-4 py-2">${result}</td>
      <td class="border border-dark-emerald px-4 py-2">
        ${new Date(match.date!).toLocaleString()}
      </td>
      <td class="border border-dark-emerald px-4 py-2">${tournamentDisplay}</td>
    </tr>
  `;
}

export function NoMatchesRow(): string {
  return /* HTML */ `
    <tr>
      <td colspan="7" class="text-center text-teal py-4">
        No matches played yet
      </td>
    </tr>
  `;
}
