import type { AppLocale } from "@/i18n/config";
import type { Tendency } from "@/store/useTendencyStore";

interface CategorySearchKeyParams {
  locale: AppLocale;
  authenticated: boolean;
  /** 성인 콘텐츠가 섞이는지(useAdultMode). */
  adultMode: boolean;
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
    adultMode,
    q,
    page,
    size,
  }: {
    locale: AppLocale;
    authenticated: boolean;
    adultMode: boolean;
    q: string;
    page?: number;
    size?: number;
  }) => ["get-search", locale, authenticated, adultMode, q, page, size] as const,
  popularTerms: (size: number, adultMode: boolean) =>
    ["get-popular-search-terms", size, adultMode] as const,
  category: ({
    locale,
    authenticated,
    adultMode,
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
      adultMode,
      tendency,
      // 고른 순서가 달라도 같은 결과라 정렬해서 키를 맞춥니다.
      [...tagIds].sort().join(","),
      sort,
      page,
      size,
    ] as const,
};
