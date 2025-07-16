export type LanguageSwitcherOptions = {
  id: string;
  className?: string;
  selectedLang: "en" | "fr";
};

export function LanguageSwitcher({
  id,
  className = "",
  selectedLang,
}: LanguageSwitcherOptions): string {
  const baseStyles = "bg-black text-teal border border-teal rounded hover:bg-emerald transition px-2 py-1 text-sm focus:outline-none";
  const classes = `${baseStyles} ${className}`.trim();

  return /* html */ `
    <select id="${id}" class="${classes}">
      <option value="en" ${selectedLang === "en" ? "selected" : ""}>EN</option>
      <option value="fr" ${selectedLang === "fr" ? "selected" : ""}>FR</option>
    </select>
  `;
}
