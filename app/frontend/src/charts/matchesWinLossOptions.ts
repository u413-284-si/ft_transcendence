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
      toolbar: {
        show: false
      },
      width: 450,
      height: 300
    },
    colors: [chartColors.cyan, chartColors.red],
    labels: [i18next.t("global.won"), i18next.t("global.lost")],
    legend: {
      position: "bottom",
      labels: {
        colors: [chartColors.white, chartColors.white]
      }
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
    series: [wins, losses],
    stroke: {
      show: true,
      width: 1,
      colors: [chartColors.white]
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false
    }
  };
  return winLossOptions;
}
