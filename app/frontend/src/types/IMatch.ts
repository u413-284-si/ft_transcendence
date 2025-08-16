export enum playedAs {
  NONE = "NONE",
  PLAYERONE = "PLAYERONE",
  PLAYERTWO = "PLAYERTWO"
}

export type PlayerType = "HUMAN" | "AI";

export interface Match {
  playedAs: playedAs;
  player1Nickname: string;
  player2Nickname: string;
  player1Score: number;
  player2Score: number;
  player1Type: PlayerType;
  player2Type: PlayerType;
  tournament?: {
    id: number;
    name: string;
  } | null;
  date?: string;
}

export type BracketMatch = {
  matchId: number;
  round: number;
  player1: string | null;
  player2: string | null;
  winner: string | null;
  nextMatchId?: number;
  winnerSlot?: 1 | 2;
};
