import { ApexOptions } from "apexcharts";
import {
  TournamentDayPoint,
  TournamentDaySeries
} from "../types/DataSeries.js";
import { formatDayMonth } from "./utils.js";

type ChartData = TournamentDayPoint & {
  loss4: number;
  loss8: number;
  loss16: number;
};

export function maketournamentLastNDaysOptions(
  data: TournamentDaySeries
): ApexOptions {
  const chartData: ChartData[] = data.map((d) => ({
    ...d,
    loss4: d.played4 - d.won4,
    loss8: d.played8 - d.won8,
    loss16: d.played16 - d.won16
  }));

  const series = [
    {
      name: "Win 4",
      data: chartData.map((d) => d.won4)
    },
    {
      name: "Loss 4",
      data: chartData.map((d) => d.loss4)
    },
    {
      name: "Win 8",
      data: chartData.map((d) => d.won8)
    },
    {
      name: "Loss 8",
      data: chartData.map((d) => d.loss8)
    },
    {
      name: "Win 16",
      data: chartData.map((d) => d.won16)
    },
    {
      name: "Loss 16",
      data: chartData.map((d) => d.loss16)
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 300
    },
    series: series,
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
      categories: chartData.map((d) => formatDayMonth(d.date)),
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
