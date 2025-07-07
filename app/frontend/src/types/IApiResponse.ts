export type ApiResponse<T> = ApiSuccess<T> | ApiFail;

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFail = {
  success: false;
  message: string;
  status: number;
  cause?: string;
};
