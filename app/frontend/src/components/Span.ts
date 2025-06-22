export type SpanOptions = {
  text?: string;
  id?: string;
  variant?: "default" | "info" | "success" | "warning" | "error";
  className?: string;
};

export function Span({
  text = "",
  id,
  variant = "default",
  className = ""
}: SpanOptions): string {
  const baseStyles = "text-sm font-medium";
  const variantStyles: Record<string, string> = {
    default: "text-white",
    success: "text-neon-green",
    error: "text-neon-red hidden"
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return `<span${id ? ` id="${id}"` : ""} class="${classes}">${text}</span>`;
}
