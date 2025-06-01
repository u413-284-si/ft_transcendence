import { sanitizeHTML } from "../sanitize.js";

export default abstract class AbstractView {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  abstract createHTML(): string;

  updateHTML() {
    const html = this.createHTML();
    const cleanHTML = sanitizeHTML(html);
    document.querySelector("#app-content")!.innerHTML = cleanHTML;
  }

  async render() {}

  protected addListeners?(): void;

  unmount?(): void;

  abstract getName(): string;
}
