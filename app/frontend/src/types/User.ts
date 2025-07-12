export type User = {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  dateJoined: string;
  authProvider?: string;
};
