export const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh", "th", "vi"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ko";

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
