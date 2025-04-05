export async function loginUser(event: Event): Promise<void> {
  event.preventDefault();

  const loginForm = document.getElementById("login-form") as HTMLFormElement;
  const usernameOrEmail = loginForm.usernameOrEmail.value;
  const password = loginForm.password.value;

  try {
    const response = await fetch("/api/users/user-logins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernameOrEmail,
        password
      })
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
