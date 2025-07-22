import type { ApexOptions } from "apexcharts";

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
    colors: ["var(--color-neon-cyan)", "var(--color-neon-red)"],
    legend: {
      position: "bottom",
      labels: {
        colors: ["var(--color-white)", "var(--color-white)"]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["var(--color-white)"]
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
              color: "var(--color-white)",
              fontSize: "10px"
            },
            value: {
              color: "white"
            },
            total: {
              show: true,
              label: "Win Rate",
              color: "white",
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
