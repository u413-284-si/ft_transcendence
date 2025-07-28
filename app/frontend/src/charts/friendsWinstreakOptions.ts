import { ApexOptions } from "apexcharts";

export function makeFriendsWinstreakOptions(
  series: ApexAxisChartSeries,
  colors: string[]
): ApexOptions {
  return {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false
      },
      height: 300
    },
    xaxis: {
      categories: ["Current", "Max"],
      labels: { style: { colors: ["#fff"] } }
    },
    yaxis: {
      labels: { style: { colors: ["#fff"] } },
      forceNiceScale: true
    },
    legend: { labels: { colors: ["#fff"] } },
    tooltip: { theme: "dark" },
    series,
    colors: colors
  };
}
