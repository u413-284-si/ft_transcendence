import { ApexOptions } from "apexcharts";
import { TournamentDaySeries } from "../types/DataSeries.js";
import { chartColors, tournamentColors } from "./chartUtils.js";
import { formatDayMonth } from "../formatDate.js";
import { TournamentSize } from "../types/ITournament.js";

export function buildTournamentsLastTenDaysOptions(
  data: TournamentDaySeries[],
  size: TournamentSize
): ApexOptions {
  const transformedData = data.map((series) => ({
    name: i18next.t(`chart.${series.name}`),
    data: series.data.map((point) => ({
      x: formatDayMonth(point.x),
      y: point.y
    }))
  }));
  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      stacked: true,
      toolbar: {
        show: false
      },
      height: 300,
      width: 800
    },
    series: transformedData,
    plotOptions: {
      bar: {
        horizontal: false,
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
    yaxis: {
      title: {
        text: i18next.t("statsView.tournaments"),
        style: { color: chartColors.white }
      },
      forceNiceScale: true,
      labels: { style: { colors: chartColors.white } }
    },
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: { colors: chartColors.white }
      }
    },
    legend: {
      position: "top",
      labels: {
        colors: [chartColors.white, chartColors.white]
      }
    },
    tooltip: {
      theme: "dark"
    },
    colors: [tournamentColors[size], chartColors["red"]]
  };

  return options;
}
