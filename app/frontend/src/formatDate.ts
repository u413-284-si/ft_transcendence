import { appLogger } from "./logging/config.js";
import { Language } from "./types/User";

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  },
  lang: Language = (i18next.language as Language) || "en"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (lang === "pi") {
    return formatPirateDate(dateObj, options);
  }

  if (lang === "tr") {
    return formatTronDate(dateObj, options);
  }

  try {
    const formatter = new Intl.DateTimeFormat(lang, options);
    return formatter.format(dateObj);
  } catch (err) {
    appLogger.warn(
      `Intl.DateTimeFormat error with lang "${lang}" → falling back to "en"`,
      err
    );
    return new Intl.DateTimeFormat("en", options).format(dateObj);
  }
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatDayMonth(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit"
  };

  let lang = i18next.language as Language;
  if (lang === "pi" || lang === "tr") {
    lang = "en"; // fallback for chart labels
  }

  return formatDate(date, options, lang);
}

function formatPirateDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = pirateMonthNames[date.getMonth()];
  const year = date.getFullYear();

  const includeDay = options?.day !== undefined;
  const includeMonth = options?.month !== undefined;
  const includeYear = options?.year !== undefined;
  const includeHour = options?.hour !== undefined;
  const includeMinute = options?.minute !== undefined;

  const parts = [];

  if (includeDay) parts.push(`${day}${suffix}`);
  if (includeMonth) parts.push(`o' ${month}`);

  let dateStr = parts.join(" ");
  if (includeYear) dateStr += `, ${year}`;

  if (includeHour || includeMinute) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    dateStr += ` at ${hours}:${minutes}`;
  }

  return dateStr || `${day}${suffix} o' ${month}, ${year}`;
}

function formatTronDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const iso = date.toISOString().replace("T", " ");

  const hasYear = options?.year !== undefined;
  const hasMonth = options?.month !== undefined;
  const hasDay = options?.day !== undefined;
  const hasHour = options?.hour !== undefined;
  const hasMinute = options?.minute !== undefined;

  let datePart = "";
  if (hasYear && hasMonth && hasDay)
    datePart = iso.split(" ")[0]; // YYYY-MM-DD
  else if (hasYear && hasMonth)
    datePart = iso.slice(0, 7); // YYYY-MM
  else if (hasYear) datePart = iso.slice(0, 4); // YYYY

  if (hasHour || hasMinute) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const timePart = `${hours}:${minutes}`;
    return datePart ? `${datePart} ${timePart}` : timePart;
  }

  return datePart || iso.split(" ")[0];
}

const pirateMonthNames = [
  "Jarruary",
  "FebrARRy",
  "Marrrch",
  "Arrpril",
  "Maytee",
  "Junebeard",
  "JARRly",
  "Arrgust",
  "Septembarrr",
  "Octobeer",
  "NowemBAR",
  "Deckhandcember"
];

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
