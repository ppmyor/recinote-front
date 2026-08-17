import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "./client";

interface ApiSuccessEnvelope<T> {
  success: true;
  code: number;
  data: T;
}

interface ApiErrorEnvelope {
  statusCode: number;
  error: string;
  errorCode: string;
  message: string;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getApiErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<ApiSuccessEnvelope<T>>(config);
    return response.data.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorEnvelope>;
    throw new ApiError(
      axiosError.response?.data?.message ?? "요청 처리 중 오류가 발생했습니다.",
      axiosError.response?.status,
    );
  }
}
