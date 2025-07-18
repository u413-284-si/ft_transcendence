export type LanguageSwitcherOptions = {
  id: string;
  className?: string;
  selectedLang: "en" | "fr" | "de" | "pi" | "tr";
  size?: "sm" | "md" | "lg";
};

export function LanguageSwitcher({
  id,
  className = "",
  selectedLang,
  size = "sm",
}: LanguageSwitcherOptions): string {
  const langs = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "de", label: "DE", flag: "🇩🇪" },
    { code: "pi", label: "PI", flag: "🏴‍☠️" },
    { code: "tr", label: "TR", flag: "🌐" },
  ];

  const buttonId = `${id}-button`;
  const optionsId = `${id}-options`;

  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  }[size];

  return /* html */ `
    <div class="relative inline-block ${className}">
      <button
        id="${buttonId}"
        type="button"
        class="bg-black w-full text-teal border border-teal rounded hover:bg-emerald transition px-2 py-1 text-sm flex items-center gap-1 focus:outline-none ${sizeClasses}"
        aria-haspopup="true"
        aria-expanded="false"
      >
        ${langs.find((l) => l.code === selectedLang)?.flag ?? "🏳️"}
        ${selectedLang.toUpperCase()}
      </button>
      <div id="${optionsId}" class="hidden absolute right-0 mt-2 w-32 bg-black border border-teal rounded shadow-lg z-50 ${className}">
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
