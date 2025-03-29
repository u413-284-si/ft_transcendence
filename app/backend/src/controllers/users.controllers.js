import { createUser, getUser, getAllUsers, updateUser, deleteUser, getUserMatches } from "../services/users.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js"

export async function registerUserHandler(request, reply) {
	const action = "Create User";
	try {
		const { username, email } = request.body;
		const user = await createUser(username, email);
		return reply.code(201).send({ message: createResponseMessage(action, true), user });
	} catch (err) {
		request.log.error({ err, body: request.body }, `registerUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function getUserHandler(request, reply) {
	const action = "Get user";
	try {
		const id = parseInt(request.params.id, 10);
		const user = await getUser(id);
		return reply.code(200).send({ message: createResponseMessage(action, true), user });
	} catch (err) {
		request.log.error({ err, body: request.body }, `getUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function getAllUsersHandler(request, reply) {
	const action = "Get all users"
	try {
		const users = await getAllUsers();
		const numberOfUsers = users.length;
		return reply.code(200).send({ message: createResponseMessage(action, true), count: numberOfUsers, users });
	} catch (err) {
		request.log.error({ err, body: request.body }, `getAllUsersHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function updateUserHandler(request, reply) {
	const action = "Update user";
	try {
		const id = parseInt(request.params.id, 10);
		const updatedUser = await updateUser(id, request.body);
		return reply.code(200).send({ message: createResponseMessage(action, true), updatedUser });
	}
	catch (err) {
		request.log.error({ err, body: request.body }, `updateUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function deleteUserHandler(request, reply) {
	const action = "Delete user";
	try {
		const id = parseInt(request.params.id, 10);
		const deletedUser = await deleteUser(id);
		return reply.code(200).send({ message: createResponseMessage(action, true), deletedUser });
	} catch (err) {
		request.log.error({ err, body: request.body }, `deleteUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function getUserMatchesHandler(request, reply) {
	const action = "Get user matches"
	try {
		const id = parseInt(request.params.id, 10);
		const matches = await getUserMatches(id);
		const numberOfMatches = matches.length;
		return reply.code(200).send({ message: createResponseMessage(action, true), count: numberOfMatches, matches });
	} catch (err) {
		request.log.error({ err, body: request.body }, `getUserMatchesHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}

export async function patchUserHandler(request, reply) {
	const action = "Patch user";
	try {
		const id = parseInt(request.params.id, 10);
		const patchedUser = await updateUser(id, request.body);
		return reply.code(200).send({ message: createResponseMessage(action, true), patchedUser });
	}
	catch (err) {
		request.log.error({ err, body: request.body }, `updateUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}
