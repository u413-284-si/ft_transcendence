import { ApexOptions } from "apexcharts";

export function makeTournamentProgressOptions(
  name: string,
  data: { x: string; y: number }[]
): ApexOptions {
  const colors = ["#3dfdfb"];
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      width: 400
    },
    colors: colors,
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
        name: name,
        data: data
      }
    ],
    tooltip: {
      theme: "dark",
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const point = w.config.series[seriesIndex].data[dataPointIndex];
        const label = point.x;
        const value = point.y;

        let labelText = `${value} tournament${value === 1 ? "" : "s"}`;
        if (label === "Won") {
          labelText = `${value} tournament${value === 1 ? " was" : "s were"} won 🎉`;
        } else if (/^Round \d+$/.test(label)) {
          labelText = `${value} tournament${value === 1 ? "" : "s"} reached ${label}`;
        }

        return `<div class="apex-tooltip-custom">${labelText}</div>`;
      }
    }
  };
  return options;
}
