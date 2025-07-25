import { Language } from "./types/User";

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  }
): string {
  const lang = (i18next.language as Language) || "en";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (lang === "pi") {
    return formatPirateDate(dateObj);
  }

  if (lang === "tr") {
    return dateObj.toISOString().split("T")[0];
  }

  try {
    const formatter = new Intl.DateTimeFormat(lang, options);
    return formatter.format(dateObj);
  } catch (err) {
    console.warn(
      `Intl.DateTimeFormat error with lang "${lang}" → falling back to "en"`,
      err
    );
    return new Intl.DateTimeFormat("en", options).format(dateObj);
  }
}

function formatPirateDate(date: Date): string {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = pirateMonthNames[date.getMonth()];
  const suffix = getDaySuffix(day);

  return `${day}${suffix} o' ${month}, ${year}`;
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
