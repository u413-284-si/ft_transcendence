import { auth } from "./AuthManager.js";
import { router } from "./Router.js";

export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById(
    "login-form"
  ) as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  const isAllowed = await auth.login(usernameOrEmail, password);
  if (!isAllowed) return;
  router.navigate("/home", false);
}
