// Mirrors backend ApiResponse
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Mirrors backend ApiError
export interface ApiErrorBody {
  statusCode?: number;
  message?: string;
  errors?: unknown[];
  success?: false;
}
