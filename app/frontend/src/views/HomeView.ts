import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { uploadAvatar } from "../services/userServices.js";
import { router } from "../routing/Router.js";
import { validateImageFile } from "../validate.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Span } from "../components/Span.js";
import { Form } from "../components/Form.js";
import { toaster } from "../Toaster.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  createHTML() {
    return /* HTML */ `
      <div class="flex flex-col justify-center items-center gap-4 mb-12">
        ${Header1({
          text: "Home",
          id: "home-header",
          variant: "default"
        })}
        ${Paragraph({
          text: `Hello ${escapeHTML(auth.getToken().username)}!
            <br />
            This is the home page`
        })}
      </div>

      ${Form({
        children: [
          Input({
            id: "avatar",
            label: "Upload Your Avatar:",
            name: "avatar",
            type: "file",
            accept: "image/*",
            errorId: "avatar-upload-error-message"
          }),
          Button({
            text: "Upload Avatar",
            variant: "default",
            size: "md",
            type: "submit"
          }),
          Span({
            text: "Avatar uploaded successfully!",
            id: "avatar-upload-success-message",
            variant: "success",
            className: "hidden"
          })
        ],
        id: "avatar-upload-form"
      })}

      <div>
        <h1 class="mt-12">Test Buttons for toast</h1>
        <button id="button1" class="px-6 py-3 bg-green-500 text-white rounded">
          Success
        </button>
        <button id="button2" class="px-6 py-3 bg-red-500 text-white rounded">
          Error
        </button>
        <button id="button3" class="px-6 py-3 bg-yellow-500 text-white rounded">
          Warning
        </button>
        <button id="button4" class="px-6 py-3 bg-blue-500 text-white rounded">
          Info
        </button>
      </div>
    `;
  }

  protected addListeners() {
    document
      .querySelector("#avatar-upload-form")!
      .addEventListener("submit", (event) => this.uploadAvatar(event));

    document.getElementById("button1")!.addEventListener("click", () => {
      toaster.success("This is a succesful toast");
    });
    document.getElementById("button2")!.addEventListener("click", () => {
      toaster.error("This is an error toast");
    });
    document.getElementById("button3")!.addEventListener("click", () => {
      toaster.warn(
        "A warning toast which is very long text so it will have a text break"
      );
    });
    document.getElementById("button4")!.addEventListener("click", () => {
      toaster.info("A info toast to show that something happened");
    });
  }

  private async uploadAvatar(event: Event) {
    event.preventDefault();
    const fileInputEl = document.getElementById("avatar") as HTMLInputElement;
    const errorEl = document.getElementById(
      "avatar-upload-error-message"
    ) as HTMLElement;
    const successEl = document.getElementById(
      "avatar-upload-success-message"
    ) as HTMLElement;
    successEl.classList.add("hidden");

    if (!validateImageFile(fileInputEl, errorEl)) return;

    const formData = new FormData();
    const file = fileInputEl!.files![0];
    formData.append("avatar", file);
    try {
      const response = await uploadAvatar(formData);
      console.log("Avatar upload response:", response);
      successEl.classList.remove("hidden");
      fileInputEl.value = "";
    } catch (error) {
      router.handleError("Error in uploadAvatar()", error);
    }
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "home";
  }
}
