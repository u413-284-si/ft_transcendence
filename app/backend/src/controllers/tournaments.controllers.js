import {
  createTournament,
  getAllTournaments,
  getTournament,
  updateTournament,
  deleteAllTournaments,
  deleteTournament
} from "../services/tournaments.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";

export async function createTournamentHandler(request, reply) {
  const action = "Create tournament";
  try {
    const userId = request.user.id;
    const { name, maxPlayers, userNickname, bracket } = request.body;

    const data = await createTournament(
      name,
      maxPlayers,
      userId,
      userNickname,
      bracket
    );
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data: data });
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
    const tournamentId = request.params.id;
    const data = await getTournament(tournamentId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
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
    const tournamentId = request.params.id;
    const userId = request.user.id;
    const data = await updateTournament(tournamentId, userId, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `patchTournamentHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function deleteAllTournamentsHandler(request, reply) {
  const action = "Delete all tournaments";
  try {
    const data = await deleteAllTournaments();
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteAllTournamentsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function deleteTournamentHandler(request, reply) {
  const action = "Delete Tournament";
  try {
    const tournamentId = request.params.id;
    const userId = request.user.id;
    const data = await deleteTournament(tournamentId, userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteTournamentHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}
