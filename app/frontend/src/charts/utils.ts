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
  baseOptions: Omit<ApexOptions, "series">,
  seriesName: string,
  seriesData: ApexAxisChartSeries[0]["data"]
): ApexOptions;

export function makeChartOptions(
  baseOptions: Omit<ApexOptions, "series">,
  series: ApexAxisChartSeries
): ApexOptions;

export function makeChartOptions(
  baseOptions: Omit<ApexOptions, "series">,
  nameOrSeries: string | ApexAxisChartSeries,
  data?: ApexAxisChartSeries[0]["data"]
): ApexOptions {
  const series: ApexAxisChartSeries = Array.isArray(nameOrSeries)
    ? nameOrSeries
    : [
        {
          name: nameOrSeries,
          data: data ?? []
        }
      ];

  return {
    ...baseOptions,
    series
  };
}
