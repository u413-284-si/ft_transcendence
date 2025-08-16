import { ApexOptions } from "apexcharts";
import { chartColors } from "./chartUtils.js";

export function buildFriendsWinRateOptions(
  data: ApexAxisChartSeries
): ApexOptions {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 600
    },
    legend: { show: false },
    plotOptions: {
      bar: {
        columnWidth: "70%"
      }
    },
    series: data,
    tooltip: { theme: "dark" },
    xaxis: {
      categories: [i18next.t("statsView.winRate")],
      labels: { style: { colors: [chartColors.white] } }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: [chartColors.white] },
        formatter: (val: number) => `${val}%`
      },
      title: {
        text: i18next.t("statsView.winRate"),
        style: { color: chartColors.white }
      }
    }
  };
  return options;
}
