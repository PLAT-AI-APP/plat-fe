"use client";

import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import dayjs from "@/lib/dayjs";
import { buildMessages } from "@/i18n/buildMessages";
import { DAYJS_LOCALE_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocaleStore((state) => state.locale);
  // 병합 결과는 locale 이 같으면 항상 같다. buildMessages 가 로케일별로 한 번만
  // 계산하고 캐시하므로 여기서는 조회만 한다.
  const messages = buildMessages(locale);

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
