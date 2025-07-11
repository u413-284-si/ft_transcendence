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

export function deepMerge<T extends object>(target: Partial<T>, source: Partial<T>): Partial<T> {
  const result = { ...target } as Partial<T>;

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const sourceValue = source[key];
    const targetValue = result[key];

    // Use a local helper to safely merge two values of type U
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue) as T[typeof key];
    } else {
      result[key] = sourceValue as T[typeof key];;
    }
  }

  return result;
}

// Strongly type guard to exclude null/array
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
