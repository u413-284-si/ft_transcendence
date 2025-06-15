export type ButtonOptions = {
  id?: string;
  text: string;
  variant?: "default" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
};

const buttonVariants: Record<string, string> = {
  default:
    "border border-neon-cyan text-white hover:shadow-neon-cyan hover:bg-neon-cyan transition-all duration-500 ease-in-out",
  danger:
    "border border-neon-red text-white hover:shadow-neon-red hover:bg-neon-red transition-all duration-500 ease-in-out"
};

const buttonSizes: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

export function Button({
  id,
  text,
  variant = "default",
  size = "md",
  type = "button"
}: ButtonOptions): string {
  const classes = [
    "inline-flex items-center justify-center rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase",
    buttonVariants[variant],
    buttonSizes[size]
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<button${idAttr} type="${type}" class="${classes}">${text}</button>`;
}
