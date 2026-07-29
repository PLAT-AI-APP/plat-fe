export type ApiErrorCode =
  | "MESSAGE"
  | "ALERT"
  | "FIELD_ERROR"
  | "message"
  | "alert"
  | "field_error";

export interface ApiErrorResponse {
  result: "ERROR";
  code?: ApiErrorCode;
  message?: string;
  data?: {
    fields?: Record<string, string>;
  };
}

// 성공 응답
export interface ApiSuccessResponse<T = void> {
  result: "OK";
  data: T;
}

/** 페이지네이션을 포함한 공통 응답 인터페이스 (없다면 정의) */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface AppError<T = Record<string, string>> {
  code: ApiErrorCode;
  fields?: Partial<Record<keyof T, string>>; // T의 키값들만 허용
  message: string;
}
