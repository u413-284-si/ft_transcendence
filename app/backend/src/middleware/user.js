import { getFriendId } from "../services/friends.services.js";
import { getTokenData } from "../services/users.services.js";
import { httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function setUserName(request) {
  request.action = "Set username from id";
  const userId = request.user.id;
  const { username } = await getTokenData(userId, "id");

  request.user.username = username;
}

export async function isSelfOrFriend(request, reply) {
  request.action = "Check if self or friend";
  let userId = request.user.id;
  const username = request.user.username;
  const paramUsername = request.params.username;
  if (username !== paramUsername) {
    const friendId = await getFriendId(userId, paramUsername);
    if (!friendId) {
      return httpError(
        reply,
        401,
        createResponseMessage(request.action, false),
        "You need to be friends"
      );
    }
    userId = friendId;
  }

  request.user.id = userId;
}
