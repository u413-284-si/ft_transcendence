import { loginUser } from "../services/user_logins.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js"

export async function loginUserHandler(request, reply) {
	try {
		const { usernameOrEmail, password } = request.body;
		const user = await loginUser(usernameOrEmail, password);
		return reply.code(200).send({ message: createResponseMessage(action, true), user });
	} catch (err) {
		request.log.error({ err, body: request.body }, `loginUserHandler: ${createResponseMessage(action, false)}`);
		return handlePrismaError(reply, action, err);
	}
}