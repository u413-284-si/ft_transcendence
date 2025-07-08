import type { ApexOptions } from "apexcharts";

export const scoresLastTenDaysOptions: Omit<ApexOptions, "series"> = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false // hide download menu etc
    }
  },
  xaxis: {
    type: "category",
    categories: [], // will be auto-filled by your series' x values
    title: {
      text: "Date"
    },
    labels: {
      rotate: -45 // rotate date labels for better readability
    }
  },
  yaxis: {
    title: {
      text: "Score"
    },
    min: 0
  },
  dataLabels: {
    enabled: true // show values on top of bars
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: "50%", // width of each bar
      distributed: false // all bars same color
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} points`
    }
  }
};
