export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ExtendedApiResponse<T> extends ApiResponse<T> {
  count: number;
}
