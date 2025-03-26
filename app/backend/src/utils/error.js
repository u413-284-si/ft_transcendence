import { httpErrorSchema } from "../schema/common.schema.js";

export function httpError({ reply, code, message, cause }) {
	reply.code(code).send({ message, cause });
}

export const errorResponses = {
	400: httpErrorSchema,
	401: httpErrorSchema,
	404: httpErrorSchema,
	500: httpErrorSchema
};
