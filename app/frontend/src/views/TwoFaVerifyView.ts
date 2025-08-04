import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { markInvalid, validateTwoFaCode } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getEl } from "../utility.js";
import { verifyLoginTwoFaCode } from "../services/authServices.js";
import { ApiError } from "../services/api.js";
import { Link } from "../components/Link.js";

export default class TwoFaVerifyView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("twoFaVerifyView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        id: "two-fa-verify-form",
        children: [
          Input({
            id: "two-fa-qr-code-input",
            label: i18next.t("twoFaVerifyView.enterTwoFaCode"),
            name: "two-fa-qr-code-input",
            placeholder: i18next.t("twoFaVerifyView.twoFaCode"),
            type: "text",
            errorId: "two-fa-qr-code-input-error"
          }),
          Link({
            id: "two-fa-backup-code-link",
            text: i18next.t("twoFaVerifyView.useBackupCode"),
            href: "/2FaBackupCodeVerification"
          }),
          Button({
            text: i18next.t("twoFaVerifyView.submitTwoFaCode"),
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
      ?.addEventListener("submit", (event) => this.verifyTwoFa(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "2fa-verify";
  }

  private async verifyTwoFa(event: Event) {
    event.preventDefault();
    const twoFaQrCodeInput = getEl("two-fa-qr-code-input") as HTMLInputElement;
    const twoFaQrCodeErrorEl = getEl("two-fa-qr-code-input-error");

    const isTwoFaCodeValid = await validateTwoFaCode(
      twoFaQrCodeInput,
      twoFaQrCodeErrorEl
    );
    if (!isTwoFaCodeValid) {
      return;
    }

    const apiResponse = await verifyLoginTwoFaCode(twoFaQrCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid(
          i18next.t("invalid.twoFaCode"),
          twoFaQrCodeInput,
          twoFaQrCodeErrorEl
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
