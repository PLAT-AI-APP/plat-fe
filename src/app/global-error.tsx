"use client";

import "@/app/globals.css";
import { useEffect } from "react";
import type { AppLocale } from "@/i18n/config";
import en from "@/i18n/locales/runtime/en";
import ja from "@/i18n/locales/runtime/ja";
import ko from "@/i18n/locales/runtime/ko";
import th from "@/i18n/locales/runtime/th";
import vi from "@/i18n/locales/runtime/vi";
import zh from "@/i18n/locales/runtime/zh";
import { useLocaleStore } from "@/store/useLocaleStore";
import Button from "@/components/ui/Button";
import StateScene from "@/components/state/StateScene";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 루트 레이아웃 자체가 깨졌을 때의 최후 방어선.
 *
 * 이 경계는 자기 <html>/<body>를 직접 그린다 — 레이아웃이 실패한 상황이라
 * 앱의 Provider 에 기댈 수 없다. 전역 CSS 는 여기서 직접 불러오고, 테마 Provider
 * 가 없으므로 앱 기본인 다크로 고정한다. CSS 마저 못 불러와도 읽히도록 바탕색과
 * 글자색은 인라인으로 한 번 더 둔다.
 *
 * IntlProvider 도 쓸 수 없으므로 번역은 메시지 객체를 직접 읽고, 언어는 스토어에서 가져온다.
 * 번역 청크를 받지 못해 깨진 경우에도 떠야 하므로, 여기서만은 6개 언어 문구를 직접 가져온다
 * (이 화면은 오류가 났을 때만 따로 받는 청크라 페이지 번들에는 실리지 않는다).
 */
const ERROR_PAGE_MESSAGES: Record<AppLocale, typeof en.errorPage> = {
  ko: ko.errorPage,
  en: en.errorPage,
  ja: ja.errorPage,
  zh: zh.errorPage,
  th: th.errorPage,
  vi: vi.errorPage,
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  const locale = useLocaleStore((state) => state.locale);
  const messages = ERROR_PAGE_MESSAGES[locale];

  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang={locale} className="dark">
      <body
        className="flex min-h-dvh items-center justify-center bg-dark"
        style={{ margin: 0, background: "#11141f", color: "#ecedf5" }}
      >
        <StateScene
          mood="dizzy"
          title={messages.title}
          description={messages.description}
          actions={
            <>
              <Button size="lg" fullWidth onClick={reset}>
                {messages.retry}
              </Button>
              {error.digest && (
                <code className="body-7 mt-2 text-font-disabled">
                  {error.digest}
                </code>
              )}
            </>
          }
        />
      </body>
    </html>
  );
};

export default GlobalError;
