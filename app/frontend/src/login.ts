import { navigateTo } from "./main.js";
import { APIError } from "./services/api.js";
import { userLogin } from "./services/authServices.js";

export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById(
    "login-form"
  ) as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  try {
    const token = await userLogin(usernameOrEmail, password);
    console.log(token);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 401) {
        alert("Invalid username or password");
      }
    }
    console.error(error);
  }

  navigateTo("/home");
}
