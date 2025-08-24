import { httpErrorSchema } from "../schema/common.schema.js";
import { convertPrismaError } from "../prisma/prismaError.js";
import { createResponseMessage } from "../utils/response.js";
import { Prisma } from "@prisma/client";

export function httpError(reply, code, message, cause) {
  reply.code(code).send({ message, cause });
}

export const errorResponses = {
  400: httpErrorSchema,
  401: httpErrorSchema,
  404: httpErrorSchema,
  500: httpErrorSchema
};

export function handleError(err, request, reply) {
  let code = 500;
  let cause = "Internal Server Error";
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = convertPrismaError(err.code);
    cause = err.meta.cause;
  } else if (err.code.startsWith("FST_JWT")) {
    code = err.statusCode;
    cause = err.message;
  }
  return httpError(
    reply,
    code,
    createResponseMessage(request.action, false),
    cause
  );
}
