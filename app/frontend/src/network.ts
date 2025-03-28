
export async function registerUser(playerNum: number) {
    const input = document.getElementById(`usernameInput${playerNum}`) as HTMLInputElement;
    const user = input.value.trim();
    if (!user) return alert(`Please enter a username for Player ${playerNum}`);

    try {
        // Check if the username already exists
        const checkResponse = await fetch(`http://localhost:4000/user/get?username=${encodeURIComponent(user)}`);
        const checkData = await checkResponse.json();

        if (checkData.exists) {
            alert(`Username "${user}" is already taken.`);
            return;
        }

        // Register user
        const registerResponse = await fetch("http://localhost:4000/user/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user }),
        });
        const registerData = await registerResponse.json();
    } catch (err) {
        console.error("Registration failed:", err);
    }
}
