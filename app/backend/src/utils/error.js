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
  403: httpErrorSchema,
  404: httpErrorSchema,
  409: httpErrorSchema,
  500: httpErrorSchema
};

export function handleError(err, request, reply) {
  request.log.error({
    action: request.action,
    method: request.method,
    url: request.url,
    params: request.params,
    query: request.query,
    error: err
  });
  let code = 500;
  let cause = "Internal Server Error";
  if (reply.raw.headersSent) {
    reply.raw.end();
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = convertPrismaError(err.code);
    cause = err.meta.cause;
  } else if (err.statusCode && err.statusCode === 429) {
    code = 429;
    cause = err.error;
  } else if (err.code && err.code.startsWith("FST_JWT")) {
    code = err.statusCode;
    cause = err.message;
  } else if (err.validation) {
    request.action = `Validation error in context ${err.validationContext}`;
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
