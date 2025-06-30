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
import { patchUser, updateUserPassword } from "../services/userServices.js";
import { User } from "../types/User.js";

export default class ProfileView extends AbstractView {
  private avatarFormEl!: HTMLFormElement;
  private profileFormEl!: HTMLFormElement;
  private passwordFormEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("Your Profile");
  }

  createHTML(): string {
    const user = auth.getUser();

    return /* HTML */ `
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
      })},
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
          Button({
            text: "Save Changes",
            type: "submit",
            variant: "default",
            size: "md"
          })
        ]
      })},
      ${Form({
        id: "password-form",
        children: [
          Paragraph({ text: "Change your password below." }),
          Input({
            id: "current-password-input",
            label: "Current Password",
            name: "currentPassword",
            type: "password",
            errorId: "current-password-error"
          }),
          Input({
            id: "new-password-input",
            label: "New Password",
            name: "newPassword",
            type: "password",
            errorId: "new-password-error"
          }),
          Button({
            text: "Change Password",
            type: "submit",
            variant: "default",
            size: "md"
          }),
          Span({
            id: "password-success-message",
            text: "Password updated successfully!",
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

    this.passwordFormEl.addEventListener("submit", (event) =>
      this.handlePasswordChange(event)
    );
  }

  async render(): Promise<void> {
    this.updateHTML();
    this.avatarFormEl = document.querySelector("#avatar-upload-form")!;
    this.profileFormEl = document.querySelector("#profile-form")!;
    this.passwordFormEl = document.querySelector("#password-form")!;
    this.addListeners();
  }

  async validateUserDataAndUpdate(event: Event) {
    event.preventDefault();

    const usernameEl = getInputEl("username-input");
    const usernameErrorEl = getEl("username-error");
    const emailEL = getInputEl("email-input");
    const emailErrorEl = getEl("email-error");

    if (
      !validateUsername(usernameEl, usernameErrorEl) ||
      !validateEmail(emailEL, emailErrorEl)
    )
      return;

    const updatedUser: User = {
      id: auth.getUser().id,
      username: usernameEl.value,
      email: emailEL.value,
      dateJoined: auth.getUser().dateJoined
    };

    try {
      const userResponse: User = await patchUser(updatedUser);
      console.log("Profile update response:", userResponse);
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

  async handlePasswordChange(event: Event) {
    event.preventDefault();

    const currentPasswordEl = getInputEl("current-password-input");
    const currentPasswordErrorEl = getEl("current-password-error");
    const newPasswordEl = getInputEl("new-password-input");
    const newPasswordErrorEl = getEl("new-password-error");
    const successEl = getEl("password-success-message");
    successEl.classList.add("hidden");

    if (
      !validatePassword(currentPasswordEl, currentPasswordErrorEl) ||
      !validatePassword(newPasswordEl, newPasswordErrorEl)
    ) {
      return;
    }

    try {
      await updateUserPassword(currentPasswordEl.value, newPasswordEl.value);
      successEl.classList.remove("hidden");
      currentPasswordEl.value = "";
      newPasswordEl.value = "";
    } catch (err) {
      router.handleError("Error in updateUserPassword()", err);
    }
  }

  getName(): string {
    return "profile";
  }
}
