import type { ApexOptions } from "apexcharts";
import { TournamentSummaryData } from "../types/DataSeries";
import { tournamentColors } from "./chartUtils.js";

export function buildTournamentsSummaryOptions(
  data: TournamentSummaryData
): ApexOptions {
  const transformedData = data.data.map((point) => ({
    label: `${i18next.t("chart.numPlayers", { num: point.size })}`,
    winrate: point.winrate,
    played: point.played,
    won: point.won
  }));
  const series = data.data.map((p) => p.winrate);
  const labels = data.data.map(
    (p) => `${i18next.t("chart.numPlayers", { num: p.size })}`
  );
  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      fontFamily: "inherit",
      background: "transparent",
      height: 300,
      width: 400
    },
    labels: labels,
    series: series,
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
            const detail = data.data[opts.seriesIndex];
            return `${seriesName}: ${detail.won} (${detail.played})`;
          }
        }
      }
    },
    colors: [tournamentColors[4], tournamentColors[8], tournamentColors[16]],
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: ({ seriesIndex }) => {
        const { label, won, played, winrate } = transformedData[seriesIndex];
        const labelText = i18next.t("global.label", {
          field: i18next.t("global.won")
        });
        const playedText = i18next.t("global.label", {
          field: i18next.t("statsView.played")
        });
        const winrateText = i18next.t("global.label", {
          field: i18next.t("statsView.winRate")
        });
        return /* HTML */ `
          <div style="padding:8px; color:white; font-size:14px;">
            <strong>${label}</strong><br />
            ${labelText} ${won}<br />
            ${playedText} ${played}<br />
            ${winrateText} ${winrate}%
          </div>
        `;
      }
    }
  };
  return options;
}
