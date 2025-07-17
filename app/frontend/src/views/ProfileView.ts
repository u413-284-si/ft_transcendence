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
  //FIXME: validatePassword,
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
import { ApiError, unwrap } from "../services/api.js";
import { TextBox } from "../components/TextBox.js";

export default class ProfileView extends AbstractView {
  private avatarFormEl!: HTMLFormElement;
  private profileFormEl!: HTMLFormElement;
  private passwordFormEl!: HTMLFormElement;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

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

  private getEmailInput(user: User): string {
    return Input({
      id: "email-input",
      label: "Email",
      name: "email",
      type: "email",
      placeholder: `${escapeHTML(user.email)}`,
      errorId: "email-error"
    });
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
                this.hasLocalAuth ? this.getEmailInput(user) : "",
                Button({
                  text: "Save Changes",
                  variant: "default",
                  size: "md",
                  type: "submit",
                  className: "mt-4 self-start"
                })
              ]
            })}
            ${this.hasLocalAuth
              ? this.getPasswordFormHTML()
              : TextBox({
                  text: [
                    "Signed in with Google:",
                    "",
                    "You cannot change your password or email address."
                  ],
                  variant: "warning",
                  size: "lg",
                  id: "google-warning",
                  className: "text-center"
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

    if (this.hasLocalAuth) {
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

    let valid = true;

    const usernameEl = getInputEl("username-input");
    const usernameErrorEl = getEl("username-error");
    const username = usernameEl.value;
    const hasUsername = !isEmptyString(username);

    clearInvalid(usernameEl, usernameErrorEl);

    if (hasUsername && !validateUsername(usernameEl, usernameErrorEl)) {
      valid = false;
    }

    let emailEl: HTMLInputElement | null = null;
    let email = "";
    if (this.hasLocalAuth) {
      emailEl = getInputEl("email-input");
      const emailErrorEl = getEl("email-error");
      email = emailEl.value;
      const hasEmail = !isEmptyString(email);

      clearInvalid(emailEl, emailErrorEl);

      if (hasEmail && !validateEmail(emailEl, emailErrorEl)) {
        valid = false;
      }

      if (!hasUsername && !hasEmail) {
        markInvalid(
          "Please fill in at least one field.",
          usernameEl,
          usernameErrorEl
        );
        markInvalid(
          "Please fill in at least one field.",
          emailEl,
          emailErrorEl
        );
        valid = false;
      }
    }

    if (!hasUsername && !emailEl) {
      markInvalid("Please fill in a username.", usernameEl, usernameErrorEl);
      valid = false;
    }

    if (!valid) return;

    const updatedUser: Partial<User> = {
      ...(username ? { username } : {}),
      ...(email ? { email } : {})
    };

    try {
      const apiResponse = await patchUser(updatedUser);
      if (!apiResponse.success) {
        if (apiResponse.status === 409) {
          toaster.error("Email or username already exists");
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      toaster.success("Profile updated successfully!");
      auth.updateUser(updatedUser);
      router.reload();
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
      const { avatar } = unwrap(await uploadAvatar(formData));
      toaster.success("Avatar uploaded successfully!");
      const updatedUser: Partial<User> = {
        ...(avatar ? { avatar } : {})
      };
      auth.updateUser(updatedUser);
      router.reload();
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
      unwrap(
        await updateUserPassword(currentPasswordEl.value, newPasswordEl.value)
      );
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
