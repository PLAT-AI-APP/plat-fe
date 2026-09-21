"use client";

import { useEffect } from "react";
import type { AppLocale } from "@/i18n/config";
import en from "@/i18n/locales/runtime/en";
import ja from "@/i18n/locales/runtime/ja";
import ko from "@/i18n/locales/runtime/ko";
import th from "@/i18n/locales/runtime/th";
import vi from "@/i18n/locales/runtime/vi";
import zh from "@/i18n/locales/runtime/zh";
import { useLocaleStore } from "@/store/useLocaleStore";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 루트 레이아웃 자체가 깨졌을 때의 최후 방어선.
 *
 * 이 경계는 자기 <html>/<body>를 직접 그린다 — 레이아웃이 실패한 상황이라
 * 앱의 Provider나 전역 CSS에 기댈 수 없다. 그래서 스타일도 인라인으로 둔다.
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
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "24px",
          textAlign: "center",
          background: "#11141f",
          color: "#ecedf5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
          {messages.title}
        </h1>
        <p style={{ color: "#989db8", margin: 0 }}>{messages.description}</p>
        {error.digest && (
          <code style={{ color: "#5c6180", fontSize: "12px" }}>
            {error.digest}
          </code>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            background: "#ff7a00",
            color: "#0d0e11",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {messages.retry}
        </button>
      </body>
    </html>
  );
};

export default GlobalError;
