export type ParagraphOptions = {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
};

const paragraphSizes: Record<string, string> = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg"
};

export function Paragraph({
  text,
  size = "md",
  className = "",
  id = ""
}: ParagraphOptions): string {
  const baseStyles = "text-grey leading-relaxed";
  const classes = `${baseStyles} ${paragraphSizes[size]} ${className}`.trim();
  const idAttr = id ? ` id="${id}"` : "";
  return `<p${idAttr} class="${classes}">${text}</p>`;
}
