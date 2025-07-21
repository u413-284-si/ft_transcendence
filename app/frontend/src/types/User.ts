export type User = {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  language: Language;
  dateJoined: string;
  authProvider?: string;
};

export enum Language {
  en = "en",
  fr = "fr",
  de = "de",
  pi = "pi",
  tr = "tr"
}
