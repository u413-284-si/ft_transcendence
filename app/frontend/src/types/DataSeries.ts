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
  date: string; // Format: 'YYYY-MM-DD'
  played4: number;
  won4: number;
  played8: number;
  won8: number;
  played16: number;
  won16: number;
};

export type TournamentDaySeries = TournamentDayPoint[];

export type DashboardTournaments = {
  summary: TournamentSummarySeries;
  progress: TournamentProgressSeries;
  lastNDays: TournamentDaySeries;
};
