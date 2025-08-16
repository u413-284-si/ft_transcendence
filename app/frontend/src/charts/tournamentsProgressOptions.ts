import { ApexOptions } from "apexcharts";
import { tournamentColors } from "./chartUtils.js";
import { TournamentSize } from "../types/ITournament.js";

export function buildTournamentsProgressOptions(
  data: { x: number; y: number }[],
  size: TournamentSize
): ApexOptions {
  const totalRounds = Math.log2(size) + 1;
  const formatRoundLabel = (round: number): string => {
    return round === totalRounds
      ? i18next.t("global.won")
      : i18next.t("global.round", { round });
  };
  const formattedData = data.map((round) => ({
    x: formatRoundLabel(round.x),
    y: round.y
  }));

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false
      },
      height: 350,
      width: 400
    },
    colors: [tournamentColors[size]],
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
      dropShadow: {
        enabled: true
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        isFunnel: true,
        distributed: true
      }
    },
    series: [
      {
        name: i18next.t("chart.reachedThisStage"),
        data: formattedData
      }
    ],
    tooltip: {
      theme: "dark"
    }
  };
  return options;
}
