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
    default: "text-gray-800",
    info: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600"
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return `<span${id ? ` id="${id}"` : ""} class="${classes}">${text}</span>`;
}
