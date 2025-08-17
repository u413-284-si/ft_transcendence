export type TextBoxOptions = {
  id?: string;
  text: readonly string[];
  variant?: "info" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const textBoxVariants: Record<string, string> = {
  info: "border border-neon-cyan text-neon-cyan shadow-neon-cyan",
  warning: "border border-neon-yellow text-neon-yellow shadow-neon-yellow",
  error: "border border-neon-red text-neon-red shadow-neon-red"
};

const textBoxSizes: Record<string, string> = {
  sm: "px-3 py-3 text-sm",
  md: "px-4 py-4 text-base",
  lg: "px-6 py-6 text-lg"
};

export function TextBox({
  id,
  text,
  variant = "info",
  size = "md",
  className = ""
}: TextBoxOptions): string {
  const classes = [
    "flex flex-col items-center justify-center rounded-md font-bold uppercase whitespace-pre-line leading-relaxed",
    textBoxVariants[variant],
    textBoxSizes[size],
    className
  ].join(" ");
  const content = text
    .map((line) => {
      if (line.trim() === "") {
        return `<div class="h-4"></div>`;
      }
      return `<p>${line}</p>`;
    })
    .join("");
  const idAttr = id ? ` id="${id}"` : "";
  return `<div${idAttr} class="${classes}">${content}</div>`;
}
