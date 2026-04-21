export interface ApiErrorResponse {
  result: "ERROR";
  code?: "MESSAGE" | "ALERT" | "FIELD_ERROR";
  message?: string;
  data?: {
    fields?: Record<string, string>;
  };
}

// 성공 응답
export interface ApiSuccessResponse<T = void> {
  result: "OK";
  message?: string;
  data: T;
}

export interface AppError<T = Record<string, string>> {
  code: "MESSAGE" | "ALERT" | "FIELD_ERROR";
  fields?: Partial<Record<keyof T, string>>; // T의 키값들만 허용
  message: string;
}
