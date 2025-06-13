import { Toast, ToastVariant } from "./components/Toast.js";

const toastTimeouts = new Map<HTMLElement, number>();

export const removeToast = (toast: HTMLElement) => {
  const timeoutId = toastTimeouts.get(toast);
  if (timeoutId) clearTimeout(timeoutId);
  toastTimeouts.delete(toast);

  toast.classList.add("translate-x-full");
  setTimeout(() => toast.remove(), 300);
};

export const createToast = (
  variant: ToastVariant,
  text: string,
  timer: number = 5000
) => {
  const notifications = document.querySelector(".notifications") as HTMLElement;
  console.log("Creating new toast");
  const html = Toast({ variant, text });

  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const toast = template.content.firstElementChild as HTMLElement;

  toast
    .querySelector("button")!
    .addEventListener("click", () => removeToast(toast));
  console.log("notifications:", notifications);
  notifications.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.replace("translate-x-full", "translate-x-0");
  });

  // ✅ Store timeout in map, not in DOM
  const timeoutId = window.setTimeout(() => removeToast(toast), timer);
  toastTimeouts.set(toast, timeoutId);
};
