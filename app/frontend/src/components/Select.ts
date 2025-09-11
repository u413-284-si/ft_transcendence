export type SelectOption = {
  value: string;
  label: string;
};

export type SelectOptions = {
  id: string;
  name: string;
  label: string;
  options: SelectOption[];
  selected?: string;
  hidden?: boolean;
  className?: string;
};

export function Select({
  id,
  name,
  label,
  options,
  selected,
  hidden = false,
  className = ""
}: SelectOptions): string {
  return /* HTML */ `
    <div id="${id}" class="${hidden ? "hidden" : ""} ${className}">
      <label for="select-${id}" class="text-md font-medium text-white">
        ${label}
      </label>
      <select
        id="select-${id}"
        name="${name}"
        class="mt-1 block w-full rounded-lg px-2 py-1 bg-black text-white border border-teal focus:outline-none focus:ring-2 focus:ring-neon-cyan"
      >
        ${options
          .map(
            (opt) => /* HTML */ `
              <option
                value="${opt.value}"
                ${selected === opt.value ? "selected" : ""}
              >
                ${opt.label}
              </option>
            `
          )
          .join("")}
      </select>
    </div>
  `;
}
