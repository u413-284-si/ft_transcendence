export type User = {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  language: Language;
  dateJoined: string;
  authProvider?: string;
};

export type Language = "en" | "fr" | "de" | "pi" | "tr";
