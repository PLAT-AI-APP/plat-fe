import type { AppLocale } from "@/i18n/config";
import type { Tendency } from "@/store/useTendencyStore";

/** 언어·성향·페이지로 캐시가 갈리는 홈 섹션이 공유하는 인자. */
interface HomeListKeyParams {
  locale: AppLocale;
  tendency: Tendency;
  page?: number;
  size?: number;
}

/**
 * 홈 화면 캐시 키의 단일 출처.
 *
 * 응답을 바꾸는 값(언어·성향·로그인 여부)이 키에서 빠지면 서로 다른 응답이 한 캐시에 섞인다.
 * 그 값들을 훅마다 손으로 나열하지 않도록 여기서 순서까지 정한다.
 */
export const homeQueryKeys = {
  banners: (locale: AppLocale) => ["get-home-banners", locale] as const,
  todayPick: ({ locale, tendency, page, size }: HomeListKeyParams) =>
    ["get-today-pick", locale, tendency, page, size] as const,
  popularTag: ({ locale, tendency, page, size }: HomeListKeyParams) =>
    ["get-popular-tag", locale, tendency, page, size] as const,
  newWork: ({ locale, tendency, page, size }: HomeListKeyParams) =>
    ["get-new-work", locale, tendency, page, size] as const,
  assetPreview: (locale: AppLocale, tendency: Tendency) =>
    ["get-asset-preview", locale, tendency] as const,
  /** 찜 여부가 실려 오므로 로그인 여부로도 캐시를 나눈다. */
  allCharacters: ({
    locale,
    authenticated,
    tendency,
    page,
    size,
  }: HomeListKeyParams & { authenticated: boolean }) =>
    ["get-all-characters", locale, authenticated, tendency, page, size] as const,
  officialPreview: ({
    locale,
    tendency,
    sort,
    page,
    size,
  }: HomeListKeyParams & { sort?: string }) =>
    ["get-official-preview", locale, tendency, sort, page, size] as const,
  userRecommend: ({ locale, tendency, page, size }: HomeListKeyParams) =>
    ["get-user-recommend", locale, tendency, page, size] as const,
};
