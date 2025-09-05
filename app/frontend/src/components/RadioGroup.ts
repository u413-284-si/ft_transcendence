import { Radio } from "./Radio.js";
import { Span } from "./Span.js";

export type RadioGroupOption = {
  id: string;
  value: string;
  label: string;
};

export type RadioGroupProps = {
  name: string;
  label?: string;
  options: RadioGroupOption[];
  selectedValue?: string;
  errorId?: string;
  layout?: "vertical" | "horizontal";
};

export function RadioGroup({
  name,
  label = "",
  options,
  selectedValue = "",
  errorId = "",
  layout = "vertical"
}: RadioGroupProps): string {
  const layoutClass = layout === "horizontal" ? "flex-row" : "flex-col";

  const radios = options
    .map((opt) =>
      Radio({
        ...opt,
        name,
        checked: opt.value === selectedValue
      })
    )
    .join("\n");
  const errorSpan = errorId ? Span({ id: errorId, variant: "error" }) : "";

  return /* HTML */ `
    <div class="flex flex-col gap-1">
      ${label
        ? `<span class="text-md font-medium text-white">${label}</span>`
        : ""}
      <div class="flex ${layoutClass}">${radios}</div>
    </div>
    ${errorSpan}
  `;
}
