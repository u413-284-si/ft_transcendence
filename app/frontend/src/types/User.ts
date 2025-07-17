export type User = {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  language: "en" | "fr" | "de" | "pi";
  dateJoined: string;
  authProvider?: string;
};
