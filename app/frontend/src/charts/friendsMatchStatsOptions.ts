import { ApexOptions } from "apexcharts";

export function makeFriendsMatchStatsOptions(
  series: ApexAxisChartSeries,
  colors: string[]
): ApexOptions {
  return {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 750
    },
    title: {
      text: "Match Stats",
      style: { color: "#fff" }
    },
    xaxis: {
      categories: ["Played", "Won", "Lost"],
      labels: { style: { colors: ["#fff"] } }
    },
    yaxis: {
      labels: { style: { colors: ["#fff"] } }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%"
      }
    },
    legend: { show: false },
    tooltip: { theme: "dark" },
    series,
    colors
  };
}
