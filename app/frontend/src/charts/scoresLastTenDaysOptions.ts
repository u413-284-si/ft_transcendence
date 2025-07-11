import type { ApexOptions } from "apexcharts";

export const scoresLastTenDaysOptions: Omit<ApexOptions, "series"> = {
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
  tooltip: {
    theme: "dark",
    y: {
      formatter: (value: number) => `${value} points`
    }
  },
  xaxis: {
    type: "category"
  },
  yaxis: {
    title: {
      text: "Score"
    },
    min: 0,
    stepSize: 1
  }
};
