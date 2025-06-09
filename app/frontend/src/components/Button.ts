export type ButtonOptions = {
  id?: string;
  text: string;
  variant?: "default" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
};

const buttonVariants: Record<string, string> = {
  default: "bg-green-400 text-white hover:bg-green-500",
  outline:
    "border border-green-400 text-green-400 hover:bg-green-400 hover:text-white",
  danger: "bg-red-500 text-white hover:bg-red-600"
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
    "inline-flex items-center justify-center hover:shadow-neon-cyan transition-all duration-500 ease-in-out rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
    buttonVariants[variant],
    buttonSizes[size]
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<button${idAttr} type="${type}" class="${classes}">${text}</button>`;
}
