import type { ApexOptions } from "apexcharts";
import { TournamentSummaryData } from "../types/DataSeries";
import { toAxisSeries, tournamentColors } from "./utils.js";

export function maketournamentSummaryOptions(
  name: string,
  data: TournamentSummaryData
): ApexOptions {
  const series = toAxisSeries(name, data.data);
  const options: ApexOptions = {
    series: series,
    chart: {
      type: "radialBar",
      fontFamily: "inherit",
      background: "transparent",
      height: 300,
      width: 400
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent"
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "14px",
          formatter: function (seriesName, opts) {
            const detail = data.details[opts.seriesIndex];
            return `${seriesName}: ${detail.won} (${detail.played})`;
          }
        }
      }
    },
    colors: [
      tournamentColors[4][0],
      tournamentColors[8][0],
      tournamentColors[16][0]
    ],
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: ({ series, seriesIndex, w }) => {
        const label = w.globals.labels[seriesIndex];
        const detail = data.details[seriesIndex];
        const winRate = series[seriesIndex];
        return /* HTML */ `
          <div style="padding:8px; color:white; font-size:14px;">
            <strong>${label}</strong><br />
            Wins: ${detail.won}<br />
            Played: ${detail.played}<br />
            Win Rate: ${winRate}%
          </div>
        `;
      }
    }
  };
  return options;
}
