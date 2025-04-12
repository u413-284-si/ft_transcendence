export const authorizeUser = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("authorization failed");
    }
  } catch (err) {
    throw new Error("authorization failed");
  }
};
