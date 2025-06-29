import { getButtonEl, getEl, getInputEl } from "../utility.js";
import { Span } from "./Span.js";

export type InputOptions = {
  id: string;
  label: string;
  name?: string;
  placeholder?: string;
  type?: "text" | "email" | "file" | "password";
  accept?: string;
  errorId?: string;
  hasToggle?: boolean;
};

export function Input({
  id,
  label,
  name = "",
  placeholder = "",
  type = "text",
  accept = "",
  errorId = "",
  hasToggle = false
}: InputOptions): string {
  const toggleButton = hasToggle ? getToggleButtonHTML(id) : "";
  const acceptAttr = accept ? ` accept="${accept}"` : "";
  const errorSpan = errorId ? Span({ id: errorId, variant: "error" }) : "";

  return /* HTML */ `
    <div class="w-[300px] flex flex-col gap-1">
      <label for="${id}" class="block mb-2 text-sm font-medium text-white"
        >${label}</label
      >
      <div class="relative flex items-center">
        <input
          id="${id}"
          type="${type}"
          ${acceptAttr}
          name="${name}"
          placeholder="${placeholder}"
          class="w-full bg-emerald-dark text-white border border-emerald rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
        />
        ${toggleButton}
      </div>
      ${errorSpan}
    </div>
  `;
}

function getToggleButtonHTML(id: string): string {
  return /* HTML */ `
    <button
      type="button"
      id="${id}-toggle"
      class="absolute right-2 p-2 text-teal hover:text-white"
      aria-label="Toggle password visibility"
    >
      <span id="${id}-show-eye"> ${getShowEyeHtml()} </span>
      <span id="${id}-hide-eye" class="hidden">${getHideEyeHtml()}</span>
    </button>
  `;
}
function getShowEyeHtml(): string {
  return /* HTML */ `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  `;
}

function getHideEyeHtml(): string {
  return /* HTML */ ` <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>`;
}

function togglePasswordVisibility(
  passwordEl: HTMLInputElement,
  showEyeEl: HTMLElement,
  hideEyeEl: HTMLElement
): void {
  if (passwordEl.type === "password") {
    passwordEl.type = "text";
    showEyeEl.classList.add("hidden");
    hideEyeEl.classList.remove("hidden");
  } else {
    passwordEl.type = "password";
    showEyeEl.classList.remove("hidden");
    hideEyeEl.classList.add("hidden");
  }
}

export function addTogglePasswordListener(id: string) {
  const passwordEl = getInputEl(id);
  const showEyeEl = getEl(`${id}-show-eye`);
  const hideEyeEl = getEl(`${id}-hide-eye`);
  const buttonEl = getButtonEl(`${id}-toggle`);

  buttonEl.addEventListener("click", () =>
    togglePasswordVisibility(passwordEl, showEyeEl, hideEyeEl)
  );
}
