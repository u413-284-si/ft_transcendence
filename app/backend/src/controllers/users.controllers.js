import prisma from "../prisma/prismaClient.js";

/**
 * Controller function to add a new user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function addUser(request, reply) {
	const { username } = request.body;

	try {
		const user = await prisma.user.create({
			data: {
				username,
				dateJoined: new Date(),
				authentication: { create: {} },
				stats: { create: {} },
				accountStatus: { create: {} }
			},
			select: {
				id: true,
				username: true,
				email: true,
			}
		})

		return reply.code(201).send(user);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ success: false, error: "Failed to add user" });
	}
}

/**
 * Controller function to retrieve in query specified user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function getUser(request, reply) {
	const id = parseInt(request.params.id, 10);

	try {
		const user = await prisma.user.findUnique({
			where: {
				id
			}
		})
		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		return reply.code(200).send(user);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to retrieve user" });
	}
}

/**
 * Controller function to retrieve all users
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function getUsers(request, reply) {
	try {
		const users = await prisma.user.findMany();

		// Respond with the list of users
		return reply.code(200).send(users);
	} catch (err) {
		// Log the error and respond with a 500 status code
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to retrieve users" });
	}
}

/**
 * Controller function to edit a user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function editUser(request, reply) {
	const { username } = request.body;
	const id = parseInt(request.params.id, 10);

	try {
		const user = await prisma.user.update({
			where: {
				id: id
			},
			data: {
				username: username
			},
			select: {
				id: true,
				username: true,
				email: true,
			}
		})

		return reply.code(200).send(user);
	}
	catch (err) {
		if (err.code === "P2025")
			return reply.code(404).send({ error: "User not found" });
		else
			return reply.code(500).send({ error: "Failed to update user" });
	}
}

/**
 * Controller function to delete a user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function deleteUser(request, reply) {
	const id = parseInt(request.params.id, 10);

	try {
		const user = await prisma.user.delete({
			where: {
				id: id
			}
		})

		return reply.code(200).send({ message: "User deleted successfully", ...user });
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to delete user" });
	}
}

export async function getUserMatches(request, reply) {
	const playerId = parseInt(request.params.id, 10);

	try {
		const matches = await prisma.match.findMany({
			where: {
				playerId
			},
			select: {
				playerNickname: true,
				opponentNickname: true,
				playerScore: true,
				opponentScore: true,
				date: true,
			}
		})
		if (!matches) {
			return reply.code(404).send({ error: "No matches found for this user" });
		}
		return reply.code(200).send(matches);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to retrieve matches" });
	}
}
