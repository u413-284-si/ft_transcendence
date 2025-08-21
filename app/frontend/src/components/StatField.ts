export type StatFieldOptions = {
  value: string;
  text: string;
  id?: string;
};

export function StatField({ value, text, id = "" }: StatFieldOptions): string {
  const classes =
    "flex flex-col justify-center w-48 h-20 px-4 py-2 border border-neon-cyan rounded hover:shadow-neon-cyan text-center";
  const idAttr = id ? ` id="${id}"` : "";

  return /* HTML */ `
  <div${idAttr} class="${classes}">
    <p class="text-2xl font-bold">${value}</p>
    <p class="text-sm uppercase">${text}</p>
  </div>
  `;
}
export function StatFieldGroup(fields: StatFieldOptions[]): string {
  const wrapperClasses = "flex flex-wrap gap-4 ml-8";

  const fieldsHtml = fields.map(StatField).join("\n");

  return /* HTML */ ` <div class="${wrapperClasses}">${fieldsHtml}</div> `;
}
