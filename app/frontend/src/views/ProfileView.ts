import AbstractView from "./AbstractView.js";
import { Form } from "../components/Form.js";
import { Input, addTogglePasswordListener } from "../components/Input.js";
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
  validateConfirmPassword,
  validateImageFile,
  markInvalid,
  clearInvalid
} from "../validate.js";
import { router } from "../routing/Router.js";
import { getInputEl, getEl } from "../utility.js";
import { patchUser, updateUserPassword } from "../services/userServices.js";
import { User } from "../types/User.js";
import { toaster } from "../Toaster.js";

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
    <div class="max-w-full mx-auto px-80 py-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div class="md:col-span-7 flex gap-12">
          <!-- Avatar Image -->
          <img
            src=${user.avatar || "/images/default-avatar.png"}
            alt="Avatar"
            class="w-60 h-60 rounded-full border-4 border-neon-cyan shadow-neon-cyan"
          />
          <!-- Avatar Upload Form -->
          <div class="flex flex-col max-w-s">
            ${Form({
              id: "avatar-upload-form",
              className: "flex flex-col gap-4 w-full",
              children: [
                Paragraph({ text: "Change your avatar below." }),
                Input({
                  id: "avatar-input",
                  label: "Upload Avatar:",
                  name: "avatar",
                  type: "file",
                  accept: "image/*",
                  errorId: "avatar-upload-error-message"
                }),
                Button({
                  text: "Upload Avatar",
                  variant: "default",
                  size: "md",
                  type: "submit",
                  className: "mt-2"
                })
              ]
            })}
          </div>
        </div>

        <!-- Profile + Password Forms -->
        <div class="md:col-span-5 flex flex-col gap-24">
          ${Form({
            id: "profile-form",
            className: "flex flex-col gap-4",
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
                variant: "default",
                size: "md",
                type: "submit",
                className: "mt-4 self-start"
              })
            ]
          })}

          ${Form({
            id: "password-form",
            className: "flex flex-col gap-4",
            children: [
              Paragraph({ text: "Change your password below." }),
              Input({
                id: "current-password-input",
                label: "Current Password",
                name: "currentPassword",
                placeholder: "Current Password",
                type: "password",
                errorId: "current-password-error",
                hasToggle: true
              }),
              Input({
                id: "new-password-input",
                label: "New Password",
                name: "newPassword",
                placeholder: "New Password",
                type: "password",
                errorId: "new-password-error",
                hasToggle: true
              }),
              Input({
                id: "confirm-new-password-input",
                label: "Confirm New Password",
                name: "confirmNewPassword",
                placeholder: "Confirm New Password",
                type: "password",
                errorId: "confirm-error",
                hasToggle: true
              }),
              Button({
                text: "Change Password",
                variant: "default",
                size: "md",
                type: "submit",
                className: "mt-4 self-start"
              })
            ]
          })}
        </div>
      </div>
    </div>
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

    addTogglePasswordListener("current-password-input");
    addTogglePasswordListener("new-password-input");
    addTogglePasswordListener("confirm-new-password-input");
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
    let valid = true;
    const username = usernameEl.value;
    const email = emailEL.value;

    clearInvalid(usernameEl, usernameErrorEl);
    clearInvalid(emailEL, emailErrorEl);

    if (username !== "" && !validateUsername(usernameEl, usernameErrorEl)) {
      valid = false;
    }
    if (email !== "" && !validateEmail(emailEL, emailErrorEl)) {
      valid = false;
    }
    if (username === "" && email === "") {
      markInvalid(
        "Please fill in at least one field.",
        usernameEl,
        usernameErrorEl
      );
      markInvalid("Please fill in at least one field.", emailEL, emailErrorEl);
      valid = false;
    }
    if (!valid) return;

    const updatedUser: Partial<User> = {
      id: auth.getUser().id,
      dateJoined: auth.getUser().dateJoined
    };
    if (username !== "") {
      updatedUser.username = username;
    }
    if (email !== "") {
      updatedUser.email = email;
    }

    try {
      const userResponse: User = await patchUser(updatedUser);
      console.log("Profile update response:", userResponse);
      toaster.success("Profile updated successfully!");
    } catch (err) {
      toaster.error("Failed to update profile. Please try again.");
      router.handleError("Error in patchUser()", err);
    }
  }

  async uploadAvatar(event: Event) {
    event.preventDefault();
    const fileInputEl = getInputEl("avatar-input");
    const errorEl = getEl("avatar-upload-error-message");

    if (!validateImageFile(fileInputEl, errorEl)) return;

    const formData = new FormData();
    const file = fileInputEl!.files![0];
    formData.append("avatar", file);
    try {
      const response = await uploadAvatar(formData);
      console.log("Avatar upload response:", response);
      toaster.success("Avatar uploaded successfully!");
      fileInputEl.value = "";
    } catch (error) {
      toaster.error("Failed to upload avatar. Please try again.");
      router.handleError("Error in uploadAvatar()", error);
    }
  }

  async handlePasswordChange(event: Event) {
    event.preventDefault();

    const currentPasswordEl = getInputEl("current-password-input");
    // FIXME: activate when pw policy active
    // const currentPasswordErrorEl = getEl("current-password-error");
    const newPasswordEl = getInputEl("new-password-input");
    // FIXME: activate when pw policy active
    // const newPasswordErrorEl = getEl("new-password-error");
    const confirmPasswordEl = getInputEl("confirm-new-password-input");
    const confirmPasswordErrorEl = getEl("confirm-error");

    if (
      !validateConfirmPassword(
        newPasswordEl,
        confirmPasswordEl,
        confirmPasswordErrorEl
      )
    ) {
      return;
    }
    // FIXME: activate when pw policy active
    // if (
    //   !validatePassword(currentPasswordEl, currentPasswordErrorEl) ||
    //   !validatePassword(newPasswordEl, newPasswordErrorEl)
    // ) {
    //   return;
    // }

    try {
      await updateUserPassword(currentPasswordEl.value, newPasswordEl.value);
      toaster.success("Password updated successfully!");
      currentPasswordEl.value = "";
      newPasswordEl.value = "";
      confirmPasswordEl.value = "";
    } catch (err) {
      toaster.error("Failed to update password. Please try again.");
      router.handleError("Error in updateUserPassword()", err);
    }
  }

  getName(): string {
    return "profile";
  }
}
