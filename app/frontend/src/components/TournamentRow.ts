import { TournamentDTO } from "../types/ITournament.js";
import { escapeHTML } from "../utility.js";

export function TournamentRow(tournament: TournamentDTO): string {
  const result = didWinTournament(
    tournament.maxPlayers,
    tournament.roundReached
  )
    ? i18next.t("global.won")
    : i18next.t("statsView.eliminatedInRound", {
        round: tournament.roundReached
      });

  return /* HTML */ `
    <tr>
      <td class="border border-dark-emerald px-4 py-2">
        ${escapeHTML(tournament.name)}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${tournament.maxPlayers}
      </td>
      <td class="border border-dark-emerald px-4 py-2">
        ${escapeHTML(tournament.userNickname)}
      </td>
      <td class="border border-dark-emerald px-4 py-2">${result}</td>
    </tr>
  `;
}

export function NoTournamentsRow(): string {
  return /* HTML */ `
    <tr>
      <td colspan="5" class="text-center text-teal py-4">
        No tournaments available
      </td>
    </tr>
  `;
}

function didWinTournament(maxPlayers: number, roundReached: number): boolean {
  const totalRounds = Math.log2(maxPlayers);
  return roundReached === totalRounds;
}
