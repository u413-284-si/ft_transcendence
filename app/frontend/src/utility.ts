export function escapeHTML(input: string | undefined | null): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getCookieValueByName(cookieName: string): string {
  const match = document.cookie.match(
    new RegExp("(^|; )" + cookieName + "=([^;]+)")
  );
  return match ? match[2] : "";
}

export function getBySelector<T extends HTMLElement>(
  selector: string,
  root: ParentNode = document
): T {
  const el = root.querySelector<T>(selector);
  if (!el) {
    console.error(`Element "${selector}" not found`);
    throw new Error(i18next.t("error.unexpected"));
  }
  return el;
}

export function getById<T extends HTMLElement>(id: string): T {
  return getBySelector<T>(`#${id}`);
}

export function getAllBySelector<T extends HTMLElement>(
  selector: string,
  {
    root = document,
    strict = true
  }: { root?: ParentNode; strict?: boolean } = {}
): T[] {
  const elements = root.querySelectorAll<T>(selector);
  if (elements.length === 0 && strict) {
    console.error(`No elements match selector "${selector}"`);
    throw new Error(i18next.t("error.unexpected"));
  }
  return Array.from(elements);
}

export function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function getCSSColorWithAlpha(varName: string, alpha: number) {
  const color = getCSSVar(varName);
  return color.includes("/") ? color : color.replace(")", ` / ${alpha})`);
}
