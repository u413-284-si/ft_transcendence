import { ApexOptions } from "apexcharts";
import { chartColors, getColors } from "./utils.js";
import { FriendStatsSeries } from "../types/DataSeries.js";

export function makeFriendsWinstreakOptions(
  data: FriendStatsSeries,
  selectedFriends: string[]
): ApexOptions {
  const filtered = data.filter((friend) =>
    selectedFriends.includes(friend.name)
  );
  const colors = getColors(selectedFriends);
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
        i18next.t("statsView.maxStreak")
      ],
      labels: { style: { colors: [chartColors.white, chartColors.white] } }
    },
    yaxis: {
      labels: { style: { colors: [chartColors.white] } },
      title: {
        text: i18next.t("statsView.winstreak"),
        style: { color: chartColors.white }
      },
      forceNiceScale: true
    },
    tooltip: { theme: "dark" },
    series: filtered,
    colors: colors
  };
}
