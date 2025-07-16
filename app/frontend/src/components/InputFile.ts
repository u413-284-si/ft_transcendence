import { Span } from "./Span.js";
import { Input } from "./Input.js";

export type InputFileOptions = {
  id: string;
  label: string;
  name?: string;
  accept?: string;
  errorId?: string;
  noFileText: string;
};

export function InputFile({
  id,
  label,
  name = "",
  accept = "",
  errorId = "",
  noFileText
}: InputFileOptions): string {
  const errorSpan = errorId ? Span({ id: errorId, variant: "error" }) : "";

  return /* HTML */ `
    <div class="w-full max-w-md flex flex-col gap-1">
      <label for="${id}" class="text-sm font-medium text-white">
        ${label}
      </label>

      <label
        id="${id}-file-label"
        for="${id}"
        class="text-sm inline-block cursor-pointer bg-emerald text-white px-4 py-2 rounded hover:bg-emerald-dark transition"
      >
        ${noFileText}
      </label>

      ${Input({
        id: `${id}`,
        name: `${name}`,
        type: "file",
        accept: `${accept}`,
        className: "hidden"
      })}

      ${errorSpan}
    </div>
  `;
}
