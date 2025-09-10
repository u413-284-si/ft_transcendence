import { httpErrorSchema } from "../schema/common.schema.js";
import { convertPrismaError } from "../prisma/prismaError.js";
import { createResponseMessage } from "../utils/response.js";
import { Prisma } from "@prisma/client";

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
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
  request.log.error(err, {
    action: request.action,
    method: request.method,
    url: request.url,
    params: request.params,
    query: request.query
  });

  // special case for SSE if headers were already sent
  if (reply.raw.headersSent) {
    reply.raw.end();
    return;
  }

  let code = err.statusCode || 500;
  let cause = err.message || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = convertPrismaError(err.code);
    cause = err.meta.cause;
  } else if (err.statusCode && err.statusCode === 429) {
    request.action = `Rate limit check`;
  } else if (err.validation) {
    request.action = `Validation error in context ${err.validationContext}`;
  }

  reply
    .code(code)
    .send({ message: createResponseMessage(request.action, false), cause });
}
