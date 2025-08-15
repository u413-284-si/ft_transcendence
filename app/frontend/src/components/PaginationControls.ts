import { Button } from "./Button.js";

export type PaginationControlsOptions = {
  prevId: string;
  nextId: string;
  indicatorId: string;
  className?: string;
  prevLabel?: string;
  nextLabel?: string;
};

export function PaginationControls({
  prevId,
  nextId,
  indicatorId,
  className = "",
  prevLabel = "Prev",
  nextLabel = "Next"
}: PaginationControlsOptions): string {
  const disabledClasses =
    "disabled:bg-teal disabled:text-grey disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-teal disabled:border-none";

  return /* HTML */ `
    <div class="flex items-center gap-4 mt-2 ${className}">
      ${Button({
        id: prevId,
        text: prevLabel,
        className: disabledClasses
      })}
      <span
        id="${indicatorId}"
        class="inline-flex items-center justify-center px-4 py-2 rounded bg-neon-cyan text-white text-md"
      ></span>
      ${Button({
        id: nextId,
        text: nextLabel,
        className: disabledClasses
      })}
    </div>
  `;
}
