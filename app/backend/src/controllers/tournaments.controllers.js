import {
  createTournament,
  getAllTournaments,
  getTournament,
  updateTournament,
  deleteAllTournaments,
  deleteTournament
} from "../services/tournaments.services.js";
import { createResponseMessage } from "../utils/response.js";

export async function createTournamentHandler(request, reply) {
  request.action = "Create tournament";
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
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function getAllTournamentsHandler(request, reply) {
  request.action = "Get all tournaments";
  const data = await getAllTournaments();
  const count = data.length;
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    count,
    data
  });
}

export async function getTournamentHandler(request, reply) {
  request.action = "Get tournament";
  const tournamentId = request.params.id;
  const data = await getTournament(tournamentId);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function patchTournamentHandler(request, reply) {
  request.action = "Patch tournament";
  const tournamentId = request.params.id;
  const userId = request.user.id;
  const data = await updateTournament(tournamentId, userId, request.body);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function deleteAllTournamentsHandler(request, reply) {
  request.action = "Delete all tournaments";
  const data = await deleteAllTournaments();
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function deleteTournamentHandler(request, reply) {
  request.action = "Delete Tournament";
  const tournamentId = request.params.id;
  const userId = request.user.id;
  const data = await deleteTournament(tournamentId, userId);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}
