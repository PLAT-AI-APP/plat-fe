import type { AppLocale } from "@/i18n/config";

/** 해시태그 관련 캐시 키의 단일 출처. */
export const hashtagQueryKeys = {
  /** 언어에 따라 응답이 달라지므로 언어별로 캐시를 나눈다. */
  /**
   * 성인인증이 유효하면(useAdultAccess) 성인 태그가 함께 내려온다(19 토글과 무관). 응답이 달라지므로 함께 나눈다.
   * 둘러보기 화면은 19 토글이 꺼져 있으면 성인 태그를 직접 숨긴다.
   */
  list: (locale: AppLocale, adultAccess: boolean) =>
    ["get-hashtag-list", locale, adultAccess] as const,
};
