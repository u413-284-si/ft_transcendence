import { ApexOptions } from "apexcharts";

export function makeFriendsWinRateOptions(
  series: ApexAxisChartSeries
): ApexOptions {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 500
    },
    title: {
      text: "Win Rate Comparison",
      style: { color: "#fff" }
    },
    xaxis: {
      categories: ["Win Rate"],
      labels: { style: { colors: ["#fff"] } }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { style: { colors: ["#fff"] } },
      title: {
        text: "%",
        style: { color: "#fff" }
      }
    },
    tooltip: { theme: "dark" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%"
      }
    },
    legend: { labels: { colors: ["#fff"] } },
    colors: ["#00E396", "#FEB019", "#FF4560", "#775DD0"],
    series
  };
  console.log(options);
  return options;
}
