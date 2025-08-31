import { sanitizeHTML } from "../sanitize.js";
import { getById } from "../utility.js";

export default abstract class AbstractView {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  abstract createHTML(): string;

  updateHTML(): void {
    const html = this.createHTML();
    const cleanHTML = sanitizeHTML(html);
    const container = getById<HTMLDivElement>("app-content");
    container.innerHTML = cleanHTML;
  }

  abstract render(): Promise<void>;

  protected addListeners?(): void;

  unmount?(): void;

  abstract getName(): string;
}
