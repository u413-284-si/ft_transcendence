import type { ApexOptions } from "apexcharts";
import { toAxisSeries } from "./utils.js";

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

  const datetimeLabels = data.map((match) => {
    const date = new Date(match.x);
    return date.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  });

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
              color: "var(--color-neon-red)"
            },
            {
              from: 0,
              to: 100,
              color: "var(--color-neon-cyan)"
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
      type: "category"
    },
    yaxis: {
      title: {
        text: "Score Difference"
      }
    }
  };

  return options;
}
