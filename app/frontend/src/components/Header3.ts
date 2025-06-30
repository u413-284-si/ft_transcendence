export type HeaderVariant = "default" | "error";

export type Header3Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
  className?: string;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-xl font-bold text-neon-cyan",
  error: "text-xl font-bold text-neon-red"
};

export function Header3({
  text,
  id = "",
  variant = "default",
  className = ""
}: Header3Options): string {
  const classes = [
    headerVariants[variant] || headerVariants.default,
    className
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<h3${idAttr} class="${classes}">${text}</h3>`;
}
