import { navigateTo } from "./main.js";

export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById(
    "login-form"
  ) as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  const response = await fetch("http://localhost:4000/api/auth/", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usernameOrEmail, password })
  });

  if (!response.ok) {
    alert("Invalid username or password");
    return;
  }

  navigateTo("/home");
}
