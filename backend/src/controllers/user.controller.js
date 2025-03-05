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
    const stmt = request.server.db.prepare("INSERT INTO users (username) VALUES (?)");
    const info = stmt.run(username);

    reply.code(201).send({ id: info.lastInsertRowid, username });
  } catch (err) {
    request.log.error(err);
    reply.code(500).send({ error: "Failed to add user" });
  }
}
