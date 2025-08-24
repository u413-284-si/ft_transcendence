import {
  getAllTournaments,
  getTournament,
  updateTournament,
  deleteAllTournaments,
  deleteTournament
} from "../services/tournaments.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError, httpError } from "../utils/error.js";
import {
  transactionTournament,
  transactionUpdateBracket
} from "../services/transactions.services.js";
import { getBracketMatch } from "../services/bracket_match.services.js";

export async function createTournamentHandler(request, reply) {
  const action = "Create tournament";
  try {
    const userId = request.user.id;
    const { name, maxPlayers, userNickname, nicknames, playerTypes } =
      request.body;

    if (nicknames.length !== maxPlayers || playerTypes.length !== maxPlayers) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Nicknames and playertypes must match maxPlayers"
      );
    }
    if (!nicknames.includes(userNickname)) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Nicknames must contain userNickname."
      );
    }
    if (playerTypes[nicknames.indexOf(userNickname)] !== "HUMAN") {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
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

export async function patchTournamentMatchHandler(request, reply) {
  const action = "Patch tournament match";
  try {
    const tournamentId = request.params.id;
    const matchNumber = request.params.matchNumber;
    const userId = request.user.id;
    const { player1Score, player2Score } = request.body;

    const tournament = await getTournament(tournamentId);
    if (tournament.userId !== userId) {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "You are not allowed to update match of this tournament"
      );
    }

    const bracketMatch = await getBracketMatch(tournamentId, matchNumber);
    if (bracketMatch.winner) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
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
        createResponseMessage(action, false),
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
