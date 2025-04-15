export type Token = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  dateJoined: string;
  iat?: number;
  exp?: number;
};
