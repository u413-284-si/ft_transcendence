type WinratePoint = {
  x: string; // ISO 8601 date-time string
  y: number;
};

type WinrateSeries = WinratePoint[];

type ScoreDiffPoint = {
  x: string; // ISO 8601 date-time string
  y: number;
};

type ScoreDiffSeries = ScoreDiffPoint[];

type ScoresLastNDays = {
  x: string; // ISO 8601 date string
  y: number;
};

type ScoresLastNDaysSeries = ScoresLastNDays[];

export type DashboardMatches = {
  winrate: WinrateSeries;
  scoreDiff: ScoreDiffSeries;
  scores: ScoresLastNDaysSeries;
};
