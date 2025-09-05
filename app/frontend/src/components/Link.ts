export type LinkOptions = {
  text?: string;
  variant?: "navigation" | "download";
  href?: string;
  filename?: string;
  id?: string;
  className?: string;
};

const linkVariants: Record<string, string> = {
  navigation:
    "text-xl uppercase px-3 py-1 rounded-md text-teal hover:text-neon-orange hover:animate-glow-orange hover:font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
  download:
    "px-4 py-2 text-base inline-flex items-center justify-center rounded-md font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan uppercase border border-neon-cyan text-white hover:shadow-neon-cyan hover:bg-neon-cyan transition-all duration-500 ease-in-out"
};

export function Link({
  text = "",
  variant = "navigation",
  href = "#",
  filename = "",
  id,
  className = ""
}: LinkOptions): string {
  // Merge all classes
  const classes = [linkVariants[variant], className].join(" ");
  const linkAttr = variant === "navigation" ? "data-link" : "";
  const downloadAttr = variant === "download" ? `download="${filename}"` : "";

  return `<a${id ? ` id="${id}"` : ""} href="${href}" class="${classes}" ${linkAttr}${downloadAttr}>${text}</a>`;
}
