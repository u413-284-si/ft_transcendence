export type ModalOptions = {
  children: string[];
  className?: string;
  id?: string;
};

export function Modal({
  children,
  className = "",
  id = ""
}: ModalOptions): string {
  const classes =
    className ||
    "hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

  return `
    <div ${id ? `id="${id}"` : ""} class="${classes}">
      ${children.join("\n")}
    </div>
  `;
}
