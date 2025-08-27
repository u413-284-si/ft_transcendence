import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getById } from "../utility.js";
import { Header1 } from "../components/Header1.js";

export default class LoginView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("loginView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Header1({
        text: i18next.t("loginView.title"),
        variant: "default"
      })}
      ${Form({
        children: [
          Input({
            id: "usernameOrEmail",
            label: i18next.t("global.label", {
              field: i18next.t("loginView.usernameOrEmail")
            }),
            name: "usernameOrEmail",
            placeholder: i18next.t("loginView.usernameOrEmail"),
            type: "text",
            errorId: "usernameOrEmail-error"
          }),
          Input({
            id: "password",
            label: i18next.t("global.label", {
              field: i18next.t("global.password")
            }),
            name: "password",
            placeholder: i18next.t("global.password"),
            type: "password",
            errorId: "password-error",
            hasToggle: true
          }),
          Button({
            text: i18next.t("loginView.title"),
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
    const userEl = getById<HTMLInputElement>("usernameOrEmail");
    const userErrorEl = getById<HTMLElement>("usernameOrEmail-error");
    const passwordEl = getById<HTMLInputElement>("password");
    // FIXME: activate when password policy is applied
    // const passwordErrorEl = getById<HTMLElement>(
    //   "password-error"
    // ) as HTMLElement;

    if (!validateUsernameOrEmail(userEl, userErrorEl)) return;
    // FIXME: activate when password policy is applied
    // if (!validatePassword(passwordEl, passwordErrorEl)) return;

    const isAllowed = await auth.login(userEl.value, passwordEl.value);
    userEl.value = "";
    passwordEl.value = "";
    if (!isAllowed) return;
    router.navigate("/home", false);
  }
}
