import type { ApexOptions } from "apexcharts";

export const scoreDiffOptions: Omit<ApexOptions, "series"> = {
  chart: {
    type: "bar",
    fontFamily: "inherit",
    background: "transparent"
  },
  xaxis: {
    type: "category",
    title: {
      text: "Matches"
    }
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
  yaxis: {
    title: {
      text: "Score Differential"
    },
    labels: {
      formatter: (val: number) => `${val}`
    }
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val: number) => `${val > 0 ? "+" : ""}${val}`
    }
  },
  legend: {
    show: false
  }
};
