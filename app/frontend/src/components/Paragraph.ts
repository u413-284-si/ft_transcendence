export type ParagraphOptions = {
  text: string;
  id?: string;
};

export function Paragraph({ text, id = "" }: ParagraphOptions): string {
  const classes = "text-base text-gray-300 leading-relaxed";
  const idAttr = id ? ` id="${id}"` : "";
  return `<p${idAttr} class="${classes}">${text}</p>`;
}
