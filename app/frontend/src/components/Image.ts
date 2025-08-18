export type ImageOptions = {
  id?: string;
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const imageSizes: Record<string, string> = {
  sm: "px-3 py-1",
  md: "px-4 py-2",
  lg: "px-6 py-3"
};

export function Image({
  id,
  src,
  alt,
  size = "md",
  className = ""
}: ImageOptions): string {
  const classes = ["rounded-md", imageSizes[size], className].join(" ");
  const idAttr = id ? ` id="${id}"` : "";
  return `<image${idAttr} src="${src}" alt="${alt}" class="${classes}">`;
}
