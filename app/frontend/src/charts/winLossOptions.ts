import type { ApexOptions } from "apexcharts";
import { chartColors } from "./utils.js";

export function makeWinLossOptions(
  wins: number,
  losses: number,
  winRate: number,
  labelsLegend: string[],
  labelTotal: string
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
    labels: labelsLegend,
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
              label: labelTotal,
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
