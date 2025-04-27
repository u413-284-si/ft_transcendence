export function validateNicknames(nicknames: string[]): boolean {
  const usernameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  if (nicknames.some((nickname) => nickname === "")) {
    alert("Please enter a nickname for all players.");
    return false;
  }

  if (!nicknames.every((nickname) => usernameRegex.test(nickname))) {
    alert(
      "Nicknames must be 3-20 characters long and can only contain letters, " +
        "numbers, or the following special characters inside brackets: [-!?_$.]."
    );
    return false;
  }

  if (hasDuplicates(nicknames)) {
    alert("Nicknames must be unique.");
    return false;
  }
  return true;
}

function hasDuplicates(nicknames: string[]): boolean {
  return new Set(nicknames).size !== nicknames.length;
}

export function validateTournamentName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9-!?_$.@]{1,10}$/;

  if (name === "") {
    alert("Please enter a tournament name.");
    return false;
  }

  if (!nameRegex.test(name)) {
    alert(
      "Tournament name must be 1-10 characters long and can only contain letters, " +
        "numbers, or the following special characters inside brackets: [-!?_$.@]."
    );
    return false;
  }
  return true;
}

export function validatePlayers(players: HTMLInputElement): boolean {
  if (!players) {
    alert("Please select the number of players.");
    return false;
  }
  return true;
}
