import type { ApexOptions } from "apexcharts";
import { CSSColors, formatDateTime, toAxisSeries } from "./utils.js";

export function makeScoreDiffOptions(
  name: string,
  data: { x: string; y: number }[],
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
              color: CSSColors.red
            },
            {
              from: 0,
              to: 100,
              color: CSSColors.cyan
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
      labels: { style: { colors: CSSColors.white } }
    },
    yaxis: {
      title: {
        text: "Score Difference",
        style: { color: CSSColors.white }
      },
      labels: { style: { colors: CSSColors.white } }
    }
  };
  return options;
}
