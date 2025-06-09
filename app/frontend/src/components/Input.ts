export type InputOptions = {
  id: string;
  label: string;
  name?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "file";
  accept?: string;
  errorId?: string;
};

export function Input({
  id,
  label,
  name = "",
  placeholder = "",
  type = "text",
  accept = "",
  errorId = ""
}: InputOptions): string {
  const acceptAttr = accept ? ` accept="${accept}"` : "";
  const input = `
    <label class="text-sm font-medium text-white">${label}</label>
    <input
      id="${id}"
      type="${type}"
      ${acceptAttr}
      name="${name}"
      placeholder="${placeholder}"
      class="w-full bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
    ${errorId ? `<span id="${errorId}" class="text-red-600 text-sm mt-1 hidden"></span>` : ""}
  `;

  return `<div class="w-[300px] flex flex-col gap-1">${input}</div>`;
}
