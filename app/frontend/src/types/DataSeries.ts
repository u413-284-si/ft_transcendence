import { TournamentSize } from "./ITournament";

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
  lastTenDays: TournamentDayData;
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
