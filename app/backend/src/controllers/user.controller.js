import Ajv from "ajv";

const ajv = new Ajv();

/**
 * The pattern for the username is:
 * - At least 1 character
 * - At most 100 characters
 * - No whitespaces
 * - Allows lowercase and uppercase letters
 * - Allows numbers
 * - Allows special characters: !@#$%^&*(),.?":{}|<>
 */
const usernameSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(?!.*\\s)(?=.*[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>]).+$"
    }
  },
  required: ["username"],
  additionalProperties: false,
};

const validateUsername = ajv.compile(usernameSchema);

/**
 * Controller function to add a new user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function addUser(request, reply) {
  const { username } = request.body;

	const valid = validateUsername({ username });
  if (!valid) {
    return reply.status(400).send({
      error: "Invalid input",
      details: validateUsername.errors,
    });
  }

  try {
    const insertStatement = request.server.db.prepare("INSERT INTO users (username) VALUES (?)");
    const info = insertStatement.run(username);

    reply.code(201).send({ success: true, message: "User registered" });
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
	const { username } = request.query;

	try {
		const selectStatement = request.server.db.prepare(
			"SELECT * FROM users WHERE username = ?"
		);
		const user = selectStatement.get(username);
		if (!user) {
			return reply.code(404).send({ exists: !!user, error: "User not found" });
		}

		reply.code(200).send({ exists: !!user, user });
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ exists: !!user, error: "Failed to retrieve user" });
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
    const selectStatement = request.server.db.prepare("SELECT * FROM users");
    const users = selectStatement.all();

    // Respond with the list of users
    reply.code(200).send(users);
  } catch (err) {
    // Log the error and respond with a 500 status code
    request.log.error(err);
    reply.code(500).send({ error: "Failed to retrieve users" });
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
	const { id } = request.params;

	const valid = validateUsername({ username });
  if (!valid) {
    return reply.status(400).send({
      error: "Invalid input",
      details: validateUsername.errors,
    });
  }

	try {
		const updateStatement = request.server.db.prepare(
    "UPDATE users SET username = ? WHERE id = ?"
  );
	const info = updateStatement.run(username, id);

	if (info.changes === 0) {
		return reply.code(404).send({ error: "User not found" });
	}

	reply.code(200).send({ id, username });
	}
	catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to update user" });
	}
}

/**
 * Controller function to delete a user
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 * @returns {Promise<void>}
 */
export async function deleteUser(request, reply) {
  const { id } = request.params;

  try {
    const deleteStatement = request.server.db.prepare(
      "DELETE FROM users WHERE id = ?"
    );
    const info = deleteStatement.run(id);

    if (info.changes === 0) {
      return reply.code(404).send({ error: "User not found" });
    }

    reply.code(200).send({ message: "User deleted successfully" });
  } catch (err) {
    request.log.error(err);
    reply.code(500).send({ error: "Failed to delete user" });
  }
}
