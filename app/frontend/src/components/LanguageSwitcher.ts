export type LanguageSwitcherOptions = {
  id: string;
  className?: string;
  selectedLang: "en" | "fr" | "de" | "pi";
};

export function LanguageSwitcher({
  id,
  className = "",
  selectedLang,
}: LanguageSwitcherOptions): string {
  const langs = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "de", label: "DE", flag: "🇩🇪" },
    { code: "pi", label: "PI", flag: "🏴‍☠️" },
  ];

  const buttonId = `${id}-button`;
  const optionsId = `${id}-options`;

  return /* html */ `
    <div class="relative inline-block ${className}">
      <button
        id="${buttonId}"
        type="button"
        class="bg-black text-teal border border-teal rounded hover:bg-emerald transition px-2 py-1 text-sm flex items-center gap-1 focus:outline-none"
        aria-haspopup="true"
        aria-expanded="false"
      >
        ${langs.find((l) => l.code === selectedLang)?.flag ?? "🏳️"}
        ${selectedLang.toUpperCase()}
      </button>
      <div id="${optionsId}" class="hidden absolute right-0 mt-2 w-32 bg-black border border-teal rounded shadow-lg z-50">
        ${langs
          .map(
            (lang) => `
          <button
            class="w-full text-left px-2 py-1 text-sm hover:bg-teal hover:text-black flex items-center gap-2"
            data-lang="${lang.code}"
          >
            ${lang.flag} ${lang.label}
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}
