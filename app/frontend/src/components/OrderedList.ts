export type OrderedListOptions = {
  children: string[];
  className?: string;
  id?: string;
  start?: number;
};

export function OrderedList({
  children,
  className = "text-md list-decimal list-outside space-y-1",
  id = "",
  start
}: OrderedListOptions): string {
  const idAttr = id ? `id="${id}"` : "";
  const startAttr = start ? `start="${start}"` : "";

  const listItems = children.map((item) => `<li>${item}</li>`).join("\n");

  return `
    <ol ${idAttr} ${startAttr} class="${className}">
      ${listItems}
    </ol>
  `;
}
