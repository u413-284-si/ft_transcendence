
export async function renderTournament(event: Event) {
	const form = document.getElementById("tournament-form") as HTMLFormElement;
	const players = form?.querySelector('input[name="players"]:checked') as HTMLInputElement;

	if (!players) {
		event.preventDefault();
		return alert("Please select the number of players.");
	}

	const selectedPlayers = parseInt(players.value);
	console.log(`Tournament started with ${selectedPlayers} players`);
	// Add logic to handle the selected number of players
}