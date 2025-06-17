import AbstractView from "./AbstractView.js";
import { Form } from "../components/Form.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Paragraph } from "../components/Paragraph.js";
import { Span } from "../components/Span.js";
import { escapeHTML } from "../utility.js";
import { auth } from "../AuthManager.js";
import { uploadAvatar } from "../services/userServices.js";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateImageFile
} from "../validate.js";
import { router } from "../routing/Router.js";
import { getInputEl, getEl } from "../utility.js";
import { patchUser } from "../services/userServices.js";
import { User } from "../types/User.js";

export default class ProfileView extends AbstractView {
  private profileFormEl!: HTMLFormElement;
  private avatarFormEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("Your Profile");
  }

  createHTML(): string {
    const user = auth.getUser();

    return /* HTML */ `
      ${Form({
        id: "profile-form",
        children: [
          Paragraph({ text: "Update your profile information below." }),
          Input({
            id: "username-input",
            label: "Username",
            name: "username",
            type: "text",
            placeholder: `${escapeHTML(user.username)}`,
            errorId: "username-error"
          }),
          Input({
            id: "email-input",
            label: "Email",
            name: "email",
            type: "email",
            placeholder: `${escapeHTML(user.email)}`,
            errorId: "email-error"
          }),
          Input({
            id: "password-input",
            label: "New Password",
            name: "password",
            type: "password",
            placeholder: "Leave blank to keep current"
          }),
          Button({
            text: "Save Changes",
            type: "submit",
            variant: "default",
            size: "md"
          })
        ]
      })},
      ${Form({
        id: "avatar-upload-form",
        children: [
          Input({
            id: "avatar-input",
            label: "Change your avatar:",
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
        ]
      })}
    `;
  }

  protected addListeners() {
    this.profileFormEl.addEventListener("submit", (event) =>
      this.validateUserDataAndUpdate(event)
    );

    this.avatarFormEl.addEventListener("submit", (event) =>
      this.uploadAvatar(event)
    );
  }

  async render(): Promise<void> {
    this.updateHTML();
    this.profileFormEl = document.querySelector("#profile-form")!;
    this.avatarFormEl = document.querySelector("#avatar-upload-form")!;
    this.addListeners();
  }

  async validateUserDataAndUpdate(event: Event) {
    event.preventDefault();

    const usernameEl = getInputEl("username-input");
    const usernameErrorEl = getEl("username-error");
    const emailEL = getInputEl("email-input");
    const emailErrorEl = getEl("email-error");
    const passwordEl = getInputEl("password-input");
    const passwordErrorEl = getEl("password-error");

    const formData = new FormData(this.profileFormEl);
    if (
      !validateUsername(usernameEl, usernameErrorEl) ||
      !validateEmail(emailEL, emailErrorEl) ||
      !validatePassword(passwordEl, passwordErrorEl)
    )
      return;

    const updatedUser: User = {
      id: auth.getUser().id,
      username: usernameEl.value,
      email: emailEL.value
    };
    const password: string = formData.get("password");

    try {
      const userResponse = await patchUser(updatedUser);
      // passwordResponse
      if (password) {
        passwordResponse = await updatePassword(password); // create API endpoint for this
      }
      console.log("Profile update response:", userResponse);
      console.log("Password update response:", passwordResponse);
      // success toast
    } catch (err) {
      router.handleError("Error in patchUser()", err);
      // error toast
    }
  }

  async uploadAvatar(event: Event) {
    event.preventDefault();
    const fileInputEl = getInputEl("avatar-input");
    const errorEl = getEl("avatar-upload-error-message");
    const successEl = getEl("avatar-upload-success-message");
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

  getName(): string {
    return "profile";
  }
}
