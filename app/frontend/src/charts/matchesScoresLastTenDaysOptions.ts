import type { ApexOptions } from "apexcharts";
import { chartColors, toAxisSeries } from "./chartUtils.js";
import { formatDate, formatDayMonth } from "../formatDate.js";
import { DataSeries } from "../types/DataSeries.js";

export function buildMatchesScoresLastTenDaysOptions(
  name: string,
  data: DataSeries
): ApexOptions {
  const transformedData = data.map((point) => ({
    x: formatDayMonth(point.x),
    y: point.y
  }));

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
    colors: [chartColors.cyan],
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      bar: {
        distributed: false,
        colors: {
          ranges: [
            {
              from: 0,
              color: chartColors.cyan
            }
          ]
        }
      }
    },
    series: series,
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value: number) => `${value} points`
      },
      x: {
        formatter: (val, opts) => {
          const dataPointIndex = opts.dataPointIndex;
          const originalDateStr = data[dataPointIndex].x;
          return formatDate(new Date(originalDateStr));
        }
      }
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: { colors: chartColors.white }
      }
    },
    yaxis: {
      title: {
        text: name,
        style: { color: chartColors.white }
      },
      min: 0,
      forceNiceScale: true,
      labels: { style: { colors: chartColors.white } }
    }
  };
  return options;
}
