import { Prisma } from "@prisma/client";
import { createUser, getUser, getAllUsers, updateUser, deleteUser, getUserMatches } from "../services/users.services.js";

export async function registerUserHandler(request, reply) {
	try {
		const { username, email } = request.body;
		const user = await createUser(username, email);
		return reply.code(201).send({ message: "User created", user });
	} catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2002") {
				return reply.code(400).send({ error: "Username already exists" });
			}
		}
		return reply.code(500).send({ message: "Failed to add user" });
	}
}

export async function getUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const user = await getUser(id);
		return reply.code(200).send({ message: "Found user", user });
	} catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return reply.code(404).send({ error: "User not found" });
			}
		}
		return reply.code(500).send({ error: "Failed to retrieve user" });
	}
}

export async function getAllUsersHandler(request, reply) {
	try {
		const users = await getAllUsers();
		const numberOfUsers = users.length;
		return reply.code(200).send({ message: `Found ${numberOfUsers} users`, users });
	} catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return reply.code(404).send({ error: "Users not found" });
			}
		}
		return reply.code(500).send({ error: "Failed to retrieve users" });
	}
}

export async function updateUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const updatedUser = await updateUser(id, request.body);
		return reply.code(200).send({ messag: "Updated user", updatedUser });
	}
	catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return reply.code(404).send({ error: "User not found" });
			}
		}
		return reply.code(500).send({ error: "Failed to update user" });
	}
}

export async function deleteUserHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const deletedUser = await deleteUser(id);
		return reply.code(200).send({ message: "Deleted user", deletedUser });
	} catch (err) {
		request.log.error(err);
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === "P2025") {
				return reply.code(404).send({ error: "User not found" });
			}
		}
		return reply.code(500).send({ error: "Failed to delete user" });
	}
}

export async function getUserMatchesHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const matches = await getUserMatches(id);
		const numberOfMatches = matches.length;
		return reply.code(200).send({ message: `Found ${numberOfMatches} matches`, matches });
	} catch (err) {
		request.log.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				return reply.code(404).send({ error: "No matches found" });
			}
		}
		return reply.code(500).send({ error: "Failed to retrieve matches" });
	}
}
