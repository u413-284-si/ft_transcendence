import { ApexOptions } from "apexcharts";

export function makeFriendsWinRateOptions(
  series: ApexAxisChartSeries,
  colors: string[]
): ApexOptions {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 500
    },
    xaxis: {
      categories: ["Win Rate"],
      labels: { style: { colors: ["#fff"] } }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: ["#fff"] },
        formatter: (val: number) => `${val}%`
      },
      title: {
        style: { color: "#fff" }
      }
    },
    tooltip: { theme: "dark" },
    plotOptions: {
      bar: {
        columnWidth: "50%"
      }
    },
    legend: { labels: { colors: ["#fff"] } },
    colors: colors,
    series
  };
  return options;
}
