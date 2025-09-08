import { getTokenData } from "../services/users.services.js";

export async function setUserName(request) {
  request.action = "Set username from id";
  const userId = request.user.id;
  const { username } = await getTokenData(userId, "id");

  request.user.username = username;
}
