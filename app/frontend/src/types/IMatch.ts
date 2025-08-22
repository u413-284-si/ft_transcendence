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
