export abstract class AbstractTab {
  protected charts: Record<string, ApexCharts> = {};
  protected chartOptions: Record<string, ApexCharts.ApexOptions> = {};

  abstract getHTML(): string;

  abstract onShow(): void | Promise<void>;

  onHide(): void {
    for (const chartId in this.charts) {
      if (this.charts[chartId]) {
        this.charts[chartId].destroy();
        delete this.charts[chartId];
      }
    }
  }
}
