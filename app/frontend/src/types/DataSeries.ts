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
