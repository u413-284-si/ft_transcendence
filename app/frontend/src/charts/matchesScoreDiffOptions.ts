import type { ApexOptions } from "apexcharts";
import { chartColors, toAxisSeries } from "./chartUtils.js";
import { formatDateTime } from "../formatDate.js";
import { DataSeries } from "../types/DataSeries.js";

export function buildMatchesScoreDiffOptions(
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
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false
      },
      width: 600,
      height: 300
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        distributed: true,
        colors: {
          ranges: [
            {
              from: -100,
              to: -1,
              color: chartColors.red
            },
            {
              from: 0,
              to: 100,
              color: chartColors.cyan
            }
          ]
        }
      }
    },
    series: series,
    tooltip: {
      theme: "dark",
      x: {
        formatter: (_val, opts) => datetimeLabels[opts.dataPointIndex]
      },
      y: {
        formatter: (val: number) => `${val > 0 ? "+" : ""}${val}`
      }
    },
    xaxis: {
      type: "category",
      labels: { style: { colors: chartColors.white } }
    },
    yaxis: {
      title: {
        text: name,
        style: { color: chartColors.white }
      },
      labels: { style: { colors: chartColors.white } },
      forceNiceScale: true
    }
  };
  return options;
}
