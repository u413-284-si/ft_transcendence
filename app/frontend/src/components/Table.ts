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
    <div class="overflow-x-auto mb-8">
      <table
        ${idAttr}
        class="table-auto w-full border-collapse border border-dark-emerald text-white divide-y divide-dark-emerald ${className}"
      >
        <thead class="bg-dark-emerald">
          <tr>
            ${headers
              .map(
                (header) =>
                  `<th class="border border-dark-emerald px-4 py-2">${header}</th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody class="bg-emerald divide-y divide-dark-emerald">
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}
