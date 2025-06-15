export type FormOptions = {
  children: string[];
  action?: string;
  method?: "GET" | "POST";
  className?: string;
  id?: string;
};

export function Form({
  children,
  action = "",
  method = "POST",
  className = "",
  id = ""
}: FormOptions): string {
  const classes = [
    "flex flex-col justify-center items-center gap-4", // default styling
    className ?? ""
  ].join(" ");

  return `
    <form ${id ? `id="${id}"` : ""} action="${action}" method="${method}" class="${classes}">
      ${children.join("\n")}
    </form>
  `;
}
