import { Button } from "./Button.js";

export type ModalOptions = {
  children: string[];
  className?: string;
  id?: string;
  idCloseButton?: string;
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
  idCloseButton = "",
  size = "md"
}: ModalOptions): string {
  const classes = [
    "flex flex-col items-center justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 border border-neon-cyan rounded-md bg-emerald-dark hidden",
    modalSizes[size],
    className
  ].join(" ");
  const content = [
    `<div class="flex justify-end mb-4 w-full">
    ${Button({
      id: idCloseButton,
      text: "&times;"
    })}
  </div>`,
    ...children
  ].join("\n");
  return /* HTML */ `
    <div ${id ? `id="${id}"` : ""} class="${classes}">${content}</div>
  `;
}
