import prisma from "../prisma/prismaClient.js";
import {
  createBracketTx,
  updateBracketMatchTx
} from "./bracket_match.services.js";
import { createMatchTx } from "./matches.services.js";
import { createTournamentTx, generateBracket } from "./tournaments.services.js";
import { updateUserStatsTx } from "./user_stats.services.js";

async function createMatchAndUpdateStatsTx(
  tx,
  userId,
  playedAs,
  player1Nickname,
  player2Nickname,
  player1Score,
  player2Score,
  player1Type,
  player2Type,
  tournamentId,
  date
) {
  const match = await createMatchTx(
    tx,
    userId,
    playedAs,
    player1Nickname,
    player2Nickname,
    player1Score,
    player2Score,
    player1Type,
    player2Type,
    tournamentId,
    date
  );

  let stats = null;
  if (playedAs !== "NONE") {
    const isPlayerOne = playedAs === "PLAYERONE";
    stats = await updateUserStatsTx(
      tx,
      userId,
      (isPlayerOne ? player1Score : player2Score) >
        (isPlayerOne ? player2Score : player1Score)
    );
  }
  return { match, stats };
}

export async function transactionMatch(
  userId,
  playedAs,
  player1Nickname,
  player2Nickname,
  player1Score,
  player2Score,
  player1Type,
  player2Type,
  tournamentId,
  date
) {
  return prisma.$transaction(async (tx) => {
    const { match, stats } = await createMatchAndUpdateStatsTx(
      tx,
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      player1Type,
      player2Type,
      tournamentId,
      date
    );

    return { match, stats };
  });
}

export async function transactionTournament(
  name,
  maxPlayers,
  userId,
  userNickname,
  nicknames,
  playertypes
) {
  return prisma.$transaction(async (tx) => {
    const tournament = await createTournamentTx(
      tx,
      name,
      maxPlayers,
      userId,
      userNickname
    );

    const bracket = generateBracket(nicknames, playertypes, maxPlayers);

    await createBracketTx(tx, tournament.id, bracket);

    tournament.bracket = bracket;

    return tournament;
  });
}

function buildBracketUpdates(bracketMatch) {
  const {
    nextMatchNumber,
    winnerSlot,
    player1Nickname,
    player1Type,
    player2Type,
    winner
  } = bracketMatch;

  if (!nextMatchNumber || !winnerSlot) return null;

  const winnerPlayerType =
    winner === player1Nickname ? player1Type : player2Type;

  return winnerSlot === 1
    ? { player1Nickname: winner, player1Type: winnerPlayerType }
    : { player2Nickname: winner, player2Type: winnerPlayerType };
}

export async function transactionUpdateBracket(
  userId,
  player1Score,
  player2Score,
  playedAs,
  bracketMatch
) {
  const nextUpdate = buildBracketUpdates(bracketMatch);

  return prisma.$transaction(async (tx) => {
    const {
      player1Nickname,
      player2Nickname,
      player1Type,
      player2Type,
      tournamentId,
      matchNumber,
      winner,
      nextMatchNumber
    } = bracketMatch;
    const { match } = await createMatchAndUpdateStatsTx(
      tx,
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      player1Type,
      player2Type,
      tournamentId,
      new Date()
    );

    const currentBracketMatch = await updateBracketMatchTx(
      tx,
      tournamentId,
      matchNumber,
      { winner: winner }
    );

    if (nextUpdate) {
      await updateBracketMatchTx(tx, tournamentId, nextMatchNumber, nextUpdate);
    }

    return {
      match,
      bracketMatch: currentBracketMatch
    };
  });
}
