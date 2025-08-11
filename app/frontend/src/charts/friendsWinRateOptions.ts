import { ApexOptions } from "apexcharts";
import { chartColors } from "./chartUtils.js";
import { FriendStatsSeries } from "../types/DataSeries.js";

export function buildFriendsWinRateOptions(
  data: FriendStatsSeries,
  selectedFriends: string[],
  colors: string[]
): ApexOptions {
  const filtered = data.filter((friend) =>
    selectedFriends.includes(friend.name)
  );
  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 600
    },
    xaxis: {
      categories: [i18next.t("statsView.winRate")],
      labels: { style: { colors: [chartColors.white] } }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: [chartColors.white] },
        formatter: (val: number) => `${val}%`
      },
      title: {
        text: i18next.t("statsView.winRate"),
        style: { color: chartColors.white }
      }
    },
    tooltip: { theme: "dark" },
    plotOptions: {
      bar: {
        columnWidth: "70%"
      }
    },
    legend: { show: false },
    colors: colors,
    series: filtered
  };
  return options;
}
