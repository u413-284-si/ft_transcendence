import AbstractView from "./AbstractView.js";
import { Form } from "../components/Form.js";
import { Input, addTogglePasswordListener } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Paragraph } from "../components/Paragraph.js";
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
  clearInvalid,
  isEmptyString
} from "../validate.js";
import { router } from "../routing/Router.js";
import { getInputEl, getEl } from "../utility.js";
import { patchUser, updateUserPassword } from "../services/userServices.js";
import { User } from "../types/User.js";
import { toaster } from "../Toaster.js";
import { ApiError } from "../services/api.js";

export default class ProfileView extends AbstractView {
  private avatarFormEl!: HTMLFormElement;
  private profileFormEl!: HTMLFormElement;
  private passwordFormEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("Your Profile");
  }

  private getPasswordFormHTML(): string {
    return /* HTML */ ` ${Form({
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
    })}`;
  }

  createHTML(): string {
    const user = auth.getUser();

    return /* HTML */ `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
        >
          <!-- Avatar Section -->
          <div
            class="md:col-span-7 flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start"
          >
            <!-- Avatar Image -->
            <img
              src=${user.avatar || "/images/default-avatar.png"}
              alt="Avatar"
              class="w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 rounded-full border-4 border-neon-cyan shadow-neon-cyan object-cover"
            />

            <!-- Avatar Upload Form -->
            <div class="flex flex-col w-full max-w-xs">
              ${Form({
                id: "avatar-upload-form",
                className: "flex flex-col gap-4",
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
                    className: "mt-2 self-start"
                  })
                ]
              })}
            </div>
          </div>

          <!-- Profile and Password Forms -->
          <div class="md:col-span-5 flex flex-col gap-16 sm:gap-24">
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
            ${auth.getUser().authentication.authProvider === "LOCAL"
              ? this.getPasswordFormHTML()
              : ""}
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

    if (auth.getUser().authentication.authProvider === "LOCAL") {
      this.passwordFormEl.addEventListener("submit", (event) =>
        this.handlePasswordChange(event)
      );

      addTogglePasswordListener("current-password-input");
      addTogglePasswordListener("new-password-input");
      addTogglePasswordListener("confirm-new-password-input");
    }
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
    const hasUsername = !isEmptyString(username);
    const hasEmail = !isEmptyString(email);

    clearInvalid(usernameEl, usernameErrorEl);
    clearInvalid(emailEL, emailErrorEl);

    if (hasUsername && !validateUsername(usernameEl, usernameErrorEl)) {
      valid = false;
    }
    if (hasEmail && !validateEmail(emailEL, emailErrorEl)) {
      valid = false;
    }
    if (!hasUsername && !hasEmail) {
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
      ...(username ? { username } : {}),
      ...(email ? { email } : {})
    };

    try {
      await patchUser(updatedUser);
      toaster.success("Profile updated successfully!");
      usernameEl.value = "";
      emailEL.value = "";
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toaster.error("Email or username already exists");
        return;
      }
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
      await uploadAvatar(formData);
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
