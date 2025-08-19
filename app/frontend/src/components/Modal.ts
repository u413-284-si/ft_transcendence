import { getById } from "../utility.js";
import { Button } from "./Button.js";

export type ModalOptions = {
  children: string[];
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
};

const modalSizes: Record<string, string> = {
  sm: "px-3 py-3 text-sm",
  md: "px-4 py-4 text-base",
  lg: "px-6 py-6 text-lg"
};

export function Modal({
  children,
  className = "",
  id = "",
  size = "md"
}: ModalOptions): string {
  const classes = [
    "m-auto border border-neon-cyan rounded-md bg-emerald-dark",
    modalSizes[size],
    className
  ].join(" ");
  const content = [
    `<div class="flex justify-end mb-4 w-full">
    ${Button({
      id: `${id}-close-button`,
      text: "&times;"
    })}
  </div>`,
    ...children
  ].join("\n");
  return /* HTML */ `
    <dialog ${id ? `id="${id}"` : ""} class="${classes}">${content}</dialog>
  `;
}

export function addCloseModalListener(id: string) {
  const modalEl = getById<HTMLDialogElement>(id);
  const modalCloseButtonEl = getById<HTMLButtonElement>(`${id}-close-button`);

  modalEl.addEventListener("click", (e) => {
    const dialogDimensions = modalEl.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modalEl.close();
    }
  });

  modalCloseButtonEl.addEventListener("click", () => modalEl.close());
}
