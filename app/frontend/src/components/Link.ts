export type LinkOptions = {
  text?: string;
  href?: string;
  id?: string;
  className?: string;
};

export function Link({
  text = "",
  href = "#",
  id,
  className = ""
}: LinkOptions): string {
  const baseStyles =
    "text-xl px-3 py-1 rounded-md text-teal hover:text-neon-orange hover:animate-glow-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan";
  // Merge all classes
  const classes = `${baseStyles} ${className}`.trim();

  return `<a${id ? ` id="${id}"` : ""} href="${href}" class="${classes}" data-link>${text}</a>`;
}
