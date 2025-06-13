import { Toast, ToastVariant } from "./components/Toast.js";

export class Toaster {
  private notifications: HTMLElement;
  private toastTimeouts = new Map<HTMLElement, number>();
  private defaultTimer: number;

  constructor(
    containerSelector: string = ".notifications",
    defaultTimer: number = 5000
  ) {
    let container = document.querySelector(containerSelector);
    if (!container) {
      // Auto-create the container if not found
      container = document.createElement("ul");
      container.className = "notifications fixed top-8 right-6 space-y-2 z-50";
      document.body.appendChild(container);
    }
    this.notifications = container as HTMLElement;
    this.defaultTimer = defaultTimer;
  }

  private createToast(
    variant: ToastVariant,
    text: string,
    timer: number = this.defaultTimer
  ) {
    const html = Toast({ variant, text });
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const toast = template.content.firstElementChild as HTMLElement;

    toast
      .querySelector("button")!
      .addEventListener("click", () => this.removeToast(toast));
    this.notifications.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.replace("translate-x-full", "translate-x-0");
    });

    const timeoutId = window.setTimeout(() => this.removeToast(toast), timer);
    this.toastTimeouts.set(toast, timeoutId);
  }

  private removeToast(toast: HTMLElement) {
    const timeoutId = this.toastTimeouts.get(toast);
    if (timeoutId) clearTimeout(timeoutId);
    this.toastTimeouts.delete(toast);

    toast.classList.add("translate-x-full");
    setTimeout(() => toast.remove(), 300);
  }

  public success(text: string) {
    this.createToast("success", text);
  }

  public error(text: string) {
    this.createToast("error", text);
  }

  public info(text: string) {
    this.createToast("info", text);
  }

  public warn(text: string) {
    this.createToast("warning", text);
  }
}
