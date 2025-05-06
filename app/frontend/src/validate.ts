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

function markInvalid(message: string, inputEl: HTMLInputElement): void {
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
      "ml-0"
    );
    inputEl?.insertAdjacentElement("afterend", errorMessageEl);
  }
  errorMessageEl.textContent = message;
}

function clearInvalid(inputEl: HTMLInputElement): void {
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

function markSelectionInvalid(
  selectionEl: HTMLInputElement,
  errorEl: HTMLInputElement
): void {
  selectionEl?.classList.add(
    "border-2",
    "border-red-600",
    "bg-[rgba(255,0,0,0.2)]"
  );
  errorEl?.classList.remove("hidden");
}

function clearSelectionInvalid(
  selectionEl: HTMLInputElement,
  errorEl: HTMLInputElement
): void {
  selectionEl?.classList.remove(
    "border-2",
    "border-red-600",
    "bg-[rgba(255,0,0,0.2)]"
  );
  errorEl?.classList.add("hidden");
}

export function validateNicknames(inputElements: HTMLInputElement[]): boolean {
  const nicknameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  let isValid = true;

  const nicknames = inputElements.map((input) => input.value);

  inputElements.forEach((inputEl, i) => {
    clearInvalid(inputEl);
    const nickname = nicknames[i];

    if (nickname === "") {
      markInvalid("Nickname is required.", inputEl);
      isValid = false;
    } else if (!validateAgainstRegex(nickname, nicknameRegex)) {
      markInvalid(
        "Nickname must be 3–20 characters and can include letters, numbers, or [-!?_$.]",
        inputEl
      );
      isValid = false;
    } else if (nicknames.filter((n) => n === nickname).length > 1) {
      markInvalid("Nicknames must be unique.", inputEl);
      isValid = false;
    }
  });
  return isValid;
}

export async function validateTournamentName(
  inputEl: HTMLInputElement
): Promise<boolean> {
  const tournamentNameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  if (isEmptyString(inputEl.value)) {
    markInvalid("Tournament name is required.", inputEl);
    return false;
  }

  if (!validateAgainstRegex(inputEl.value, tournamentNameRegex)) {
    markInvalid(
      "Tournament name must be 3–20 characters long and can only contain letters, numbers, or [-!?_$.].",
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
    if (tournamentNames.includes(inputEl.value)) {
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

export function validatePlayersSelection(
  playersSelected: HTMLInputElement,
  selectionEl: HTMLInputElement,
  errorEl: HTMLInputElement
): boolean {
  if (!playersSelected) {
    markSelectionInvalid(selectionEl, errorEl);
    return false;
  }
  clearSelectionInvalid(selectionEl, errorEl);
  return true;
}

export function validatePassword(inputEl: HTMLInputElement): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{14,30}$/;

  if (isEmptyString(inputEl.value)) {
    markInvalid("Please enter a password.", inputEl);
    return false;
  }

  if (!validateAgainstRegex(inputEl.value, passwordRegex)) {
    markInvalid(
      "Password must be 14-30 characters long and must contain at least one " +
        "number, one uppercase and one lowercase letter and one of the " +
        "following special characters inside brackets: [-!?_$.].",
      inputEl
    );
    return false;
  }
  clearInvalid(inputEl);
  return true;
}

export function validateUsernameOrEmail(inputEl: HTMLInputElement): boolean {
  const usernameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (isEmptyString(inputEl.value)) {
    markInvalid("Please enter a username or email address.", inputEl);
    return false;
  }

  if (
    !validateAgainstRegex(inputEl.value, usernameRegex) &&
    !validateAgainstRegex(inputEl.value, emailRegex)
  ) {
    markInvalid(
      "Please enter a valid username (3-20 characters long) or email address",
      inputEl
    );
    return false;
  }
  clearInvalid(inputEl);
  return true;
}
