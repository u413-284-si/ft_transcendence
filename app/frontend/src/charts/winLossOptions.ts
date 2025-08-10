import type { ApexOptions } from "apexcharts";
import { chartColors } from "./chartUtils.js";

export function buildMatchesWinLossOptions(
  wins: number,
  losses: number,
  winRate: number
): ApexOptions {
  const winLossOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      background: "transparent",
      width: 450,
      height: 300
    },
    series: [wins, losses],
    labels: [i18next.t("global.won"), i18next.t("global.lost")],
    colors: [chartColors.cyan, chartColors.red],
    legend: {
      position: "bottom",
      labels: {
        colors: [chartColors.white, chartColors.white]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: [chartColors.white]
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: -10,
              color: chartColors.white,
              fontSize: "10px"
            },
            value: {
              color: chartColors.white
            },
            total: {
              show: true,
              label: i18next.t("statsView.winRate"),
              color: chartColors.white,
              fontSize: "10px",
              formatter: () => `${winRate.toFixed(1)}%`
            }
          }
        }
      }
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false
    }
  };
  return winLossOptions;
}
