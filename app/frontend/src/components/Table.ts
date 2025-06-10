export type TableOptions = {
  headers: string[];
  rows: string[];
  id?: string;
  className?: string;
};

export function Table({
  headers,
  rows,
  id,
  className = ""
}: TableOptions): string {
  const idAttr = id ? ` id="${id}"` : "";
  return /* HTML */ `
    <div class="overflow-x-auto">
      <table
        ${idAttr}
        class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500 ${className}"
      >
        <thead class="bg-blue-800">
          <tr>
            ${headers
              .map(
                (header) =>
                  `<th class="border border-blue-500 px-4 py-2">${header}</th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody class="bg-blue-700 divide-y divide-blue-500">
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}
