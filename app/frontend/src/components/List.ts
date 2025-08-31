export type ListType = "ordered" | "unordered";

export type ListOptions = {
  type?: ListType;
  children: string[];
  className?: string;
  id?: string;
  start?: number;
};

export function List({
  type = "ordered",
  children,
  className,
  id = "",
  start
}: ListOptions): string {
  const idAttr = id ? `id="${id}"` : "";
  const startAttr = type === "ordered" && start ? `start="${start}"` : "";

  const defaultClasses =
    type === "ordered"
      ? "text-md text-grey list-decimal list-inside space-y-1 mb-4"
      : "text-md text-grey list-disc list-inside space-y-1 mb-4";

  const listItems = children.map((item) => `<li>${item}</li>`).join("\n");

  return type === "ordered"
    ? `
      <ol ${idAttr} ${startAttr} class="${className || defaultClasses}">
        ${listItems}
      </ol>
    `
    : `
      <ul ${idAttr} class="${className || defaultClasses}">
        ${listItems}
      </ul>
    `;
}
