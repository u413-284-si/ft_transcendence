import { MatchRead } from "../types/IMatch.js";
import { escapeHTML } from "../utility.js";
import { formatPlayerName } from "./NicknameInput.js";

export function MatchRow(match: MatchRead): string {
  const isPlayerOne = match.playedAs === "PLAYERONE";

  const result = isPlayerOne
    ? match.player1Score > match.player2Score
      ? i18next.t("global.won")
      : i18next.t("global.lost")
    : match.player2Score > match.player1Score
      ? i18next.t("global.won")
      : i18next.t("global.lost");

  const player1Name = formatPlayerName(
    match.player1Nickname,
    match.player1Type
  );
  const player2Name = formatPlayerName(
    match.player2Nickname,
    match.player2Type
  );

  const player1Display = isPlayerOne ? `${player1Name} (*)` : player1Name;
  const player2Display = isPlayerOne ? player2Name : `${player2Name} (*)`;

  const tournamentDisplay = match.tournamentName
    ? i18next.t("global.tournament", {
        tournamentName: match.tournamentName
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
