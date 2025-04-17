const authorizeUser = async () => {
  const response = await fetch("/api/auth/", {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("authorization failed");
  }
};

export default authorizeUser;
