export type HeaderVariant = "default" | "error";

export type Header1Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-4xl font-bold text-white",
  error: "text-4xl font-bold text-neon-red"
};

export function Header1({
  text,
  id = "",
  variant = "default"
}: Header1Options): string {
  const classes = headerVariants[variant] || headerVariants.default;
  const idAttr = id ? ` id="${id}"` : "";
  return `<h1${idAttr} class="${classes}">${text}</h1>`;
}
