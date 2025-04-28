export function validateName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  if (name === "") {
    alert("Please enter a name.");
    return false;
  }

  if (!nameRegex.test(name)) {
    alert(
      "Names must be 3-20 characters long and can only contain letters, " +
        "numbers, or the following special characters inside brackets: [-!?_$.]."
    );
    return false;
  }
  return true;
}

export function validateNicknames(nicknames: string[]): boolean {
  if (nicknames.some((nickname) => nickname === "")) {
    alert("Please enter a nickname for all players.");
    return false;
  }

  for (const nickname of nicknames) {
    if (!validateName(nickname)) return false;
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

export function validatePassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{14,30}$/;

  if (password === "") {
    alert("Please enter a password.");
    return false;
  }

  if (!passwordRegex.test(password)) {
    alert(
      "Password must be 14-30 characters long and must contain at least one " +
        "number, one uppercase and one lowercase letter and one of the " +
        "following special characters inside brackets: [-!?_$.]."
    );
    return false;
  }
  return true;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email === "") {
    alert("Please enter an email address.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert(
      "Please enter a valid email address in the format example@domain.com."
    );
    return false;
  }
  return true;
}

export function validateUsernameOrEmail(usernameOrEmail: string): boolean {
  if (validateName(usernameOrEmail) || validateEmail(usernameOrEmail))
    return true;
  return false;
}
