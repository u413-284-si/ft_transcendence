export function validateNicknames(nicknames: string[], event: Event): boolean {
  const usernameRegex = /^[a-zA-Z0-9-!?_$.]{3,20}$/;

  if (nicknames.some((nickname) => nickname === "")) {
    event.preventDefault();
    alert("Please enter a nickname for all players.");
    return false;
  }

  if (!nicknames.every((nickname) => usernameRegex.test(nickname))) {
    event.preventDefault();
    alert(
      "Nicknames must be 3-20 characters long and can only contain letters, " +
        "numbers, or the following special characters inside brackets: [-!?_$.]."
    );
    return false;
  }

  if (hasDuplicates(nicknames)) {
    event.preventDefault();
    alert("Nicknames must be unique.");
    return false;
  }
  return true;
}

function hasDuplicates(nicknames: string[]): boolean {
  return new Set(nicknames).size !== nicknames.length;
}
