export type ParagraphOptions = {
  text: string;
  className?: string;
  id?: string;
};

export function Paragraph({
  text,
  className = "",
  id = ""
}: ParagraphOptions): string {
  const baseStyles = "text-lg text-grey leading-relaxed";
  const classes = `${baseStyles} ${className}`.trim();
  const idAttr = id ? ` id="${id}"` : "";
  return `<p${idAttr} class="${classes}">${text}</p>`;
}
