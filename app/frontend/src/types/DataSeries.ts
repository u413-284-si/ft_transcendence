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
  x: string; // tournament size
  y: number; // number of games won/lost
};

type TournamentSummarySeries = {
  name: "won" | "lost";
  data: TournamentSummaryPoint[];
}[];

type TournamentProgressPoint = {
  x: string;
  y: number;
};

type TournamentProgressSeries = {
  [size: string]: TournamentProgressPoint[];
};

export type TournamentDayPoint = {
  x: string;
  y: number;
};

export type TournamentDaySeries = {
  name: string;
  data: TournamentDayPoint[];
};

export type TournamentDayData = TournamentDaySeries[];

export type DashboardTournaments = {
  summary: TournamentSummarySeries;
  progress: TournamentProgressSeries;
  lastNDays: TournamentDayData;
};
