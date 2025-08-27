export type CardOptions = {
  children: string[];
  className?: string;
  id?: string;
};

export function Card({
  children,
  className = "",
  id = ""
}: CardOptions): string {
  const idAttr = id ? `id="${id}"` : "";
  const baseStyles =
    "bg-emerald-dark/60 border border-neon-cyan rounded-lg p-4 flex flex-col space-y-4";
  const classes = `${baseStyles} ${className}`.trim();

  return `
    <div ${idAttr} class="${classes}">
      ${children.join("\n")}
    </div>
  `;
}
