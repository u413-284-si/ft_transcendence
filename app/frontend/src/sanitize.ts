export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input);
}
