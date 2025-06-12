export type RadioOptions = {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  className?: string;
};

export function Radio({
  id,
  name,
  value,
  label,
  checked = false,
  className = ""
}: RadioOptions): string {
  return /* HTML */ `
    <div class="flex items-center gap-2 ${className}">
      <input
        type="radio"
        id="${id}"
        name="${name}"
        value="${value}"
        ${checked ? "checked" : ""}
        class="text-orange-500 focus:ring-2 focus:ring-orange-400"
      />
      <label for="${id}" class="text-white text-sm">${label}</label>
    </div>
  `;
}
