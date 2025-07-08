import { Header3 } from "./Header3.js";

export type ChartOptions = {
  title: string;
  chartId: string;
  outerClassName?: string;
  chartClassName?: string;
};

export function Chart({
  title,
  chartId,
  outerClassName = "",
  chartClassName = ""
}: ChartOptions): string {
  const defaultOuterClasses =
    "bg-emerald-dark/80 border border-neon-cyan rounded-lg p-6 transition-shadow duration-300 hover:shadow-neon-cyan hover:scale-[1.02]";
  const defaultChartClasses = "mt-8";

  const outerClasses = [defaultOuterClasses, outerClassName].join(" ").trim();
  const chartClasses = [defaultChartClasses, chartClassName].join(" ").trim();

  return /* HTML */ `
    <div class="${outerClasses}">
      ${Header3({ text: title, variant: "white" })}
      <div id="${chartId}" class="${chartClasses}"></div>
    </div>
  `;
}
