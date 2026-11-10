export interface ApiErrorDetail {
  field: string;
  reason: string;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: ApiErrorDetail[];
  };
}
