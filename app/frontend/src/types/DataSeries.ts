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

type HeatmapPoint = {
  x: string; // e.g. "00:00", "13:00"
  y: number; // count of matches
};

type DayName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type HeatmapSeriesItem = {
  name: DayName;
  data: HeatmapPoint[];
};

export type HeatmapSeries = HeatmapSeriesItem[];

type TournamentProgressPoint = {
  x: string; // tournament size
  y: number; // number of games won/lost
};

export type TournamentProgressSeries = {
  name: "won" | "lost";
  data: TournamentProgressPoint[];
}[];

type WinStreakPoint = {
  x: string; // ISO 8601 date string
  y: number;
};

type WinStreakSeries = WinStreakPoint[];

export type WinStreakStats = {
  maxStreak: number;
  currentStreak: number;
  data: WinStreakSeries;
};

type ScoresLastTenDays = {
  x: string; // ISO 8601 date string
  y: number;
};

export type ScoresLastTenDaysSeries = ScoresLastTenDays[];
