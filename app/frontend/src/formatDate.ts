import { Language } from "./types/User";

const languageFallbacks: Record<Language, string> = {
  pi: "en",
  tr: "en",
  en: "en",
  fr: "fr",
  de: "de"
};

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  }
): string {
  const rawLang = (i18next.language as Language) || "en";
  const fallbackLang = languageFallbacks[rawLang] || "en";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  try {
    const formatter = new Intl.DateTimeFormat(fallbackLang, options);
    return formatter.format(dateObj);
  } catch (err) {
    console.warn(
      `Intl.DateTimeFormat error with lang "${rawLang}" → falling back to "en"`,
      err
    );
    return new Intl.DateTimeFormat("en", options).format(dateObj);
  }
}
