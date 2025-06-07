import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { uploadAvatar } from "../services/userServices.js";
import { router } from "../routing/Router.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  createHTML() {
    return /* HTML */ `
      <h1>Home</h1>
      <p>Hello ${escapeHTML(auth.getToken().username)}!</p>
      <p>This is the home page</p>
      <form
        id="avatar-upload-form"
        class="mt-4 flex flex-col items-start space-y-2"
      >
        <label for="avatar" class="font-semibold">Upload Your Avatar:</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          class="border border-blue-500 rounded p-2"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Avatar
        </button>
        <span id="avatar-upload-message" class="text-sm mt-2"></span>
      </form>
    `;
  }

  protected addListeners() {
    document
      .querySelector("#avatar-upload-form")!
      .addEventListener("submit", (event) => this.uploadAvatar(event));
  }

  private async uploadAvatar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fileInput = form.querySelector<HTMLInputElement>("#avatar");
    const messageEl = form.querySelector<HTMLSpanElement>(
      "#avatar-upload-message"
    );

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      messageEl!.textContent = "Please select a file to upload.";
      return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/")) {
      messageEl!.textContent = "Please upload a valid image file.";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await uploadAvatar(formData);
      console.log("Avatar upload response:", response);
      messageEl!.textContent = "Avatar uploaded successfully!";
    } catch (error) {
      router.handleError("Error in uploadAvatar()", error);
      messageEl!.textContent = "Failed to upload avatar. Please try again.";
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
