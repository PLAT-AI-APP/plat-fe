export const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh", "th", "vi"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ko";

/**
 * next-intl 의 기준 시간대. 날짜는 dayjs·Intl 로 직접 포맷해 next-intl 포맷터를 쓰지 않으므로 화면에는 영향이 없다.
 * 비워 두면 next-intl 이 렌더마다 ENVIRONMENT_FALLBACK 오류를 로그에 남겨서(서버와 브라우저 시간대가 다를 수 있다는 경고) 값을 고정한다.
 */
export const INTL_TIME_ZONE = "Asia/Seoul";

/** Intl·react-calendar 처럼 BCP 47 태그를 요구하는 API 에 넘길 값 */
export const INTL_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
  th: "th-TH",
  vi: "vi-VN",
};

export const DAYJS_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-cn",
  th: "th",
  vi: "vi",
};
