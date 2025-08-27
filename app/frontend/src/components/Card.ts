export type CardOptions = {
  children: string[];
  className?: string;
  id?: string;
};

export function Card({
  children,
  className = "bg-emerald-dark/60 border border-neon-cyan rounded-lg p-4 flex flex-col space-y-4",
  id = ""
}: CardOptions): string {
  const idAttr = id ? `id="${id}"` : "";

  return `
    <div ${idAttr} class="${className}">
      ${children.join("\n")}
    </div>
  `;
}
