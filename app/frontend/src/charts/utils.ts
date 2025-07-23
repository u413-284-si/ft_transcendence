import type { ApexOptions } from "apexcharts";

export function renderChart(id: string, options: ApexOptions): ApexCharts {
  const chartEl = document.getElementById(id);
  if (!chartEl) {
    throw new Error(`Element not found for id: ${id}`);
  }

  const chart = new ApexCharts(chartEl, options);
  chart.render();
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

export function formatDateTime(input: string): string {
  const date = new Date(input);
  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium"
  });
}

export function formatDayMonth(input: string): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit"
  });
}

function getColorFromCSSProperty(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export const CSSColors = {
  white: getColorFromCSSProperty("--color-white-hex"),
  cyan: getColorFromCSSProperty("--color-neon-cyan-hex"),
  red: getColorFromCSSProperty("--color-neon-red-hex"),
  green: getColorFromCSSProperty("--color-neon-green-hex"),
  yellow: getColorFromCSSProperty("--color-neon-yellow-hex"),
  purple: getColorFromCSSProperty("--color-neon-purple-hex")
};

export const tournamentColors = {
  4: [CSSColors.cyan],
  8: [CSSColors.yellow],
  16: [CSSColors.purple]
};
