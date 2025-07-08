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
import { ApiError } from "../services/api.js";

export default class ProfileView extends AbstractView {
  private avatarFormEl!: HTMLFormElement;
  private profileFormEl!: HTMLFormElement;
  private passwordFormEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle(i18next.t("yourProfile"));
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
                  Paragraph({ text: i18next.t("changeAvatarText") }),
                  Input({
                    id: "avatar-input",
                    label: i18next.t("uploadAvatar"),
                    name: "avatar",
                    type: "file",
                    accept: "image/*",
                    errorId: "avatar-upload-error-message"
                  }),
                  Button({
                    text: i18next.t("uploadAvatar"),
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
                Paragraph({ text: i18next.t("updateProfileText") }),
                Input({
                  id: "username-input",
                  label: i18next.t("usernameLabel"),
                  name: "username",
                  type: "text",
                  placeholder: `${escapeHTML(user.username)}`,
                  errorId: "username-error"
                }),
                Input({
                  id: "email-input",
                  label: i18next.t("emailLabel"),
                  name: "email",
                  type: "email",
                  placeholder: `${escapeHTML(user.email)}`,
                  errorId: "email-error"
                }),
                Button({
                  text: i18next.t("saveChangesButton"),
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
                Paragraph({ text: i18next.t("changePasswordText") }),
                Input({
                  id: "current-password-input",
                  label: i18next.t("currentPasswordLabel"),
                  name: "currentPassword",
                  placeholder: i18next.t("currentPasswordLabel"),
                  type: "password",
                  errorId: "current-password-error",
                  hasToggle: true
                }),
                Input({
                  id: "new-password-input",
                  label: i18next.t("newPasswordLabel"),
                  name: "newPassword",
                  placeholder: i18next.t("newPasswordLabel"),
                  type: "password",
                  errorId: "new-password-error",
                  hasToggle: true
                }),
                Input({
                  id: "confirm-new-password-input",
                  label: i18next.t("confirmNewPasswordLabel"),
                  name: "confirmNewPassword",
                  placeholder: i18next.t("confirmNewPasswordLabel"),
                  type: "password",
                  errorId: "confirm-error",
                  hasToggle: true
                }),
                Button({
                  text: i18next.t("changePasswordButton"),
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
        i18next.t("fillAtLeastOneField"),
        usernameEl,
        usernameErrorEl
      );
      markInvalid(i18next.t("fillAtLeastOneField"), emailEL, emailErrorEl);
      valid = false;
    }
    if (!valid) return;

    const updatedUser: Partial<User> = {
      ...(username ? { username } : {}),
      ...(email ? { email } : {})
    };

    try {
      await patchUser(updatedUser);
      toaster.success(i18next.t("profileUpdatedSuccess"));
      auth.updateUser(updatedUser);
      router.reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toaster.error(i18next.t("emailOrUsernameExists"));
        return;
      }
      toaster.error(i18next.t("profileUpdateFailed"));
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
      const { avatar } = await uploadAvatar(formData);
      toaster.success(i18next.t("avatarUploadedSuccess"));
      const updatedUser: Partial<User> = {
        ...(avatar ? { avatar } : {})
      };
      auth.updateUser(updatedUser);
      router.reload();
    } catch (error) {
      toaster.error(i18next.t("avatarUploadFailed"));
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
      toaster.success(i18next.t("passwordUpdatedSuccess"));
      currentPasswordEl.value = "";
      newPasswordEl.value = "";
      confirmPasswordEl.value = "";
    } catch (err) {
      toaster.error("passwordUpdateFailed");
      router.handleError("Error in updateUserPassword()", err);
    }
  }

  getName(): string {
    return "profile";
  }
}
