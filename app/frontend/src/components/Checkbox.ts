export type CheckboxOptions = {
  id: string;
  name: string;
  value?: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({
  id,
  name,
  value = "on",
  label,
  checked = false,
  disabled = false,
  className = ""
}: CheckboxOptions): string {
  return /* HTML */ `
    <div class="flex items-center gap-2 ${className}">
      <input
        type="checkbox"
        id="${id}"
        name="${name}"
        value="${value}"
        ${checked ? "checked" : ""}
        ${disabled ? "disabled" : ""}
        class="accent-neon-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      />
      <label for="${id}" class="text-white text-sm">${label}</label>
    </div>
  `;
}
