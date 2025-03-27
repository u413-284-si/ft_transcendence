import { Prisma } from "@prisma/client";
import { createUser, getUser, getAllUsers, updateUser, deleteUser, getUserMatches } from "../services/users.services.js";
import { convertPrismaError } from "../prisma/prismaError.js";
import { httpError } from "../utils/error.js";

export async function registerUserHandler(request, reply) {
	try {
		const { username, email } = request.body;
		const user = await createUser(username, email);
		return reply.code(201).send({ message: "User created", user });
	} catch (err) {
		request.log.error({ err, body: request.body }, "registerUserHandler: Failed to create user");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to create user", cause);
	}
}

export async function getUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const user = await getUser(id);
		return reply.code(200).send({ message: "Found user", user });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getUserHandler: Failed to get user");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get user", cause);
	}
}

export async function getAllUsersHandler(request, reply) {
	try {
		const users = await getAllUsers();
		const numberOfUsers = users.length;
		return reply.code(200).send({ message: `Found ${numberOfUsers} users`, users });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getAllUsersHandler: Failed to get users");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get users", cause);
	}
}

export async function updateUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const updatedUser = await updateUser(id, request.body);
		return reply.code(200).send({ message: "Updated user", updatedUser });
	}
	catch (err) {
		request.log.error({ err, body: request.body }, "updateUserHandler: Failed to update user");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to update user", cause);
	}
}

export async function deleteUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const deletedUser = await deleteUser(id);
		return reply.code(200).send({ message: "Deleted user", deletedUser });
	} catch (err) {
		request.log.error({ err, body: request.body }, "deleteUserHandler: Failed to delete user");
		let code = 500;
		let cause = "Internal Server";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to delete user", cause);
	}
}

export async function getUserMatchesHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const matches = await getUserMatches(id);
		const numberOfMatches = matches.length;
		return reply.code(200).send({ message: `Found ${numberOfMatches} matches`, matches });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getUserMatchesHandler: Failed to get matches");
		let code = 500;
		let cause = "Internal Server";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get matches", cause);
	}
}

export async function patchUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const patchedUser = await updateUser(id, request.body);
		return reply.code(200).send({ message: "Patched user", patchedUser });
	}
	catch (err) {
		request.log.error({ err, body: request.body }, "updateUserHandler: Failed to update user");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to update user", cause);
	}
}
