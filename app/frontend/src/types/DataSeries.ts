type WinratePoint = {
  x: string; // ISO 8601 date string
  y: number;
};

export type WinrateSeries = WinratePoint[];

type ScoreDiffPoint = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoreDiffSeries = ScoreDiffPoint[];

type TournamentSummaryPoint = {
  x: string; // tournament size
  y: number; // number of games won/lost
};

export type TournamentSummarySeries = {
  name: "won" | "lost";
  data: TournamentSummaryPoint[];
}[];

type ScoresLastTenDays = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoresLastTenDaysSeries = ScoresLastTenDays[];

type TournamentProgressPoint = {
  x: string;
  y: number;
};

export type TournamentProgressSeries = {
  [size: string]: TournamentProgressPoint[];
};
