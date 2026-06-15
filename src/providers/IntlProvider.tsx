"use client";

import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import dayjs from "@/lib/dayjs";
import { CHARACTER_CREATE_MESSAGES_BY_LOCALE } from "@/i18n/characterCreateMessages";
import { DAYJS_LOCALE_BY_APP_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { RUNTIME_MESSAGES_BY_LOCALE } from "@/i18n/runtimeMessages";
import { STUDIO_MESSAGES_BY_LOCALE } from "@/i18n/studioMessages";
import { UI_MESSAGES_BY_LOCALE } from "@/i18n/uiMessages";
import { useLocaleStore } from "@/store/useLocaleStore";

const mergeMessages = (
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
) => {
  const merged = { ...base };

  Object.entries(extra).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      // 번역 파일을 여러 소스에서 합칠 때는 같은 namespace를 재귀적으로 병합해
      // 기존 메시지를 덮어쓰지 않고 필요한 키만 확장합니다.
      merged[key] = mergeMessages(
        merged[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      return;
    }

    merged[key] = value;
  });

  return merged;
};

const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocaleStore((state) => state.locale);
  const messages = mergeMessages(
    mergeMessages(
      mergeMessages(
        mergeMessages(
          getMessages(locale) as Record<string, unknown>,
          RUNTIME_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
        ),
        UI_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
      ),
      STUDIO_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
    ),
    CHARACTER_CREATE_MESSAGES_BY_LOCALE[locale] as Record<string, unknown>,
  );

  useEffect(() => {
    // 선택한 언어가 날짜 포맷과 문서 언어에도 반영되도록 전역 환경을 함께 맞춥니다.
    document.documentElement.lang = locale;
    dayjs.locale(DAYJS_LOCALE_BY_APP_LOCALE[locale]);
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default IntlProvider;
