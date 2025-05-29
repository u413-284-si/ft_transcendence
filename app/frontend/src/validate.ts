import { getUserTournaments } from "./services/tournamentService.js";

function isEmptyString(str: string): boolean {
  return str === "";
}

function validateAgainstRegex(str: string, regex: RegExp): boolean {
  return regex.test(str);
}

function markInvalid(
  message: string,
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): void {
  inputEl.focus();
  inputEl.classList.add(
    "border-2",
    "border-red-600",
    "ring-1",
    "ring-red-500",
    "bg-[rgba(255,0,0,0.25)]"
  );

  errorEl.classList.remove("hidden");
  errorEl.textContent = message;
}

function clearInvalid(inputEl: HTMLInputElement, errorEl: HTMLElement): void {
  inputEl.classList.remove(
    "border-2",
    "border-red-600",
    "ring-1",
    "ring-red-500",
    "bg-[rgba(255,0,0,0.25)]"
  );
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
}

export function validateNicknames(
  inputElements: HTMLInputElement[],
  errorElements: HTMLElement[],
  nicknames: string[]
): boolean {
  const nicknameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  let isValid = true;

  inputElements.forEach((inputEl, i) => {
    clearInvalid(inputEl, errorElements[i]);
    const nickname = nicknames[i];

    if (isEmptyString(nickname)) {
      markInvalid("Nickname is required.", inputEl, errorElements[i]);
      isValid = false;
    } else if (!validateAgainstRegex(nickname, nicknameRegex)) {
      markInvalid(
        "Nickname must be 3–20 characters and can include letters, numbers, or [-!?_$.]",
        inputEl,
        errorElements[i]
      );
      isValid = false;
    } else if (nicknames.filter((n) => n === nickname).length > 1) {
      markInvalid("Nicknames must be unique.", inputEl, errorElements[i]);
      isValid = false;
    }
  });
  return isValid;
}

export async function validateTournamentName(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): Promise<boolean> {
  const tournamentNameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  clearInvalid(inputEl, errorEl);
  if (isEmptyString(inputEl.value)) {
    markInvalid("Tournament name is required.", inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(inputEl.value, tournamentNameRegex)) {
    markInvalid(
      "Tournament name must be 3–20 characters long and can only contain letters, numbers, or [-!?_$.].",
      inputEl,
      errorEl
    );
    return false;
  }

  try {
    const tournaments = await getUserTournaments();
    if (tournaments.length === 0) {
      return true;
    }

    const tournamentNames = tournaments.map((tournament) => tournament.name);
    if (tournamentNames.includes(inputEl.value)) {
      markInvalid(
        "Tournament name already exists. Please choose a different name.",
        inputEl,
        errorEl
      );
      return false;
    }
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    alert("An error occurred while validating the tournament name.");
    return false;
  }
  return true;
}

export function validatePlayersSelection(
  playersSelected: HTMLInputElement,
  selectionEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  if (!playersSelected) {
    markInvalid("Please select number of players.", selectionEl, errorEl);
    return false;
  }
  clearInvalid(selectionEl, errorEl);
  return true;
}

export function validatePassword(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[0-9])[A-Za-z0-9@$!%*?&]{10,64}$/;

  if (isEmptyString(inputEl.value)) {
    markInvalid("Please enter a password.", inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(inputEl.value, passwordRegex)) {
    markInvalid(
      "Password must be 10-64 characters long and must contain at least one " +
        "number, one uppercase and one lowercase letter and one of the " +
        "following special characters inside brackets: [@$!%*?&].",
      inputEl,
      errorEl
    );
    return false;
  }
  clearInvalid(inputEl, errorEl);
  return true;
}

export function validateUsernameOrEmail(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const usernameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (isEmptyString(inputEl.value)) {
    markInvalid("Please enter a username or email address.", inputEl, errorEl);
    return false;
  }

  if (
    !validateAgainstRegex(inputEl.value, usernameRegex) &&
    !validateAgainstRegex(inputEl.value, emailRegex)
  ) {
    markInvalid(
      "Please enter a valid username (3-20 characters long) or email address",
      inputEl,
      errorEl
    );
    return false;
  }
  clearInvalid(inputEl, errorEl);
  return true;
}
