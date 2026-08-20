export const SUPPORTED_LOCALES = [
  "ko",
  "en",
  "ja",
  "zh",
  "th",
  "vi",
] as const;

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

/** 서버 API가 요구하는 lang 파라미터 값 (KO/EN/JA/ZH/TH/VI) */
export const API_LANG_BY_APP_LOCALE: Record<AppLocale, string> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  zh: "ZH",
  th: "TH",
  vi: "VI",
};
