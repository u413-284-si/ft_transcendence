import { ApexOptions } from "apexcharts";
import { chartColors } from "./chartUtils.js";
import { FriendStatsSeries } from "../types/DataSeries.js";

export function buildFriendsWinstreakOptions(
  data: FriendStatsSeries,
  selectedFriends: string[],
  colors: string[]
): ApexOptions {
  const filtered = data.filter((friend) =>
    selectedFriends.includes(friend.name)
  );
  return {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: { show: false },
      height: 300,
      width: 600
    },
    legend: { show: false },
    xaxis: {
      categories: [
        i18next.t("chart.current"),
        i18next.t("statsView.winstreakMax")
      ],
      labels: { style: { colors: [chartColors.white, chartColors.white] } }
    },
    yaxis: {
      labels: { style: { colors: [chartColors.white] } },
      title: {
        text: i18next.t("statsView.winstreakCur"),
        style: { color: chartColors.white }
      },
      forceNiceScale: true
    },
    tooltip: { theme: "dark" },
    series: filtered,
    colors: colors
  };
}
