import { getDataOrThrow } from "./services/api.js";
import { getUserTournaments } from "./services/tournamentService.js";
import { toaster } from "./Toaster.js";

export function isEmptyString(str: string): boolean {
  return str === "";
}

function validateAgainstRegex(str: string, regex: RegExp): boolean {
  return regex.test(str);
}

export function markInvalid(
  message: string,
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): void {
  inputEl.focus();
  inputEl.classList.add(
    "border-2",
    "border-neon-red",
    "ring-1",
    "ring-neon-red"
  );

  errorEl.classList.remove("hidden");
  errorEl.textContent = message;
}

export function clearInvalid(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): void {
  inputEl.classList.remove(
    "border-2",
    "border-neon-red",
    "ring-1",
    "ring-neon-red"
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
      markInvalid(
        i18next.t("invalid.nicknameEmpty"),
        inputEl,
        errorElements[i]
      );
      isValid = false;
    } else if (!validateAgainstRegex(nickname, nicknameRegex)) {
      markInvalid(
        i18next.t("invalid.nicknameFormat"),
        inputEl,
        errorElements[i]
      );
      isValid = false;
    } else if (nicknames.filter((n) => n === nickname).length > 1) {
      markInvalid(
        i18next.t("invalid.nicknameUniqueness"),
        inputEl,
        errorElements[i]
      );
      isValid = false;
    }
  });
  return isValid;
}

export function validateTournamentName(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const tournamentNameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  const tournamentName: string = inputEl.value;

  clearInvalid(inputEl, errorEl);

  if (isEmptyString(tournamentName)) {
    markInvalid(i18next.t("invalid.tournamentNameEmpty"), inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(tournamentName, tournamentNameRegex)) {
    markInvalid(i18next.t("invalid.tournamentNameFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}

export async function isTournamentNameAvailable(
  username: string,
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): Promise<boolean> {
  try {
    const tournamentsPage = getDataOrThrow(
      await getUserTournaments({ username: username, name: inputEl.value })
    );
    if (tournamentsPage.items.length === 0) {
      return true;
    }

    markInvalid(
      i18next.t("invalid.tournamentNameUniqueness"),
      inputEl,
      errorEl
    );
    return false;
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    toaster.error(i18next.t("toast.validateTournamentNameError"));
    return false;
  }
}

export function validatePlayersSelection(
  playersSelected: HTMLInputElement,
  selectionEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  clearInvalid(selectionEl, errorEl);

  if (!playersSelected) {
    markInvalid(i18next.t("invalid.playerSelection"), selectionEl, errorEl);
    return false;
  }
  return true;
}

export function validatePassword(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[0-9])[A-Za-z0-9@$!%*?&]{10,64}$/;
  const password: string = inputEl.value;

  clearInvalid(inputEl, errorEl);

  if (isEmptyString(password)) {
    markInvalid(i18next.t("invalid.passwordEmpty"), inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(password, passwordRegex)) {
    markInvalid(i18next.t("invalid.passwordFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}

export function validateConfirmPassword(
  inputElOne: HTMLInputElement,
  inputElTwo: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  if (isEmptyString(inputElTwo.value)) {
    markInvalid(
      i18next.t("invalid.passwordConfirmationEmpty"),
      inputElTwo,
      errorEl
    );
    return false;
  }

  if (inputElOne.value !== inputElTwo.value) {
    markInvalid(i18next.t("invalid.passwordConfirmation"), inputElTwo, errorEl);
    return false;
  }

  clearInvalid(inputElTwo, errorEl);
  return true;
}

export function validateUsername(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const usernameRegex: RegExp = /^[a-zA-Z0-9-!?_$.]{3,20}$/;
  const username: string = inputEl.value;

  clearInvalid(inputEl, errorEl);

  if (isEmptyString(username)) {
    markInvalid(i18next.t("invalid.usernameEmpty"), inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(username, usernameRegex)) {
    markInvalid(i18next.t("invalid.usernameFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}

export function validateEmail(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email: string = inputEl.value;

  clearInvalid(inputEl, errorEl);

  if (isEmptyString(email)) {
    markInvalid(i18next.t("invalid.emailEmpty"), inputEl, errorEl);
    return false;
  }

  if (!validateAgainstRegex(email, emailRegex)) {
    markInvalid(i18next.t("invalid.emailFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}

export function validateUsernameOrEmail(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  clearInvalid(inputEl, errorEl);
  if (isEmptyString(inputEl.value)) {
    markInvalid(i18next.t("invalid.emailOrUsernameEmpty"), inputEl, errorEl);
    return false;
  }

  if (!validateUsername(inputEl, errorEl) && !validateEmail(inputEl, errorEl)) {
    markInvalid(i18next.t("invalid.emailOrUsernameFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}

export function validateImageFile(
  inputEl: HTMLInputElement,
  errorEl: HTMLElement
): boolean {
  clearInvalid(inputEl, errorEl);

  if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
    markInvalid(i18next.t("invalid.imageFileEmpty"), inputEl, errorEl);
    return false;
  }

  const file = inputEl.files![0];
  if (!file.type.startsWith("image/")) {
    markInvalid(i18next.t("invalid.imageFileFormat"), inputEl, errorEl);
    return false;
  }
  return true;
}
