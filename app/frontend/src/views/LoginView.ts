import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";

export default class LoginView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Input({
            id: "usernameOrEmail",
            label: "Username or Email:",
            name: "usernameOrEmail",
            placeholder: "Username or Email",
            type: "text",
            errorId: "usernameOrEmail-error"
          }),
          Input({
            id: "password",
            label: "Password:",
            name: "password",
            placeholder: "Password",
            type: "password",
            errorId: "password-error",
            hasToggle: true
          }),
          Button({
            text: "Login",
            variant: "default",
            size: "md",
            type: "submit"
          }),
          Button({
            id: "google-login",
            text: "",
            variant: "google",
            size: "empty",
            type: "button"
          })
        ],
        id: "login-form"
      })}
    `;
  }

  protected addListeners() {
    document
      .getElementById("login-form")
      ?.addEventListener("submit", (event) => this.validateAndLoginUser(event));

    addTogglePasswordListener("password");
    document
      .getElementById("google-login")
      ?.addEventListener("click", () => auth.loginWithGoogle());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "login";
  }

  private async validateAndLoginUser(event: Event) {
    event.preventDefault();
    const userEl = document.getElementById(
      "usernameOrEmail"
    ) as HTMLInputElement;
    const userErrorEl = document.getElementById(
      "usernameOrEmail-error"
    ) as HTMLElement;
    const passwordEl = document.getElementById("password") as HTMLInputElement;
    // FIXME: activate when password policy is applied
    // const passwordErrorEl = document.getElementById(
    //   "password-error"
    // ) as HTMLElement;

    if (!validateUsernameOrEmail(userEl, userErrorEl)) return;
    // FIXME: activate when password policy is applied
    // if (!validatePassword(passwordEl, passwordErrorEl)) return;

    const isAllowed = await auth.login(userEl.value, passwordEl.value);
    if (!isAllowed) return;
    router.navigate("/home", false);
  }
}
