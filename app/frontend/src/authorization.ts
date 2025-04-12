const authorizeUser = async () => {
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
};

export default authorizeUser;
