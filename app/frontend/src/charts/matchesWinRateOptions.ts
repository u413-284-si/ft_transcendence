import type { ApexOptions } from "apexcharts";
import { chartColors, toAxisSeries } from "./chartUtils.js";
import { formatDateTime } from "../formatDate.js";
import { DataSeries } from "../types/DataSeries.js";

export function buildMatchesWinRateOptions(
  name: string,
  data: DataSeries,
  totalMatches: number
): ApexOptions {
  const startingPoint = Math.max(totalMatches - data.length + 1, 0);
  const transformedData = data.map((match, i) => ({
    x: `# ${startingPoint + i}`,
    y: match.y
  }));

  const datetimeLabels = data.map((match) => formatDateTime(match.x));

  const series = toAxisSeries(name, transformedData);

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false
      },
      width: 750,
      height: 300,
      zoom: {
        enabled: false
      }
    },
    colors: [chartColors.cyan],
    markers: { size: 5 },
    series: series,
    stroke: { curve: "smooth", width: 3 },
    tooltip: {
      theme: "dark",
      x: {
        formatter: (_val, opts) => datetimeLabels[opts.dataPointIndex]
      },
      y: { formatter: (val: number) => `${val.toFixed(2)}%` }
    },
    xaxis: {
      type: "category",
      labels: { style: { colors: chartColors.white } }
    },
    yaxis: {
      title: { text: name, style: { color: chartColors.white } },
      labels: {
        style: { colors: chartColors.white },
        formatter: (val: number) => `${val}%`
      },
      forceNiceScale: true,
      min: 0,
      max: 100
    }
  };
  return options;
}
