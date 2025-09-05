export type HeaderVariant = "default" | "error";

export type Header2Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
  className?: string;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-3xl font-medium text-white",
  error: "text-3xl font-medium text-neon-red"
};

export function Header2({
  text,
  id = "",
  variant = "default",
  className = ""
}: Header2Options): string {
  const classes = [
    headerVariants[variant] || headerVariants.default,
    className
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<h2${idAttr} class="${classes}">${text}</h2>`;
}
