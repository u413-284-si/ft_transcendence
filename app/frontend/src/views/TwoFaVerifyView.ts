import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { markInvalid, validatTwoFaCode, validateUsernameOrEmail } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getEl } from "../utility.js";
import { verifyLoginTwoFaCode } from "../services/authServices.js";
import { ApiError } from "../services/api.js";

export default class TwoFaVerifyView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Two Factor Authentication");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        id: "two-fa-verify-form",
        children: [
          Input({
            id: "two-fa-qr-code-input",
            label: "Enter your 2FA code:",
            name: "two-fa-qr-code-input",
            placeholder: "Code",
            type: "text",
            errorId: "two-fa-qr-code-input-error"
          }),
          Button({
            text: "Submit",
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
      ?.addEventListener("submit", (event) => this.verifTwoFa(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "login";
  }

  private async verifTwoFa(event: Event) {
    event.preventDefault();
    const twoFaQrCodeInput = getEl("two-fa-qr-code-input") as HTMLInputElement;
    const twoFaQrCodeErrorEl = getEl("two-fa-qr-code-input-error");

    const iTwoFaCodeValid = await validatTwoFaCode(
      twoFaQrCodeInput,
      twoFaQrCodeErrorEl
    );
    if (!iTwoFaCodeValid) {
      return;
    }

    const apiResponse = await verifyLoginTwoFaCode(twoFaQrCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid("Invalid code.", twoFaQrCodeInput, twoFaQrCodeErrorEl);
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
