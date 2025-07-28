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

export function makeChartOptions(
  base: Omit<ApexOptions, "series">,
  series: ApexAxisChartSeries
): ApexOptions {
  return {
    ...base,
    series
  };
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

const friendsColors = [
  chartColors.cyan,
  chartColors.yellow,
  chartColors.purple,
  chartColors.green
];

const friendsColorsTailwind = [
  "bg-neon-cyan",
  "bg-neon-yellow",
  "bg-neon-purple",
  "bg-neon-green"
];

const friendColorMap = new Map<string, number>();

function getNextAvailableColorIndex(): number {
  const used = new Set(friendColorMap.values());

  for (let i = 0; i < friendsColors.length; i++) {
    if (!used.has(i)) {
      return i;
    }
  }

  throw new Error("No available colors left!");
}

export function addFriend(friend: string): void {
  if (!friendColorMap.has(friend)) {
    const nextIndex = getNextAvailableColorIndex();
    friendColorMap.set(friend, nextIndex);
  }
}

export function removeFriend(friend: string): void {
  friendColorMap.delete(friend);
}

export function getColors(friends: string[]): string[] {
  return friends.map((f) => {
    const index = friendColorMap.get(f);
    return index !== undefined ? friendsColors[index] : "grey";
  });
}

export function getColor(friend: string): string {
  const index = friendColorMap.get(friend);
  if (!index) {
    throw new Error(`No color for ${friend}`);
  }
  return friendsColorsTailwind[index];
}
