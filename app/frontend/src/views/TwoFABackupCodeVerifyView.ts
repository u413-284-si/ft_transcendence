import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import {
  markInvalid,
  validatTwoFABackupCode as validateTwoFABackupCode
} from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getEl } from "../utility.js";
import { verifyBackupCode } from "../services/authServices.js";
import { ApiError } from "../services/api.js";

export default class TwoFABackupCodeVerifyView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("twoFABackupCodeVerifyView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        id: "two-fa-verify-backup-code-form",
        children: [
          Input({
            id: "two-fa-backup-code-input",
            label: i18next.t("twoFABackupCodeVerifyView.enterTwoFABackupCode"),
            name: "two-fa-backup-code-input",
            placeholder: i18next.t("twoFABackupCodeVerifyView.twoFABackupCode"),
            type: "text",
            errorId: "two-fa-backup-code-input-error"
          }),
          Button({
            text: i18next.t("global.submit"),
            variant: "default",
            size: "md",
            type: "submit"
          })
        ]
      })}
    `;
  }

  protected addListeners() {
    document
      .getElementById("two-fa-verify-backup-code-form")
      ?.addEventListener("submit", (event) => this.verifTwoFABackupCode(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "twoFABackupCodeVerification";
  }

  private async verifTwoFABackupCode(event: Event) {
    event.preventDefault();
    const twoFABackupCodeInput = getEl(
      "two-fa-backup-code-input"
    ) as HTMLInputElement;
    const twoFABackupCodeErrorEl = getEl("two-fa-backup-code-input-error");

    const isBackupCodeValid = await validateTwoFABackupCode(
      twoFABackupCodeInput,
      twoFABackupCodeErrorEl
    );
    if (!isBackupCodeValid) {
      return;
    }

    const apiResponse = await verifyBackupCode(twoFABackupCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid(
          i18next.t("invalid.twoFABackupCode"),
          twoFABackupCodeInput,
          twoFABackupCodeErrorEl
        );
        return;
      } else {
        throw new ApiError(apiResponse);
      }
    }

    const isAllowed = await auth.loginAfterTwoFA();
    if (!isAllowed) return;
    router.navigate("/home", false);
  }
}
