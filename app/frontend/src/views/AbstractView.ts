import { sanitizeHTML } from "../sanitize.js";
import { getById } from "../utility.js";

export default abstract class AbstractView {
  constructor() {}

  setTitle() {
    document.title = this.getName();
  }

  async mount(): Promise<void> {
    this.render();
  }

  render(): void {
    this.updateHTML();
    this.cacheNodes();
    this.addListeners();
  }

  abstract createHTML(): string;

  updateHTML(): void {
    const html = this.createHTML();
    const cleanHTML = sanitizeHTML(html);
    const container = getById<HTMLDivElement>("app-content");
    container.innerHTML = cleanHTML;
  }

  protected cacheNodes(): void {}

  protected addListeners(): void {}

  unmount?(): void;

  abstract getName(): string;
}
