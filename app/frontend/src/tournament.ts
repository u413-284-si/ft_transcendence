export async function renderTournament(event: Event) {
  const form = document.getElementById("tournament-form") as HTMLFormElement;
  const players = form?.querySelector(
    'input[name="players"]:checked'
  ) as HTMLInputElement;
  const tournamentNameInput = form?.querySelector(
    'input[name="tournamentName"]'
  ) as HTMLInputElement;

  if (!players) {
    event.preventDefault();
    return alert("Please select the number of players.");
  }

  if (!tournamentNameInput) {
    event.preventDefault();
    return alert("Please enter a tournament name.");
  }

  event.preventDefault();
  const selectedPlayers = parseInt(players.value);
  const tournamentName = tournamentNameInput.value.trim();
  console.log(`Tournament "${tournamentName}" started with ${selectedPlayers} players`);
  // Add logic to handle the selected number of players
}
