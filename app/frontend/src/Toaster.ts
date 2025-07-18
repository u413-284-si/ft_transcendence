import { Toast, ToastVariant } from "./components/Toast.js";

interface ToastData {
  timeoutId: number;
  startTime: number;
  remaining: number;
}

export class Toaster {
  private notifications: HTMLElement;
  private toastTimeouts = new Map<HTMLElement, ToastData>();
  private defaultTimer: number;

  constructor(
    containerSelector: string = ".notifications",
    defaultTimer: number = 5000
  ) {
    let container = document.querySelector(containerSelector);
    if (!container) {
      container = document.createElement("ul");
      container.className = "notifications fixed top-26 right-6 space-y-2 z-50";
      document.body.appendChild(container);
    }
    this.notifications = container as HTMLElement;
    this.defaultTimer = defaultTimer;
  }

  private removeToast(toast: HTMLElement) {
    const data = this.toastTimeouts.get(toast);
    if (data) clearTimeout(data.timeoutId);
    this.toastTimeouts.delete(toast);

    toast.classList.add("animate-zoomout");
    setTimeout(() => toast.remove(), 300);
  }

  private createToast(
    variant: ToastVariant,
    text: string,
    customIcon?: string
  ) {
    const html = Toast({ variant, text, customIcon });
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const toast = template.content.firstElementChild as HTMLElement;

    // Click close button
    toast
      .querySelector("button")!
      .addEventListener("click", () => this.removeToast(toast));

    // Hover handlers: pause/resume
    toast.addEventListener("mouseenter", () => this.pauseToast(toast));
    toast.addEventListener("mouseleave", () => this.resumeToast(toast));

    this.notifications.appendChild(toast);

    // Store data
    const timeoutId = window.setTimeout(
      () => this.removeToast(toast),
      this.defaultTimer
    );
    this.toastTimeouts.set(toast, {
      timeoutId,
      startTime: Date.now(),
      remaining: this.defaultTimer
    });
  }

  private pauseToast(toast: HTMLElement) {
    const data = this.toastTimeouts.get(toast);
    if (!data) return;
    clearTimeout(data.timeoutId);
    const elapsed = Date.now() - data.startTime;
    data.remaining -= elapsed;
  }

  private resumeToast(toast: HTMLElement) {
    const data = this.toastTimeouts.get(toast);
    if (!data) return;
    data.startTime = Date.now();
    data.timeoutId = window.setTimeout(
      () => this.removeToast(toast),
      data.remaining
    );
  }

  public success(text: string, customIcon?: string) {
    this.createToast("success", text, customIcon);
  }

  public error(text: string, customIcon?: string) {
    this.createToast("error", text, customIcon);
  }

  public info(text: string, customIcon?: string) {
    this.createToast("info", text, customIcon);
  }

  public warn(text: string, customIcon?: string) {
    this.createToast("warning", text, customIcon);
  }
}

export const toaster = new Toaster();
