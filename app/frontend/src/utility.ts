export function escapeHTML(input: string | undefined | null): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getInputEl(inputId: string): HTMLInputElement {
  return document.getElementById(inputId) as HTMLInputElement;
}

export function getEl(elId: string): HTMLElement {
  return document.getElementById(elId) as HTMLElement;
}

export function getButtonEl(buttonId: string): HTMLButtonElement {
  return document.getElementById(buttonId) as HTMLButtonElement;
}

export function getCookieValueByName(cookieName: string): string {
  const match = document.cookie.match(
    new RegExp("(^|; )" + cookieName + "=([^;]+)")
  );
  return match ? match[2] : "";
}
