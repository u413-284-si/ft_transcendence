type WinratePoint = {
  x: string; // ISO 8601 date-time string
  y: number;
};

export type WinrateSeries = WinratePoint[];

type ScoreDiffPoint = {
  x: string; // ISO 8601 date-time string
  y: number;
};

export type ScoreDiffSeries = ScoreDiffPoint[];

type ScoresLastNDays = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoresLastNDaysSeries = ScoresLastNDays[];

export type DashboardMatches = {
  winrate: WinrateSeries;
  scoreDiff: ScoreDiffSeries;
  scores: ScoresLastNDaysSeries;
};

type TournamentProgressPoint = {
  x: string;
  y: number;
};

export type TournamentProgressSeries = {
  [size: string]: TournamentProgressPoint[];
};

type TournamentSummaryPoint = {
  x: string; // tournament size
  y: number; // number of games won/lost
};

export type TournamentSummarySeries = {
  name: "won" | "lost";
  data: TournamentSummaryPoint[];
}[];
