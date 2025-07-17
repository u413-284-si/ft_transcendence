export type ParagraphOptions = {
  text: string;
  id?: string;
};

export function Paragraph({ text, id = "" }: ParagraphOptions): string {
  const classes = "text-base text-grey leading-relaxed mb-4";
  const idAttr = id ? ` id="${id}"` : "";
  return `<p${idAttr} class="${classes}">${text}</p>`;
}
