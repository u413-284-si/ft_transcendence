import { ApexOptions } from "apexcharts";
import {
  TournamentDayData,
  TournamentPlayedSeries
} from "../types/DataSeries.js";
import { chartColors, tournamentColors } from "./chartUtils.js";
import { TournamentSize } from "../types/ITournament.js";
import { formatDayMonth } from "../formatDate.js";

export function buildTournamentsPlayedOptions(
  data: TournamentDayData
): ApexOptions {
  const transformedSeries = computePlayedSeriesFromDayData(data);
  const series = Object.entries(transformedSeries).map(([size, points]) => ({
    name: `${i18next.t("chart.numPlayers", { num: size })}`,
    data: points.map((point) => ({
      x: formatDayMonth(point.x),
      y: point.y
    }))
  }));

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false
      },
      height: 300,
      width: 800,
      stacked: true,
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: { color: chartColors.white }
          }
        },
        barHeight: "70%"
      }
    },
    series: series,
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: { colors: chartColors.white }
      }
    },
    yaxis: {
      title: {
        text: i18next.t("statsView.tournaments"),
        style: { color: chartColors.white }
      },
      forceNiceScale: true,
      labels: { style: { colors: chartColors.white } }
    },
    tooltip: {
      theme: "dark"
    },
    legend: {
      position: "top",
      labels: {
        colors: chartColors.white
      }
    },
    colors: [tournamentColors[4], tournamentColors[8], tournamentColors[16]]
  };

  return options;
}

function computePlayedSeriesFromDayData(dayData: TournamentDayData) {
  const playedData = {} as TournamentPlayedSeries;

  const sizes: TournamentSize[] = [4, 8, 16];
  for (const size of sizes) {
    const seriesList = dayData[size];

    const winSeries = seriesList.find((s) => s.name === "win")?.data ?? [];
    const lossSeries = seriesList.find((s) => s.name === "loss")?.data ?? [];

    const combined = winSeries.map((winPoint, i) => {
      const lossPoint = lossSeries[i];
      return {
        x: winPoint.x,
        y: winPoint.y + (lossPoint?.y ?? 0)
      };
    });

    playedData[size] = combined;
  }

  return playedData;
}
