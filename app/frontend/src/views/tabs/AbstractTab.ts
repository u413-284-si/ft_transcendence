import { renderChart } from "../../charts/chartUtils.js";
import { toaster } from "../../Toaster.js";

export abstract class AbstractTab {
  protected charts: Record<string, ApexCharts> = {};
  protected chartOptions: Record<string, ApexCharts.ApexOptions> = {};
  protected isInit: boolean = false;

  abstract getHTML(): string;

  async onShow(): Promise<void> {
    if (!this.isInit) {
      await this.init();
    }
    for (const chartId in this.chartOptions) {
      try {
        this.charts[chartId] = await renderChart(
          chartId,
          this.chartOptions[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }

  abstract init(): Promise<void>;

  onHide(): void {
    for (const chartId in this.charts) {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy();
        delete this.charts[chartId];
      }
    }
  }
}
