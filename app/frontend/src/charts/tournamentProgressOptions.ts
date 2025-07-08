import type { ApexOptions } from "apexcharts";

export const tournamentProgressOptions: Omit<ApexOptions, "series"> = {
  chart: {
    type: "bar",
    stacked: true,
    fontFamily: "inherit",
    background: "transparent",
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4
    }
  },
  colors: ["var(--color-neon-green)", "var(--color-neon-red)"],
  xaxis: {
    type: "category",
    title: {
      text: "Tournament Size"
    },
    labels: {
      formatter: (val: string) => `${val}-Player`
    }
  },
  yaxis: {
    title: {
      text: "Number of Tournaments"
    },
    min: 0,
    forceNiceScale: true,
    labels: {
      formatter: (val: number) => `${val}`
    }
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val: number) => `${val}`
    }
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: {
      colors: "var(--color-grey)"
    }
  }
};
