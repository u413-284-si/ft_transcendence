import type { ApexOptions } from "apexcharts";
import { formatDayMonth, toAxisSeries } from "./utils.js";

export function makeScoresLastTenDaysOptions(
  name: string,
  data: { x: string; y: number }[]
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
      height: 300
    },
    colors: ["var(--color-neon-cyan)"],
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
              color: "var(--color-neon-cyan)"
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
      }
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
        rotateAlways: true
      }

    },
    yaxis: {
      title: {
        text: "Score"
      },
      min: 0,
      stepSize: 1
    }
  };
  return options;
}
