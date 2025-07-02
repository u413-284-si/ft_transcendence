type HeatmapDataPoint = {
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
  data: HeatmapDataPoint[];
};

type HeatmapSeries = HeatmapSeriesItem[];
