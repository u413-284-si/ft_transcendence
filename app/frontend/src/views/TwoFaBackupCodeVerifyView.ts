import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import {
  markInvalid,
  validatTwoFaBackupCode as validateTwoFaBackupCode
} from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getEl } from "../utility.js";
import { verifyBackupCode } from "../services/authServices.js";
import { ApiError } from "../services/api.js";

export default class TwoFaBackupCodeVerifyView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("twoFaBackupCodeVerifyView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        id: "two-fa-verify-backup-code-form",
        children: [
          Input({
            id: "two-fa-backup-code-input",
            label: i18next.t("twoFaBackupCodeVerifyView.enterTwoFaBackupCode"),
            name: "two-fa-backup-code-input",
            placeholder: i18next.t("twoFaBackupCodeVerifyView.twoFaBackupCode"),
            type: "text",
            errorId: "two-fa-backup-code-input-error"
          }),
          Button({
            text: i18next.t("twoFaBackupCodeVerifyView.submitTwoFaBackupCode"),
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
      ?.addEventListener("submit", (event) => this.verifTwoFaBackupCode(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "login";
  }

  private async verifTwoFaBackupCode(event: Event) {
    event.preventDefault();
    const twoFaBackupCodeInput = getEl(
      "two-fa-backup-code-input"
    ) as HTMLInputElement;
    const twoFaBackupCodeErrorEl = getEl("two-fa-backup-code-input-error");
    console.log("backupCode:", twoFaBackupCodeInput.value);

    const isBackupCodeValid = await validateTwoFaBackupCode(
      twoFaBackupCodeInput,
      twoFaBackupCodeErrorEl
    );
    if (!isBackupCodeValid) {
      return;
    }

    const apiResponse = await verifyBackupCode(twoFaBackupCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid(
          i18next.t("invalid.twoFaBackupCode"),
          twoFaBackupCodeInput,
          twoFaBackupCodeErrorEl
        );
        return;
      } else {
        throw new ApiError(apiResponse);
      }
    }

    const isAllowed = await auth.loginAfteTwoFa();
    if (!isAllowed) return;
    router.navigate("/home", false);
  }
}
