export type StatFieldOptions = {
  value: string;
  text: string;
  id?: string;
};

export function StatField({ value, text, id = "" }: StatFieldOptions): string {
  const classes =
    "w-30 px-4 py-2 border border-neon-cyan rounded hover:shadow-neon-cyan text-center";
  const idAttr = id ? ` id="${id}"` : "";

  return /* HTML */ `
  <div${idAttr} class="${classes}">
    <p class="text-lg font-bold">${value}</p>
    <p class="text-xs uppercase">${text}</p>
  </div>
  `;
}

export function StatFieldGroup(fields: StatFieldOptions[]): string {
  const wrapperClasses = "flex flex-wrap gap-4 ml-8";

  const fieldsHtml = fields.map(StatField).join("\n");

  return /* HTML */ ` <div class="${wrapperClasses}">${fieldsHtml}</div> `;
}
