import type { AppLocale } from "@/i18n/config";

/** 해시태그 관련 캐시 키의 단일 출처. */
export const hashtagQueryKeys = {
  /** 언어에 따라 응답이 달라지므로 언어별로 캐시를 나눈다. */
  list: (locale: AppLocale) => ["get-hashtag-list", locale] as const,
};
