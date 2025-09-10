import { renderChart } from "../../charts/chartUtils.js";
import { viewLogger } from "../../logging/config.js";
import { toaster } from "../../Toaster.js";

export abstract class AbstractTab {
  protected charts: Record<string, ApexCharts> = {};
  protected chartBaseOptions: Record<string, ApexCharts.ApexOptions> = {};
  protected chartOptions: Record<string, ApexCharts.ApexOptions> = {};
  protected isInit: boolean = false;

  abstract getHTML(): string;

  async onShow(): Promise<void> {
    await this.initCharts();

    if (!this.isInit) {
      await this.init();
    }

    for (const chartId in this.chartOptions) {
      try {
        this.charts[chartId].updateOptions(this.chartOptions[chartId]);
      } catch (error) {
        viewLogger.error(`Chart ${chartId} failed to update`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }

  async init(): Promise<void> {
    await this.initData();
    this.isInit = true;
  }

  async initCharts(): Promise<void> {
    const chartPromises = Object.entries(this.chartBaseOptions).map(
      async ([chartId, options]) => {
        if (!this.charts[chartId]) {
          try {
            this.charts[chartId] = await renderChart(chartId, options);
          } catch (error) {
            viewLogger.error(`Chart ${chartId} failed to initialize`, error);
            toaster.error(i18next.t("toast.chartError"));
          }
        }
      }
    );

    await Promise.all(chartPromises);
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
          viewLogger.error(`Chart ${chartId} failed to destroy`, error);
          toaster.error(i18next.t("toast.chartError"));
        }
      }
    }
    this.charts = {};
  }
}
