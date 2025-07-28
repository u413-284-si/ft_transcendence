import { ApexOptions } from "apexcharts";

export function makeFriendsMatchStatsOptions(
  series: ApexAxisChartSeries
): ApexOptions {
  return {
    chart: {
      type: "bar",
      background: "transparent",
      height: 300,
      width: 500
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
    legend: { labels: { colors: ["#fff"] } },
    tooltip: { theme: "dark" },
    series
  };
}
