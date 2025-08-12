import { ApexOptions } from "apexcharts";
import { chartColors } from "./chartUtils.js";

export function buildFriendsMatchStatsOptions(
  data: ApexAxisChartSeries
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
    xaxis: {
      categories: [
        i18next.t("statsView.played"),
        i18next.t("global.won"),
        i18next.t("global.lost")
      ],
      labels: {
        style: {
          colors: [chartColors.white, chartColors.white, chartColors.white]
        }
      }
    },
    yaxis: {
      labels: { style: { colors: [chartColors.white] } },
      title: {
        text: i18next.t("statsView.matches"),
        style: { color: chartColors.white }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "60%"
      }
    },
    legend: { show: false },
    tooltip: { theme: "dark" },
    series: data
  };
}
