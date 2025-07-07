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
  getUserAuthProvider
} from "../services/users.services.js";
import { getUserStats } from "../services/user_stats.services.js";
import {
  getUserMatches,
  getUserMatchesByUsername
} from "../services/matches.services.js";
import {
  getUserTournaments,
  getUserActiveTournament
} from "../services/tournaments.services.js";
import { handlePrismaError, httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";
import {
  createHash,
  getPasswordHash,
  updatePassword,
  verifyHash
} from "../services/auth.services.js";
import { getAllUserFriendRequests } from "../services/friends.services.js";
import { fileTypeFromBuffer } from "file-type";

export async function createUserHandler(request, reply) {
  const action = "Create User";
  try {
    const { username, email, password } = request.body;

    const hashedPassword = await createHash(password);

    const data = await createUser(username, email, hashedPassword, "LOCAL");
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createUserHandler: ${createResponseMessage(action, false)}`
    );
    if (err.code === "P2002") {
      return httpError(
        reply,
        409,
        createResponseMessage(action, false),
        "Email or username already exists"
      );
    }
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserHandler(request, reply) {
  const action = "Get user";
  try {
    const id = parseInt(request.user.id, 10);
    const data = await getUser(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getAllUsersHandler(request, reply) {
  const action = "Get all users";
  try {
    const data = await getAllUsers();
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllUsersHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function updateUserHandler(request, reply) {
  const action = "Update user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await updateUser(id, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `updateUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function patchUserHandler(request, reply) {
  const action = "Patch user";
  try {
    const id = parseInt(request.user.id, 10);

    if (request.body.email && (await getUserAuthProvider(id)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "Email can not be changed. User uses Google auth provider"
      );
    }

    const data = await updateUser(id, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `patchUserHandler: ${createResponseMessage(action, false)}`
    );
    if (err.code === "P2002") {
      return httpError(
        reply,
        409,
        createResponseMessage(action, false),
        "Email or username already exists"
      );
    }
    return handlePrismaError(reply, action, err);
  }
}

export async function deleteUserHandler(request, reply) {
  const action = "Delete user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await deleteUser(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserMatchesHandler(request, reply) {
  const action = "Get user matches";
  try {
    const id = parseInt(request.user.id, 10);
    const { playedAs } = request.query;
    const data = await getUserMatches(id, playedAs);
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserMatchesHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserMatchesByUsernameHandler(request, reply) {
  const action = "Get user matches by username";
  try {
    const id = parseInt(request.user.id, 10);
    const { playedAs } = request.query;
    const { username } = request.params;
    if (username !== request.user.username) {
      const friend = await getAllUserFriendRequests(id, username);
      if (!friend.length || !friend.some((req) => req.status === "ACCEPTED")) {
        return httpError(reply, 401, "You need to be friends");
      }
    }
    const data = await getUserMatchesByUsername(username, playedAs);
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserMatchesByUsernameHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserStatsHandler(request, reply) {
  const action = "Get user stats";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserStats(userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserStatsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getUserTournamentsHandler(request, reply) {
  const action = "Get user tournaments";
  try {
    const id = parseInt(request.user.id, 10);
    const data = await getUserTournaments(id);
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserTournamentsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserActiveTournamentHandler(request, reply) {
  const action = "Get user active tournament";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserActiveTournament(userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserActiveTournamentHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getAllUserFriendRequestsHandler(request, reply) {
  const action = "Get all user friend requests";
  try {
    const userId = parseInt(request.user.id, 10);
    const { username } = request.query;
    const data = await getAllUserFriendRequests(userId, username);
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllUserFriendRequestsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function createUserAvatarHandler(request, reply) {
  const action = "Create user avatar";
  try {
    const userId = parseInt(request.user.id, 10);
    const parts = request.parts();
    for await (const part of parts) {
      if (part.fieldname === "avatar") {
        const avatar = part;
        if (!avatar || !avatar.file) {
          return httpError(
            reply,
            400,
            createResponseMessage(action, false),
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
          message: createResponseMessage(action, true),
          data: updatedUser
        });
      }
    }
    // If no avatar field found
    return httpError(
      reply,
      400,
      createResponseMessage(action, false),
      "Avatar file missing"
    );
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createUserAvatarHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
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
  const action = "Delete user avatar";
  try {
    const userId = parseInt(request.user.id, 10);
    const currentAvatarUrl = await getUserAvatar(userId);
    if (!currentAvatarUrl) {
      return httpError(
        reply,
        404,
        createResponseMessage(action, false),
        "No avatar found for user"
      );
    }
    await deleteUserAvatar(currentAvatarUrl);

    const updatedUser = await updateUser(userId, { avatar: null });
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: updatedUser
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteUserAvatarHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function searchUserHandler(request, reply) {
  const action = "Search user";

  try {
    const { username, email } = request.query;

    const isEmail = email !== undefined;

    const data = isEmail
      ? await getUserByEmail(email)
      : await getUserByUsername(username);

    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserFriendRequestsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function updateUserPasswordHandler(request, reply) {
  const action = "Update user password";
  try {
    const userId = parseInt(request.user.id, 10);

    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "Password can not be changed. User uses Google auth provider"
      );
    }

    const { currentPassword, newPassword } = request.body;

    const hashedPassword = await getPasswordHash(userId);
    if (!(await verifyHash(hashedPassword, currentPassword))) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Current password is incorrect"
      );
    }

    // Hash the new password
    const hashedNewPassword = await createHash(newPassword);

    // Update the user's password
    await updatePassword(userId, hashedNewPassword);

    return reply.code(200).send({
      message: createResponseMessage(action, true)
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `updateUserPasswordHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}
