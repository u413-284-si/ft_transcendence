declare const DOMPurify: {
  sanitize: (input: string) => string;
};

export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input);
}
