import AbstractView from "./AbstractView.js";
import { Form } from "../components/Form.js";
import { Input, addTogglePasswordListener } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Paragraph } from "../components/Paragraph.js";
import { escapeHTML, getById } from "../utility.js";
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
import { patchUser, updateUserPassword } from "../services/userServices.js";
import { User } from "../types/User.js";
import { toaster } from "../Toaster.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { TextBox } from "../components/TextBox.js";

export default class ProfileView extends AbstractView {
  private avatarFormEl!: HTMLFormElement;
  private profileFormEl!: HTMLFormElement;
  private passwordFormEl!: HTMLFormElement;
  private avatarInputEl!: HTMLInputElement;
  private fileLabelEl!: HTMLInputElement;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  constructor() {
    super();
    this.setTitle(i18next.t("profileView.title"));
  }

  private getPasswordFormHTML(): string {
    return /* HTML */ ` ${Form({
      id: "password-form",
      className: "flex flex-col gap-4",
      children: [
        Paragraph({ text: i18next.t("profileView.changePassword") }),
        Input({
          id: "current-password-input",
          label: i18next.t("global.label", {
            field: i18next.t("profileView.currentPassword")
          }),
          name: "currentPassword",
          placeholder: i18next.t("profileView.currentPassword"),
          type: "password",
          errorId: "current-password-error",
          hasToggle: true
        }),
        Input({
          id: "new-password-input",
          label: i18next.t("global.label", {
            field: i18next.t("profileView.newPassword")
          }),
          name: "newPassword",
          placeholder: i18next.t("profileView.newPassword"),
          type: "password",
          errorId: "new-password-error",
          hasToggle: true
        }),
        Input({
          id: "confirm-new-password-input",
          label: i18next.t("global.label", {
            field: i18next.t("global.confirmNewPassword")
          }),
          name: "confirmNewPassword",
          placeholder: i18next.t("global.confirmNewPassword"),
          type: "password",
          errorId: "confirm-error",
          hasToggle: true
        }),
        Button({
          text: i18next.t("profileView.changePasswordButton"),
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

      name: "email",
      type: "email",
      placeholder: `${escapeHTML(user.email)}`,
      errorId: "email-error"
    });
  }

  createHTML(): string {
    const user = auth.getUser();

    return /* HTML */ `
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row gap-10 items-start">
          <!-- Avatar Section -->
          <div
            class="md:w-2/3 flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start"
          >
            <!-- Avatar Image -->
            <img
              src=${user.avatar || "/images/default-avatar.png"}
              alt="Avatar"
              class="w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 rounded-full border-4 border-neon-cyan shadow-neon-cyan object-cover"
            />

            <!-- Avatar Upload Form -->
            <div class="flex flex-col w-full max-w-md">
              ${Form({
                id: "avatar-upload-form",
                className: "flex flex-col gap-4",
                children: [
                  Paragraph({
                    text: i18next.t("profileView.changeAvatar")
                  }),
                  Input({
                    id: "avatar-input",
                    label: i18next.t("profileView.chooseFile"),
                    name: "avatar",
                    type: "file",
                    accept: "image/*",
                    errorId: "avatar-upload-error-message",
                    noFileText: i18next.t("profileView.noFileSelected")
                  }),
                  Button({
                    text: i18next.t("profileView.uploadYourAvatar"),
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
          <div class="md:w-1/3 flex flex-col gap-16 sm:gap-24">
            ${Form({
              id: "profile-form",
              className: "flex flex-col gap-4",
              children: [
                Paragraph({ text: i18next.t("profileView.updateProfile") }),
                Input({
                  id: "username-input",
                  label: i18next.t("global.username"),
                  name: "username",
                  type: "text",
                  placeholder: `${escapeHTML(user.username)}`,
                  errorId: "username-error"
                }),
                this.hasLocalAuth ? this.getEmailInput(user) : "",
                Button({
                  text: i18next.t("profileView.saveChanges"),
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
                    i18next.t("profileView.signedInWithGoogle"),
                    "",
                    i18next.t("profileView.cannotChangeEmailOrPW")
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

    this.avatarInputEl.addEventListener("change", () => this.changeFileLabel());

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
    this.avatarFormEl = getById("avatar-upload-form");
    this.profileFormEl = getById("profile-form");
    this.passwordFormEl = getById("password-form");
    this.avatarInputEl = getById("avatar-input");
    this.fileLabelEl = getById("avatar-input-file-label");
    this.addListeners();
  }

  private async validateUserDataAndUpdate(event: Event) {
    event.preventDefault();

    let valid = true;

    const usernameEl = getById<HTMLInputElement>("username-input");
    const usernameErrorEl = getById<HTMLSpanElement>("username-error");
    const username = usernameEl.value;
    const hasUsername = !isEmptyString(username);

    clearInvalid(usernameEl, usernameErrorEl);

    if (hasUsername && !validateUsername(usernameEl, usernameErrorEl)) {
      valid = false;
    }

    let emailEl: HTMLInputElement | null = null;
    let email = "";
    if (this.hasLocalAuth) {
      emailEl = getById<HTMLInputElement>("email-input");
      const emailErrorEl = getById<HTMLSpanElement>("email-error");
      email = emailEl.value;
      const hasEmail = !isEmptyString(email);

      clearInvalid(emailEl, emailErrorEl);

      if (hasEmail && !validateEmail(emailEl, emailErrorEl)) {
        valid = false;
      }

      if (!hasUsername && !hasEmail) {
        markInvalid(
          i18next.t("invalid.fillAtLeastOneField"),
          usernameEl,
          usernameErrorEl
        );
        markInvalid(
          i18next.t("invalid.fillAtLeastOneField"),
          emailEl,
          emailErrorEl
        );
        valid = false;
      }
    }

    if (!hasUsername && !emailEl) {
      markInvalid(
        i18next.t("invalid.fillInUsername"),
        usernameEl,
        usernameErrorEl
      );
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
          toaster.error(i18next.t("toast.emailOrUsernameExists"));
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      toaster.success(i18next.t("toast.profileUpdatedSuccess"));
      await auth.updateUser(updatedUser);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toaster.error(i18next.t("toast.profileUpdateFailed"));
    }
  }

  private async uploadAvatar(event: Event) {
    event.preventDefault();
    const fileInputEl = getById<HTMLInputElement>("avatar-input");
    const errorEl = getById<HTMLSpanElement>("avatar-upload-error-message");

    if (!validateImageFile(fileInputEl, errorEl)) return;

    const formData = new FormData();
    const file = fileInputEl!.files![0];
    formData.append("avatar", file);
    try {
      const { avatar } = getDataOrThrow(await uploadAvatar(formData));
      toaster.success(i18next.t("toast.avatarUploadedSuccess"));
      const updatedUser: Partial<User> = {
        ...(avatar ? { avatar } : {})
      };
      await auth.updateUser(updatedUser);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      toaster.error(i18next.t("toast.avatarUploadFailed"));
    }
  }

  private changeFileLabel(): void {
    const files = this.avatarInputEl?.files;
    if (!files || files.length === 0) {
      this.fileLabelEl!.textContent = i18next.t("profileView.noFileSelected");
      return;
    }
    this.fileLabelEl!.textContent = files[0].name;
    this.fileLabelEl!.setAttribute("title", files[0].name);
  }

  private async handlePasswordChange(event: Event) {
    event.preventDefault();

    const currentPasswordEl = getById<HTMLInputElement>(
      "current-password-input"
    );
    // FIXME: activate when pw policy active
    // const currentPasswordErrorEl = getById<HTMLSpanElement>("current-password-error");
    const newPasswordEl = getById<HTMLInputElement>("new-password-input");
    // FIXME: activate when pw policy active
    // const newPasswordErrorEl = getById<HTMLSpanElement>("new-password-error");
    const confirmPasswordEl = getById<HTMLInputElement>(
      "confirm-new-password-input"
    );
    const confirmPasswordErrorEl = getById<HTMLSpanElement>("confirm-error");

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
      getDataOrThrow(
        await updateUserPassword(currentPasswordEl.value, newPasswordEl.value)
      );
      toaster.success(i18next.t("toast.passwordUpdatedSuccess"));
      currentPasswordEl.value = "";
      newPasswordEl.value = "";
      confirmPasswordEl.value = "";
    } catch (err) {
      console.error("Failed to update password:", err);
      toaster.error(i18next.t("toast.passwordUpdateFailed"));
    }
  }

  getName(): string {
    return "profile";
  }
}
