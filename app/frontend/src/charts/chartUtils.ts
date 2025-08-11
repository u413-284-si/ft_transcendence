import type { ApexOptions } from "apexcharts";
import { getEl } from "../utility.js";
import { TournamentSize } from "../types/ITournament.js";

export async function renderChart(
  id: string,
  options: ApexOptions
): Promise<ApexCharts> {
  const chartEl = getEl(id);

  const chart = new ApexCharts(chartEl, options);
  await chart.render();
  return chart;
}

export function toAxisSeries(
  name: string,
  data: { x: string | Date; y: number }[]
): ApexAxisChartSeries {
  return [{ name, data }];
}

function getColorFromCSSProperty(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export const chartColors = {
  white: getColorFromCSSProperty("--color-white-hex"),
  cyan: getColorFromCSSProperty("--color-neon-cyan-hex"),
  red: getColorFromCSSProperty("--color-neon-red-hex"),
  green: getColorFromCSSProperty("--color-neon-green-hex"),
  yellow: getColorFromCSSProperty("--color-neon-yellow-hex"),
  purple: getColorFromCSSProperty("--color-neon-purple-hex")
};

export const tournamentColors: Record<TournamentSize, string> = {
  4: chartColors.cyan,
  8: chartColors.yellow,
  16: chartColors.purple
};

export const friendsColors = [
  chartColors.cyan,
  chartColors.yellow,
  chartColors.purple,
  chartColors.green
];

export const friendsColorsTailwind = [
  "bg-neon-cyan",
  "bg-neon-yellow",
  "bg-neon-purple",
  "bg-neon-green"
];
