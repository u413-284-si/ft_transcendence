import { Radio } from "./Radio.js";

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

  return /* HTML */ `
    <div class="flex flex-col gap-1">
      ${label
        ? `<span class="text-sm font-medium text-white">${label}</span>`
        : ""}
      <div class="flex ${layoutClass}">${radios}</div>
      ${errorId
        ? `<span id="${errorId}" class="text-red-600 text-sm mt-1 hidden"></span>`
        : ""}
    </div>
  `;
}
