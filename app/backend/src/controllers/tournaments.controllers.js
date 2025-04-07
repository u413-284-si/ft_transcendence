import {
  createTournament,
  getAllTournaments,
  getTournament,
  updateTournament
} from "../services/tournaments.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";

export async function createTournamentHandler(request, reply) {
  const action = "Create tournament";
  try {
    const { name, maxPlayers, adminId } = request.body;

    const data = await createTournament(name, maxPlayers, adminId);
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createTournamentHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getAllTournamentsHandler(request, reply) {
  const action = "Get all tournaments";
  try {
    const data = await getAllTournaments();
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllTournaments: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getTournamentHandler(request, reply) {
  const action = "Get tournament";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await getTournament(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getTournamentHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function patchTournamentHandler(request, reply) {
  const action = "Patch tournament";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await updateTournament(id, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `patchTournamentHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}
