import { navigateTo } from "./main.js";

export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById("login-form") as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  const url: string = "/api/users/user-login/";
  console.log("url:", url);

    const response = await fetch(url , {
	method: "POST",
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
