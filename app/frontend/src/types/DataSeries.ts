type DataPoint = {
  x: string;
  y: number;
};

export type DataSeries = DataPoint[];

export type DashboardMatches = {
  winrate: DataSeries;
  scoreDiff: DataSeries;
  scores: DataSeries;
};
