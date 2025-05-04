import { getUserTournaments } from "./services/tournamentService.js";

function isEmptyString(str: string): boolean {
  return str === "";
}

function validateAgainstRegex(str: string, regex: RegExp): boolean {
  if (!regex.test(str)) {
    return false;
  }
  return true;
}

function hasDuplicates(nicknames: string[]): boolean {
  return new Set(nicknames).size !== nicknames.length;
}

function markInvalid(message: string, inputEl?: HTMLInputElement): void {
  inputEl?.focus();
  inputEl?.classList.add(
    "border-2",
    "border-red-600",
    "ring-1",
    "ring-red-500",
    "bg-[rgba(255,0,0,0.25)]"
  );

  // Create or update the error message element
  let errorMessageEl = inputEl?.nextElementSibling as HTMLElement;
  if (!errorMessageEl || !errorMessageEl.classList.contains("error-message")) {
    errorMessageEl = document.createElement("span");
    errorMessageEl.classList.add(
      "error-message",
      "text-red-600",
      "text-sm",
      "mt-2",
      "block",
      "ml-49"
    );
    inputEl?.insertAdjacentElement("afterend", errorMessageEl);
  }
  errorMessageEl.textContent = message;
}

function clearInvalid(inputEl?: HTMLInputElement): void {
  inputEl?.classList.remove(
    "border-2",
    "border-red-600",
    "ring-1",
    "ring-red-500",
    "bg-[rgba(255,0,0,0.25)]"
  );
  const errorMessageEl = inputEl?.nextElementSibling as HTMLElement;
  if (errorMessageEl && errorMessageEl.classList.contains("error-message")) {
    errorMessageEl.remove();
  }
}

export function validateNicknames(nicknames: string[]): boolean {
  const nicknameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  if (nicknames.some((nickname) => nickname === "")) {
    alert("Please enter a nickname for all players.");
    return false;
  }

  for (const nickname of nicknames) {
    if (!validateAgainstRegex(nickname, nicknameRegex)) {
      alert(
        "Nicknames must be 3-20 characters long and can only contain letters, " +
          "numbers, or the following special characters inside brackets: [-!?_$.]."
      );
      return false;
    }
  }

  if (hasDuplicates(nicknames)) {
    alert("Nicknames must be unique.");
    return false;
  }
  return true;
}

export async function validateTournamentName(
  name: string,
  inputEl?: HTMLInputElement
): Promise<boolean> {
  const tournamentNameRegex = /^[a-zA-Z0-9-!?_$.@]{1,10}$/;

  if (isEmptyString(name)) {
    markInvalid("Tournament name is required.", inputEl);
    return false;
  }

  if (!validateAgainstRegex(name, tournamentNameRegex)) {
    markInvalid(
      "Tournament name must be 1–10 characters long and can only contain letters, numbers, or [-!?_$.@].",
      inputEl
    );
    return false;
  }

  try {
    const tournaments = await getUserTournaments();
    if (tournaments.length === 0) {
      return true;
    }

    const tournamentNames = tournaments.map((tournament) => tournament.name);
    if (tournamentNames.includes(name)) {
      markInvalid(
        "Tournament name already exists. Please choose a different name.",
        inputEl
      );
      return false;
    }
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    alert("An error occurred while validating the tournament name.");
    return false;
  }

  clearInvalid(inputEl);
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

  if (isEmptyString(password)) {
    alert("Please enter a password.");
    return false;
  }

  if (!validateAgainstRegex(password, passwordRegex)) {
    alert(
      "Password must be 14-30 characters long and must contain at least one " +
        "number, one uppercase and one lowercase letter and one of the " +
        "following special characters inside brackets: [-!?_$.]."
    );
    return false;
  }
  return true;
}

export function validateUsernameOrEmail(usernameOrEmail: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (isEmptyString(usernameOrEmail)) {
    console.log("USERNAME VALIDATION FAILED"); // add this
    alert("Please enter a username or email address.");
    return false;
  }

  if (
    !validateAgainstRegex(usernameOrEmail, usernameRegex) &&
    !validateAgainstRegex(usernameOrEmail, emailRegex)
  ) {
    alert(
      "Please enter a valid username (3-20 characters long) or email address"
    );
    return false;
  }
  return true;
}
