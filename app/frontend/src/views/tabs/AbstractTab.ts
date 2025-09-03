import { renderChart } from "../../charts/chartUtils.js";
import { toaster } from "../../Toaster.js";

export abstract class AbstractTab {
  protected charts: Record<string, ApexCharts> = {};
  protected chartBaseOptions: Record<string, ApexCharts.ApexOptions> = {};
  protected chartOptions: Record<string, ApexCharts.ApexOptions> = {};
  protected isInit: boolean = false;

  abstract getHTML(): string;

  async onShow(): Promise<void> {
    if (!this.isInit) {
      await this.init();
    }
    for (const chartId in this.chartOptions) {
      try {
        this.charts[chartId].updateOptions(this.chartOptions[chartId]);
      } catch (error) {
        console.error(`Chart ${chartId} failed to update`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }

  async init(): Promise<void> {
    await this.initCharts();
    await this.initData();
    this.isInit = true;
  }

  async initCharts(): Promise<void> {
    for (const chartId in this.chartBaseOptions) {
      try {
        this.charts[chartId] = await renderChart(
          chartId,
          this.chartBaseOptions[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }

  abstract initData(): Promise<void>;

  onHide(): void {
    for (const chartId in this.charts) {
      if (this.charts[chartId]) {
        this.charts[chartId].updateSeries([]);
      }
    }
  }

  public destroyCharts(): void {
    for (const chartId in this.charts) {
      const chart = this.charts[chartId];
      if (chart) {
        try {
          chart.destroy();
        } catch (error) {
          console.error(`Chart ${chartId} failed to destroy`, error);
          toaster.error(i18next.t("toast.chartError"));
        }
      }
    }
    this.charts = {};
  }
}
