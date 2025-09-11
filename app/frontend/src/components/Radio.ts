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
        class="accent-neon-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
      />
      <label for="${id}" class="text-white text-md">${label}</label>
    </div>
  `;
}
