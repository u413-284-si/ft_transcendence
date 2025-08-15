export class Paginator<T> {
  private pageSize: number;
  private currentPage: number = 0;
  private totalItems: number = 0;
  private cache: Map<number, T[]> = new Map();

  constructor(pageSize: number = 10) {
    this.pageSize = pageSize;
  }

  setTotalItems(total: number) {
    this.totalItems = total;
  }

  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getCachedPage(page: number): T[] | undefined {
    return this.cache.get(page);
  }

  cachePage(page: number, data: T[]) {
    this.cache.set(page, data);
  }

  canGoNext(): boolean {
    return this.currentPage < this.getTotalPages() - 1;
  }

  canGoPrev(): boolean {
    return this.currentPage > 0;
  }

  goNext() {
    if (this.canGoNext()) this.currentPage++;
  }

  goPrev() {
    if (this.canGoPrev()) this.currentPage--;
  }

  setPage(page: number) {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
    }
  }
}
