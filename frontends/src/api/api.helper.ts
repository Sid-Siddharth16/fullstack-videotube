import { isAxiosError } from "axios";
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_ERROR_MESSAGES,
  NETWORK_ERROR_STATUS,
} from "../constants/http.constant";
import type { ApiErrorBody } from "../types/api.types";

export class HttpError extends Error {
  readonly status: number;
  readonly errors: unknown[];

  constructor(status: number, message: string, errors: unknown[] = []) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}

// Plain-object form of HttpError, safe to keep in Redux actions
export interface SerializedHttpError {
  status: number;
  message: string;
  errors: unknown[];
}

const isSerializedHttpError = (error: unknown): error is SerializedHttpError =>
  Boolean(error) &&
  typeof error === "object" &&
  typeof (error as SerializedHttpError).status === "number" &&
  typeof (error as SerializedHttpError).message === "string" &&
  Array.isArray((error as SerializedHttpError).errors);

// Backend may reply with HTML (no JSON error middleware), so only trust a JSON message
const extractServerMessage = (data: unknown): string | undefined => {
  if (data && typeof data === "object" && "message" in data) {
    const { message } = data as ApiErrorBody;
    return typeof message === "string" && message.trim() ? message : undefined;
  }
  return undefined;
};

export const toHttpError = (error: unknown): HttpError => {
  if (error instanceof HttpError) return error;
  if (isSerializedHttpError(error)) return new HttpError(error.status, error.message, error.errors);

  if (isAxiosError(error)) {
    const status = error.response?.status ?? NETWORK_ERROR_STATUS;
    const body = error.response?.data as ApiErrorBody | undefined;
    const message =
      extractServerMessage(body) ?? HTTP_ERROR_MESSAGES[status] ?? DEFAULT_ERROR_MESSAGE;
    return new HttpError(status, message, body?.errors ?? []);
  }

  return new HttpError(NETWORK_ERROR_STATUS, error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE);
};

export const getErrorMessage = (error: unknown) => toHttpError(error).message;

export const serializeHttpError = (error: unknown): SerializedHttpError => {
  const { status, message, errors } = toHttpError(error);
  return { status, message, errors };
};
