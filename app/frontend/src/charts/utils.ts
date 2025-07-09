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
  series: ApexAxisChartSeries,
): ApexOptions;


export function makeChartOptions(
  base: Omit<ApexOptions, "series">,
  series: ApexAxisChartSeries,
): ApexOptions {
  return {
    ...base,
    series,
  };
}

export function toAxisSeries(
  name: string,
  data: ApexAxisChartSeries[0]["data"]
): ApexAxisChartSeries {
  return [{ name, data }];
}
