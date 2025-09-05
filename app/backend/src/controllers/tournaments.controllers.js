import {
  getAllTournaments,
  getTournament,
  updateTournament,
  deleteAllTournaments,
  deleteTournament,
  getUserTournaments
} from "../services/tournaments.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";
import {
  transactionTournament,
  transactionUpdateBracket
} from "../services/transactions.services.js";
import { getBracketMatch } from "../services/bracket_match.services.js";

export async function createTournamentHandler(request, reply) {
  request.action = "Create tournament";
  const userId = request.user.id;
  const { name, maxPlayers, userNickname, nicknames, playerTypes } =
    request.body;

  if (nicknames.length !== maxPlayers || playerTypes.length !== maxPlayers) {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Nicknames and playertypes must match maxPlayers"
    );
  }
  if (!nicknames.includes(userNickname)) {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Nicknames must contain userNickname."
    );
  }
  if (playerTypes[nicknames.indexOf(userNickname)] !== "HUMAN") {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Player type for user must be HUMAN."
    );
  }

  const data = await transactionTournament(
    name,
    maxPlayers,
    userId,
    userNickname,
    nicknames,
    playerTypes
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

export async function patchTournamentMatchHandler(request, reply) {
  request.action = "Patch tournament match";

  const tournamentId = request.params.id;
  const matchNumber = request.params.matchNumber;
  const userId = request.user.id;
  const { player1Score, player2Score } = request.body;

  const tournaments = await getUserTournaments(userId, undefined, {
    tournamentId
  });
  if (tournaments.length === 0) {
    return httpError(
      reply,
      404,
      createResponseMessage(request.action, false),
      "No record was found for an update."
    );
  }
  const tournament = tournaments[0];

  const bracketMatch = await getBracketMatch(tournamentId, matchNumber);
  if (bracketMatch.winner) {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "This bracket match already has a winner."
    );
  }

  if (player1Score > player2Score) {
    bracketMatch.winner = bracketMatch.player1Nickname;
  } else if (player2Score > player1Score) {
    bracketMatch.winner = bracketMatch.player2Nickname;
  } else {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Match cannot end in a draw"
    );
  }

  const playedAs =
    tournament.userNickname === bracketMatch.player1Nickname
      ? "PLAYERONE"
      : tournament.userNickname === bracketMatch.player2Nickname
        ? "PLAYERTWO"
        : "NONE";

  const hasUserWon = bracketMatch.winner === tournament.userNickname;

  const date = new Date();

  const data = await transactionUpdateBracket(
    userId,
    player1Score,
    player2Score,
    playedAs,
    hasUserWon,
    bracketMatch,
    date
  );

  return reply
    .code(201)
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
