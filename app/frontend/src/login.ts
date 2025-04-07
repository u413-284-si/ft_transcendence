export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm: HTMLFormElement = document.getElementById("login-form") as HTMLFormElement;
  const usernameOrEmail: string = loginForm.usernameOrEmail.value;
  const password: string = loginForm.password.value;

  const url: string = "/api/users/user-login/";
  console.log("url:", url);

  try {
    const response = await fetch(url , {
	method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usernameOrEmail, password })
    });

    if (!response.ok) {
      throw new Error("Failed to log in user");
    }

    const user = await response.json();
    console.log("User logged in:", user);
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}
