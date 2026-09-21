"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import dayjs from "@/lib/dayjs";
import {
  type AppLocale,
  DAYJS_LOCALE_BY_APP_LOCALE,
  DEFAULT_LOCALE,
} from "@/i18n/config";
import {
  defaultMessages,
  getLoadedMessages,
  loadMessages,
} from "@/i18n/loadMessages";
import { useLocaleStore } from "@/store/useLocaleStore";

// 저장해 둔 언어가 기본 언어가 아니면, 화면을 그리기 전부터 번역을 받기 시작해
// 기본 언어가 보이는 시간을 줄인다.
if (typeof window !== "undefined") {
  loadMessages(useLocaleStore.getState().locale).catch(() => undefined);
}

const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocaleStore((state) => state.locale);
  // 고른 언어의 번역을 받는 동안에는 직전에 보이던 언어를 그대로 쓴다.
  // 첫 렌더는 서버와 같은 기본 언어로 시작해 하이드레이션 불일치도 생기지 않는다.
  const [readyLocale, setReadyLocale] = useState<AppLocale>(() =>
    getLoadedMessages(locale) ? locale : DEFAULT_LOCALE,
  );

  // 이미 받아 둔 언어로 바꾸면 기다릴 필요 없이 바로 넘어간다.
  if (readyLocale !== locale && getLoadedMessages(locale)) {
    setReadyLocale(locale);
  }

  useEffect(() => {
    if (getLoadedMessages(locale)) return;

    let isCurrent = true;
    loadMessages(locale)
      .then(() => {
        if (isCurrent) setReadyLocale(locale);
      })
      .catch((error) => {
        // 네트워크 문제로 못 받으면 지금 언어를 유지한다. 다음에 언어를 고르면 다시 시도한다.
        console.error("[i18n] 번역을 불러오지 못했습니다:", locale, error);
      });

    return () => {
      isCurrent = false;
    };
  }, [locale]);

  const messages = getLoadedMessages(readyLocale) ?? defaultMessages;

  useEffect(() => {
    // 화면에 보이는 언어가 날짜 포맷과 문서 언어에도 반영되도록 전역 환경을 함께 맞춥니다.
    document.documentElement.lang = readyLocale;
    dayjs.locale(DAYJS_LOCALE_BY_APP_LOCALE[readyLocale]);
  }, [readyLocale]);

  return (
    <NextIntlClientProvider locale={readyLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default IntlProvider;
