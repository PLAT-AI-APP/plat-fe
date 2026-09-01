export const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh", "th", "vi"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "ko";

export const DAYJS_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-cn",
  th: "th",
  vi: "vi",
};
