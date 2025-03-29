import { httpErrorSchema } from "../schema/common.schema.js";
import { Prisma } from "@prisma/client";
import { convertPrismaError } from "../prisma/prismaError.js";
import { createResponseMessage } from "../utils/response.js"

export function httpError(reply, code, message, cause) {
	reply.code(code).send({ message, cause });
}

export const errorResponses = {
	400: httpErrorSchema,
	401: httpErrorSchema,
	404: httpErrorSchema,
	500: httpErrorSchema
};

export function handlePrismaError(reply, action, err) {
	let code = 500;
	let cause = "Internal Server Error";
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		code = convertPrismaError(err.code);
		cause = err.meta.cause;
	}
	return httpError(reply, code, createResponseMessage(action, false), cause);
}
