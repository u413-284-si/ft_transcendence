import type { ApexOptions } from "apexcharts";

export const scoreDiffOptions: Omit<ApexOptions, "series"> = {
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
  tooltip: {
    theme: "dark",
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
    },
  },
};
