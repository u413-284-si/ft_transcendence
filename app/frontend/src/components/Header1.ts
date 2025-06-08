export type HeaderVariant = "default" | "error" | "success" | "warning";

export type Header1Options = {
  text: string;
  id?: string;
  variant?: HeaderVariant;
};

const headerVariants: Record<HeaderVariant, string> = {
  default: "text-4xl font-bold text-white",
  error: "text-4xl font-bold text-red-500",
  success: "text-4xl font-bold text-green-500",
  warning: "text-4xl font-bold text-yellow-500"
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
