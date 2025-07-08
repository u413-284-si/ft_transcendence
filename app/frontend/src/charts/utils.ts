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
  name: string,
  data: ApexAxisChartSeries[0]["data"]
): ApexOptions {
  const series: ApexAxisChartSeries = [
    {
      name,
      data
    }
  ];

  return {
    ...baseOptions,
    series
  };
}
