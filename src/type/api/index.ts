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

/** 백엔드 SliceWith.page — 전체 개수를 세지 않는 목록의 페이지 정보 */
export interface SliceInfo {
  number: number;
  size: number;
  numberOfElements: number;
  hasNext: boolean;
}

/** 백엔드 PageWith.page — 전체 개수를 아는 목록의 페이지 정보 */
export interface PageInfo extends SliceInfo {
  totalElements: number;
  totalPages: number;
}

/** 백엔드 SliceWith<T> 응답. condition은 서버가 판단 근거를 실을 때만 내려옵니다. */
export interface SliceWith<T, C = unknown> {
  condition?: C;
  page: SliceInfo;
  content: T[];
}

/** 백엔드 PageWith<T> 응답 */
export interface PageWith<T, C = unknown> {
  condition?: C;
  page: PageInfo;
  content: T[];
}
