export type LinkOptions = {
  text?: string;
  variant?: "default" | "empty";
  href?: string;
  id?: string;
  className?: string;
};

const linkVariants: Record<string, string> = {
  default:
    "text-xl px-3 py-1 rounded-md text-teal hover:text-neon-orange hover:animate-glow-orange hover:font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
  empty: ""
};

export function Link({
  text = "",
  variant = "default",
  href = "#",
  id,
  className = ""
}: LinkOptions): string {
  // Merge all classes
  const classes = [linkVariants[variant], className].join(" ");

  return `<a${id ? ` id="${id}"` : ""} href="${href}" class="${classes}" data-link>${text}</a>`;
}
