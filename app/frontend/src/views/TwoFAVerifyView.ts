import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { markInvalid, validateTwoFACode } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getEl } from "../utility.js";
import { verifyLoginTwoFACode } from "../services/authServices.js";
import { ApiError } from "../services/api.js";
import { Link } from "../components/Link.js";
import TwoFABackupCodeVerifyView from "./TwoFABackupCodeVerifyView.js";

export default class TwoFAVerifyView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("twoFAVerifyView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        id: "two-fa-verify-form",
        children: [
          Input({
            id: "two-fa-qr-code-input",
            label: i18next.t("twoFAVerifyView.enterTwoFACode"),
            name: "two-fa-qr-code-input",
            placeholder: i18next.t("global.twoFACode"),
            type: "text",
            errorId: "two-fa-qr-code-input-error"
          }),
          Link({
            id: "two-fa-backup-code-link",
            text: i18next.t("twoFAVerifyView.useBackupCode")
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
      .getElementById("two-fa-verify-form")
      ?.addEventListener("submit", (event) => this.verifyTwoFA(event));
    document
      .getElementById("two-fa-backup-code-link")
      ?.addEventListener("click", () =>
        router.switchView(new TwoFABackupCodeVerifyView())
      );
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "2fa-verify";
  }

  private async verifyTwoFA(event: Event) {
    event.preventDefault();
    const twoFAQRCodeInput = getEl("two-fa-qr-code-input") as HTMLInputElement;
    const twoFAQRCodeErrorEl = getEl("two-fa-qr-code-input-error");

    const isTwoFACodeValid = await validateTwoFACode(
      twoFAQRCodeInput,
      twoFAQRCodeErrorEl
    );
    if (!isTwoFACodeValid) {
      return;
    }

    const apiResponse = await verifyLoginTwoFACode(twoFAQRCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid(
          i18next.t("invalid.twoFACode"),
          twoFAQRCodeInput,
          twoFAQRCodeErrorEl
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
