type WinratePoint = {
  x: string; // match number
  y: number;
};

export type WinrateSeries = WinratePoint[];

type ScoreDiffPoint = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoreDiffSeries = ScoreDiffPoint[];

type TournamentProgressPoint = {
  x: string; // tournament size
  y: number; // number of games won/lost
};

export type TournamentProgressSeries = {
  name: "won" | "lost";
  data: TournamentProgressPoint[];
}[];

type WinStreakPoint = {
  x: string; // ISO 8601 date string
  y: number;
};

type WinStreakSeries = WinStreakPoint[];

export type WinStreakStats = {
  maxStreak: number;
  currentStreak: number;
  data: WinStreakSeries;
};

type ScoresLastTenDays = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoresLastTenDaysSeries = ScoresLastTenDays[];
