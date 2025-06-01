import { sanitizeHTML } from "../sanitize.js";

export default abstract class AbstractView {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  abstract createHTML(): string;

  updateHTML(): void {
    const html = this.createHTML();
    const cleanHTML = sanitizeHTML(html);
    document.querySelector("#app-content")!.innerHTML = cleanHTML;
  }

  abstract render(): Promise<void>;

  protected addListeners?(): void;

  unmount?(): void;

  abstract getName(): string;
}
