export type ButtonOptions = {
  id?: string;
  text: string;
  variant?: "default" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  className?: string;
};

const buttonVariants: Record<string, string> = {
  default:
    "bg-green-400 text-white hover:shadow-neon-cyan hover:bg-neon-cyan transition-all duration-500 ease-in-out",
  outline:
    "border border-green-400 text-green-400 hover:bg-green-400 hover:text-white hover:shadow-neon-green transition-all duration-500 ease-in-out",
  danger:
    "bg-red-500 text-white hover:shadow-neon-red hover:bg-neon-red transition-all duration-500 ease-in-out"
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
  type = "button",
  className = ""
}: ButtonOptions): string {
  const classes = [
    "inline-flex items-center justify-center rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-offset-2",
    buttonVariants[variant],
    buttonSizes[size],
    className
  ].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<button${idAttr} type="${type}" class="${classes}">${text}</button>`;
}
