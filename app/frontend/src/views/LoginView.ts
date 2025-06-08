import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { Input } from "../components/Input.js";
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
            type: "text",
            errorId: "password-error"
          }),
          Button({
            text: "Login",
            variant: "default",
            size: "md",
            type: "submit"
          })
        ],
        id: "login-form",
        className: "flex flex-col justify-center items-center gap-4"
      })}
    `;
  }

  protected addListeners() {
    document
      .getElementById("login-form")
      ?.addEventListener("submit", (event) => this.validateAndLoginUser(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "login";
  }

  async validateAndLoginUser(event: Event) {
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
