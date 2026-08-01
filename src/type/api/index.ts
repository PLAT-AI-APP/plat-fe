export type ApiErrorCode = string;

export interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
  fields?: Record<string, string>;
}

// 성공 응답은 신규 DTO 직접 응답과 기존 MSW 봉투 응답을 함께 허용합니다.
export type ApiSuccessResponse<T = void> = T | { data: T; result?: "OK" };

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
