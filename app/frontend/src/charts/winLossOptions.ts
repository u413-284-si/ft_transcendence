import type { ApexOptions } from "apexcharts";
import { CSSColors } from "./utils.js";

export function makeWinLossOptions(
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
    labels: ["Wins", "Losses"],
    colors: [CSSColors.cyan, CSSColors.red],
    legend: {
      position: "bottom",
      labels: {
        colors: [CSSColors.white, CSSColors.white]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: [CSSColors.white]
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
              color: CSSColors.white,
              fontSize: "10px"
            },
            value: {
              color: CSSColors.white
            },
            total: {
              show: true,
              label: "Win Rate",
              color: CSSColors.white,
              fontSize: "10px",
              formatter: () => `${winRate.toFixed(1)}%`
            }
          }
        }
      }
    }
  };
  return winLossOptions;
}
