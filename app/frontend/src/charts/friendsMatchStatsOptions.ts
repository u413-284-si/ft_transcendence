import { ApexOptions } from "apexcharts";
import { chartColors, getColors } from "./utils.js";
import { FriendStatsSeries } from "../types/DataSeries.js";

export function makeFriendsMatchStatsOptions(
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
      width: 750
    },
    xaxis: {
      categories: [
        i18next.t("statsView.played"),
        i18next.t("global.won"),
        i18next.t("global.lost")
      ],
      labels: {
        style: {
          colors: [chartColors.white, chartColors.white, chartColors.white]
        }
      }
    },
    yaxis: {
      labels: { style: { colors: [chartColors.white] } },
      title: {
        text: i18next.t("statsView.matches"),
        style: { color: chartColors.white }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "60%"
      }
    },
    legend: { show: false },
    tooltip: { theme: "dark" },
    series: filtered,
    colors
  };
}
