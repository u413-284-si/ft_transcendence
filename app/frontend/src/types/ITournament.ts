export interface TournamentDTO {
  id?: number;
  name: string;
  maxPlayers: number;
  userId: number;
  userNickname: string;
  roundReached: number;
  bracket: string;
}
