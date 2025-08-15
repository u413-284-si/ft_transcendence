import { AbstractTab } from "./AbstractTab.js";
import { Paginator } from "../../Paginator.js";
import { FetchPageResult } from "../../types/FetchPageResult.js";
import { toaster } from "../../Toaster.js";

export abstract class PaginatedTab<T> extends AbstractTab {
  protected paginator: Paginator<T>;
  private prevBtnId: string;
  private nextBtnId: string;
  private indicatorId: string;

  constructor(
    pageSize: number,
    prevBtnId: string,
    nextBtnId: string,
    indicatorId: string
  ) {
    super();
    this.paginator = new Paginator<T>(pageSize);
    this.prevBtnId = prevBtnId;
    this.nextBtnId = nextBtnId;
    this.indicatorId = indicatorId;
  }

  protected abstract updateTable(items: T[]): void;
  protected abstract fetchPage(
    limit: number,
    offset: number
  ): Promise<FetchPageResult<T>>;

  protected updatePaginationControls() {
    const prevBtn = document.querySelector<HTMLButtonElement>(
      `#${this.prevBtnId}`
    );
    const nextBtn = document.querySelector<HTMLButtonElement>(
      `#${this.nextBtnId}`
    );
    const pageIndicator = document.querySelector<HTMLSpanElement>(
      `#${this.indicatorId}`
    );
    if (!prevBtn || !nextBtn || !pageIndicator) return;

    prevBtn.disabled = !this.paginator.canGoPrev();
    nextBtn.disabled = !this.paginator.canGoNext();

    const currentPage = this.paginator.getCurrentPage() + 1;
    const totalPages = this.paginator.getTotalPages();
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
  }

  protected async loadPage(page: number) {
    const cached = this.paginator.getCachedPage(page);
    if (cached) {
      this.updateTable(cached);
      this.updatePaginationControls();
      return;
    }

    const limit = this.paginator.getPageSize();
    const offset = page * limit;

    try {
      const { total, items } = await this.fetchPage(limit, offset);
      this.paginator.setTotalItems(total);
      this.paginator.cachePage(page, items);
      this.updateTable(items);
      this.updatePaginationControls();
    } catch (err) {
      console.error("Failed to load page:", err);
      toaster.error("Failed to fetch data");
    }
  }

  protected addPaginationListeners() {
    const prevBtn = document.querySelector<HTMLButtonElement>(
      `#${this.prevBtnId}`
    );
    const nextBtn = document.querySelector<HTMLButtonElement>(
      `#${this.nextBtnId}`
    );
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener("click", async () => {
      if (this.paginator.canGoPrev()) {
        this.paginator.goPrev();
        await this.loadPage(this.paginator.getCurrentPage());
      }
    });

    nextBtn.addEventListener("click", async () => {
      if (this.paginator.canGoNext()) {
        this.paginator.goNext();
        await this.loadPage(this.paginator.getCurrentPage());
      }
    });
  }

  override async onShow(): Promise<void> {
    await super.onShow();
    await this.loadPage(this.paginator.getCurrentPage());
    this.addPaginationListeners();
  }
}
