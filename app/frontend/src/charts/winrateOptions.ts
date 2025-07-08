import type { ApexOptions } from "apexcharts";

export const winrateOptions: Omit<ApexOptions, "series"> = {
  chart: {
    type: "line",
    fontFamily: "inherit",
    background: "transparent",
    width: 750,
    height: 300,
    zoom: {
      enabled: false
    }
  },
  colors: ["var(--color-neon-cyan)"],
  xaxis: {
    type: "category",
    labels: {
      formatter: (val: string) => `#${val}`
    }
  },
  yaxis: {
    title: { text: "Winrate" },
    labels: { formatter: (val: number) => `${val}%` }
  },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 5 },
  tooltip: {
    theme: "dark",
    y: { formatter: (val: number) => `${val.toFixed(2)}%` }
  }
};
