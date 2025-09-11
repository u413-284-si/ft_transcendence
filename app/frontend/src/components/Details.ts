export type DetailsOptions = {
  id?: string;
  summary: string;
  content: string;
  open?: boolean;
  className?: string;
};

export function Details({
  id,
  summary,
  content,
  open = false,
  className = ""
}: DetailsOptions): string {
  return /* HTML */ `
    <details
      ${id ? `id="${id}"` : ""}
      class="group border-b border-grey pb-2 ${className}"
      ${open ? "open" : ""}
    >
      <summary
        class="flex justify-between items-center cursor-pointer py-2 text-xl font-medium text-neon-cyan focus:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg"
      >
        ${summary}
        <span class="transition-transform group-open:rotate-45 text-neon-cyan">
          +
        </span>
      </summary>
      <div class="mt-2 text-grey">${content}</div>
    </details>
  `;
}
