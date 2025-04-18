import router from "./main.js";
import { ApiError } from "./services/api.js";
import { userLogin } from "./services/authServices.js";

export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById(
    "login-form"
  ) as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  try {
    await userLogin(usernameOrEmail, password);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        alert("Invalid username or password");
      }
    }
    console.error(error);
  }

  router.navigate("/home");
}
