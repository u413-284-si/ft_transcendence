export interface TournamentDTO {
  id?: number;
  name: string;
  maxPlayers: number;
  adminId: number;
  activeUserNickname: string | null;
  bracket: string;
}
