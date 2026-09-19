import type { AppLocale } from "@/i18n/config";
import type { Tendency } from "@/store/useTendencyStore";

interface CategorySearchKeyParams {
  locale: AppLocale;
  authenticated: boolean;
  tendency: Tendency;
  tagIds: readonly string[];
  sort?: string;
  page?: number;
  size?: number;
}

/** 검색 관련 캐시 키의 단일 출처. */
export const searchQueryKeys = {
  results: ({
    locale,
    authenticated,
    q,
    page,
    size,
  }: {
    locale: AppLocale;
    authenticated: boolean;
    q: string;
    page?: number;
    size?: number;
  }) => ["get-search", locale, authenticated, q, page, size] as const,
  popularTerms: (size: number) => ["get-popular-search-terms", size] as const,
  category: ({
    locale,
    authenticated,
    tendency,
    tagIds,
    sort,
    page,
    size,
  }: CategorySearchKeyParams) =>
    [
      "get-category-search",
      locale,
      authenticated,
      tendency,
      // 고른 순서가 달라도 같은 결과라 정렬해서 키를 맞춥니다.
      [...tagIds].sort().join(","),
      sort,
      page,
      size,
    ] as const,
};
