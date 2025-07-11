export type HeaderVariant = "default" | "error" | "username";

export type Header1Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
  className?: string;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-4xl font-bold text-white",
  error: "text-4xl font-bold text-neon-red",
  username: "text-3xl font-bold text-neon-cyan normal-case"
};

export function Header1({
  text,
  id = "",
  variant = "default",
  className = ""
}: Header1Options): string {
  const classes = [
    headerVariants[variant] || headerVariants.default,
    className
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<h1${idAttr} class="${classes}">${text}</h1>`;
}
