export type HeaderVariant = "default" | "error" | "success" | "warning";

export type Header2Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-3xl font-bold text-white",
  error: "text-3xl font-bold text-neon-bordeaux",
  success: "text-3xl font-bold text-neon-green",
  warning: "text-3xl font-bold text-neon-yellow"
};

export function Header2({
  text,
  id = "",
  variant = "default"
}: Header2Options): string {
  const classes = headerVariants[variant] || headerVariants.default;
  const idAttr = id ? ` id="${id}"` : "";
  return `<h2${idAttr} class="${classes}">${text}</h2>`;
}
