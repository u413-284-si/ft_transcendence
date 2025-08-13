export type FetchPageResult<T> = {
  total: number;
  items: T[];
};

export type FetchPageFn<T> = (
  page: number,
  pageSize: number
) => Promise<FetchPageResult<T>>;
