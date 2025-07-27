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

type TournamentSummaryPoint = {
  size: number;
  winrate: number;
  played: number;
  won: number;
};

export type TournamentSummaryData = {
  data: TournamentSummaryPoint[];
};

type TournamentProgressPoint = {
  x: number;
  y: number;
};

type TournamentProgressSeries = TournamentProgressPoint[];

type TournamentProgressData = {
  [size: string]: TournamentProgressSeries;
};

type TournamentDayPoint = {
  x: string;
  y: number;
};

export type TournamentDaySeries = {
  name: "win" | "loss";
  data: TournamentDayPoint[];
};

export type TournamentDayData = {
  [size: string]: TournamentDaySeries[];
};

export type DashboardTournaments = {
  summary: TournamentSummaryData;
  progress: TournamentProgressData;
  lastNDays: TournamentDayData;
};
