import { ApexOptions } from "apexcharts";
import { TournamentDayData } from "../types/DataSeries.js";

export function maketournamentLastNDaysOptions(
  data: TournamentDayData
): ApexOptions {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 300
    },
    series: data,
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0
          }
        },
        barHeight: "70%"
      }
    },
    yaxis: {
      title: { text: "Number of Tournaments" },
      forceNiceScale: true
    },
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: true
      }
    },
    legend: {
      position: "top"
    },
    tooltip: {
      theme: "dark"
    },
    colors: ["#22c55e", "#bbf7d0", "#3b82f6", "#bfdbfe", "#a855f7", "#ddd6fe"]
  };

  return options;
}
