export type TabButtonOptions = {
  text: string;
  tabId: string;
  className?: string;
  id?: string;
  isActive?: boolean;
};

export function TabButton({
  text,
  tabId,
  id,
  className = "",
  isActive = false
}: TabButtonOptions): string {
  const baseStyles =
    "tab-button text-xl px-3 py-1 rounded-md text-teal hover:text-neon-orange hover:animate-glow-orange hover:font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan";

  const activeStyles = isActive ? "active-link" : "";

  const classes = `${baseStyles} ${activeStyles} ${className}`.trim();

  return `<button
    ${id ? `id="${id}"` : ""}
    class="${classes}"
    data-tab="${tabId}"
  >
    ${text}
  </button>`;
}
