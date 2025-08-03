import { TournamentSize } from "./ITournament";

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
  [K in TournamentSize]: TournamentProgressSeries;
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
  [K in TournamentSize]: TournamentDaySeries[];
};

export type TournamentPlayedSeries = {
  [K in TournamentSize]: TournamentDayPoint[];
};

export type DashboardTournaments = {
  summary: TournamentSummaryData;
  progress: TournamentProgressData;
  lastNDays: TournamentDayData;
};

type FriendStatsPoint = {
  name: string;
  data: number[];
};

export type FriendStatsSeries = FriendStatsPoint[];

export type DashboardFriends = {
  matchStats: FriendStatsSeries;
  winRate: FriendStatsSeries;
  winstreak: FriendStatsSeries;
};
