import { PlayerType } from "./IMatch";

export type TournamentSize = 4 | 8 | 16;

export interface TournamentDTO {
  id: number;
  name: string;
  maxPlayers: number;
  userId: number;
  userNickname: string;
  roundReached: number;
  bracket: BracketMatch[];
}

export type BracketMatch = {
  matchNumber: number;
  round: number;
  player1Nickname: string | null;
  player2Nickname: string | null;
  player1Type: PlayerType | null;
  player2Type: PlayerType | null;
  winner: string | null;
  nextMatchNumber: number | null;
  winnerSlot: 1 | 2 | null;
};

export type CreateTournamentParams = {
  name: string;
  maxPlayers: TournamentSize;
  userNickname: string;
  nicknames: string[];
  playerTypes: PlayerType[];
};
