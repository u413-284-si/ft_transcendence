import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserAvatar,
  createUserAvatar,
  deleteUserAvatar,
  getUserByUsername,
  getUserByEmail,
  getUserAuthProvider,
  flattenUser
} from "../services/users.services.js";
import { getUserStats } from "../services/user_stats.services.js";
import {
  getUserMatches,
  getUserMatchesCount
} from "../services/matches.services.js";
import {
  getUserTournaments,
  getUserTournamentsCount
} from "../services/tournaments.services.js";
import { httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";
import {
  createHash,
  getPasswordHash,
  updatePassword,
  verifyHash
} from "../services/auth.services.js";
import {
  getAllUserFriendRequests,
  getFriendId
} from "../services/friends.services.js";
import { fileTypeFromBuffer } from "file-type";

export async function createUserHandler(request, reply) {
  request.action = "Create User";
  const { username, email, password } = request.body;

  const hashedPassword = await createHash(password);

  const data = await createUser(username, email, hashedPassword, "LOCAL");
  return reply
    .code(201)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function getUserHandler(request, reply) {
  request.action = "Get user";
  const userId = request.user.id;
  const user = await getUser(userId);
  const data = flattenUser(user);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function getAllUsersHandler(request, reply) {
  request.action = "Get all users";
  const data = await getAllUsers();
  const count = data.length;
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    count: count,
    data: data
  });
}

export async function updateUserHandler(request, reply) {
  request.action = "Update user";
  const userId = request.params.id;
  const data = await updateUser(userId, request.body);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function patchUserHandler(request, reply) {
  request.action = "Patch user";
  const userId = request.user.id;

  if (request.body.email && (await getUserAuthProvider(userId)) !== "LOCAL") {
    return httpError(
      reply,
      403,
      createResponseMessage(request.action, false),
      "Email can not be changed. User uses Google auth provider"
    );
  }

  const data = await updateUser(userId, request.body);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function deleteUserHandler(request, reply) {
  request.action = "Delete user";
  const userId = request.params.id;
  const data = await deleteUser(userId);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function getUserMatchesByUsernameHandler(request, reply) {
  request.action = "Get user matches by username";
  let userId = request.user.id;
  const { username } = request.params;
  if (username !== request.user.username) {
    const friendId = await getFriendId(userId, username);
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
  const filter = {
    playedAs: request.query.playedAs,
    limit: request.query.limit,
    offset: request.query.offset,
    sort: request.query.sort
  };
  const [matches, total] = await Promise.all([
    getUserMatches(userId, undefined, filter),
    getUserMatchesCount(userId, filter)
  ]);
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: { items: matches, total }
  });
}

export async function getUserStatsHandler(request, reply) {
  request.action = "Get user stats";
  const userId = request.user.id;
  const data = await getUserStats(userId);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function getUserTournamentsByUsernameHandler(request, reply) {
  request.action = "Get user tournaments by username";
  let userId = request.user.id;
  const { username } = request.params;
  if (username !== request.user.username) {
    const friendId = await getFriendId(userId, username);
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
  const filter = {
    name: request.query.name,
    isFinished: request.query.isFinished,
    limit: request.query.limit,
    offset: request.query.offset,
    sort: request.query.sort
  };
  const [tournaments, total] = await Promise.all([
    getUserTournaments(userId, undefined, filter),
    getUserTournamentsCount(userId, filter)
  ]);
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: {
      items: tournaments,
      total
    }
  });
}

export async function getAllUserFriendRequestsHandler(request, reply) {
  request.action = "Get all user friend requests";
  const userId = request.user.id;
  const { username } = request.query;
  const data = await getAllUserFriendRequests(userId, username);
  const count = data.length;
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    count: count,
    data: data
  });
}

export async function createUserAvatarHandler(request, reply) {
  request.action = "Create user avatar";
  const userId = request.user.id;
  const parts = request.parts();
  for await (const part of parts) {
    if (part.fieldname === "avatar") {
      const avatar = part;
      if (!avatar || !avatar.file) {
        return httpError(
          reply,
          400,
          createResponseMessage(request.action, false),
          "Avatar is required"
        );
      }
      // Validate actual file type using file-type
      const fileBuffer = await avatar.toBuffer();
      await validateImageFile(fileBuffer);

      // Check if the user already has an avatar and delete it
      const currentAvatarUrl = await getUserAvatar(userId);
      if (currentAvatarUrl) {
        await deleteUserAvatar(currentAvatarUrl);
      }

      // Create new avatar
      const newFileName = await createUserAvatar(userId, fileBuffer);
      const avatarUrl = `/images/${newFileName}`;
      const updatedUser = await updateUser(userId, { avatar: avatarUrl });
      return reply.code(201).send({
        message: createResponseMessage(request.action, true),
        data: updatedUser
      });
    }
  }
  // If no avatar field found
  return httpError(
    reply,
    400,
    createResponseMessage(request.action, false),
    "Avatar file missing"
  );
}

async function validateImageFile(buffer) {
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
    console.error(
      "Invalid image file type:",
      fileType ? fileType.mime : "unknown"
    );
    throw new Error();
  }
}

export async function deleteUserAvatarHandler(request, reply) {
  request.action = "Delete user avatar";
  const userId = request.user.id;
  const currentAvatarUrl = await getUserAvatar(userId);
  if (!currentAvatarUrl) {
    return httpError(
      reply,
      404,
      createResponseMessage(request.action, false),
      "No avatar found for user"
    );
  }
  await deleteUserAvatar(currentAvatarUrl);

  const updatedUser = await updateUser(userId, { avatar: null });
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: updatedUser
  });
}

export async function searchUserHandler(request, reply) {
  request.action = "Search user";

  const { username, email } = request.query;

  const isEmail = email !== undefined;

  const data = isEmail
    ? await getUserByEmail(email)
    : await getUserByUsername(username);

  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: data
  });
}

export async function updateUserPasswordHandler(request, reply) {
  request.action = "Update user password";
  const userId = request.user.id;

  if ((await getUserAuthProvider(userId)) !== "LOCAL") {
    return httpError(
      reply,
      403,
      createResponseMessage(request.action, false),
      "Password can not be changed. User uses Google auth provider"
    );
  }

  const { currentPassword, newPassword } = request.body;

  const hashedPassword = await getPasswordHash(userId);
  if (!(await verifyHash(hashedPassword, currentPassword))) {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Current password is incorrect"
    );
  }

  // Hash the new password
  const hashedNewPassword = await createHash(newPassword);

  // Update the user's password
  await updatePassword(userId, hashedNewPassword);

  return reply.code(200).send({
    message: createResponseMessage(request.action, true)
  });
}
