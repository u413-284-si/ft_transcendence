import { getById } from "../utility.js";
import { Span } from "./Span.js";

export type InputOptions = {
  id: string;
  label?: string;
  name?: string;
  placeholder?: string;
  type?: "text" | "email" | "file" | "password";
  accept?: string;
  errorId?: string;
  hasToggle?: boolean;
  noFileText?: string;
  className?: string;
};

export function Input({
  id,
  label = "",
  name = "",
  placeholder = "",
  type = "text",
  accept = "",
  errorId = "",
  hasToggle = false,
  noFileText = "No file selected",
  className = ""
}: InputOptions): string {
  const acceptAttr = accept ? ` accept="${accept}"` : "";
  const errorSpan = renderErrorSpan(errorId);
  const labelHtml = renderLabel(id, label);

  let inputHtml = "";

  if (type === "file") {
    inputHtml = renderFileInput(id, name, acceptAttr, noFileText);
  } else {
    const baseStyles =
      "w-full bg-emerald-dark text-white border border-emerald rounded-md hover:bg-emerald transition px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan";
    const classes = `${baseStyles} ${className}`.trim();
    const toggleButton = hasToggle ? getToggleButtonHTML(id) : "";
    inputHtml = renderStandardInput(
      id,
      type,
      name,
      placeholder,
      acceptAttr,
      classes,
      toggleButton
    );
  }

  return /* HTML */ `
    <div class="w-full max-w-md flex flex-col gap-1">
      ${labelHtml} ${inputHtml} ${errorSpan}
    </div>
  `;
}

// === Helper Functions ===

function renderLabel(id: string, label: string): string {
  return /* HTML */ `
    <label for="${id}" class="text-sm font-medium text-white text-left">
      ${label}
    </label>
  `;
}

function renderErrorSpan(errorId?: string): string {
  return errorId ? Span({ id: errorId, variant: "error" }) : "";
}

function renderFileInput(
  id: string,
  name: string,
  acceptAttr: string,
  noFileText: string
): string {
  return /* HTML */ `
    <label
      tabindex="0"
      id="${id}-file-label"
      for="${id}"
      class="text-sm inline-block cursor-pointer bg-emerald-dark text-white/50 px-4 py-3 rounded hover:bg-emerald transition max-w-full truncate overflow-hidden border border-emerald focus:outline-none focus:ring-2 focus:ring-neon-cyan whitespace-nowrap"
    >
      ${noFileText}
    </label>
    <input id="${id}" type="file" ${acceptAttr} name="${name}" class="hidden" />
  `;
}

function renderStandardInput(
  id: string,
  type: string,
  name: string,
  placeholder: string,
  acceptAttr: string,
  classes: string,
  toggleButton: string
): string {
  return /* HTML */ `
    <div class="relative flex items-center">
      <input
        id="${id}"
        type="${type}"
        ${acceptAttr}
        name="${name}"
        placeholder="${placeholder}"
        class="${classes}"
        value=""
      />
      ${toggleButton}
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
      <span id="${id}-show-eye">${getEyeIconHTML("show")}</span>
      <span id="${id}-hide-eye" class="hidden">${getEyeIconHTML("hide")}</span>
    </button>
  `;
}

function getEyeIconHTML(type: "show" | "hide"): string {
  return type === "show"
    ? /* HTML */ `
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
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007
            9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5
            12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      `
    : /* HTML */ `
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
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5
            12 19.5c.993 0 1.953-.138 2.863-.395M6.228
            6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773
            3.162 10.065 7.498a10.522 10.522 0 0 1-4.293
            5.774M6.228 6.228 3 3m3.228 3.228 3.65
            3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0
            0a3 3 0 1 0-4.243-4.243m4.242
            4.242L9.88 9.88"
          />
        </svg>
      `;
}

// === Password toggle support ===

function togglePasswordVisibility(
  passwordEl: HTMLInputElement,
  showEyeEl: HTMLSpanElement,
  hideEyeEl: HTMLSpanElement
): void {
  const isHidden = passwordEl.type === "password";
  passwordEl.type = isHidden ? "text" : "password";
  showEyeEl.classList.toggle("hidden", isHidden);
  hideEyeEl.classList.toggle("hidden", !isHidden);
}

export function addTogglePasswordListener(id: string) {
  const passwordEl = getById<HTMLInputElement>(id);
  const showEyeEl = getById<HTMLSpanElement>(`${id}-show-eye`);
  const hideEyeEl = getById<HTMLSpanElement>(`${id}-hide-eye`);
  const buttonEl = getById<HTMLButtonElement>(`${id}-toggle`);

  buttonEl.addEventListener("click", () =>
    togglePasswordVisibility(passwordEl, showEyeEl, hideEyeEl)
  );
}
