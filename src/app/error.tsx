"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations("errorPage");

  useEffect(() => {
    // 렌더 트리 전체가 백지화되는 대신 원인을 남겨 추적할 수 있게 합니다.
    console.error(error);
  }, [error]);

  return (
    <section
      id="error-container"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center"
    >
      <h2 className="heading-2 text-font-1">{t("title")}</h2>
      <p className="body-3 text-font-2">{t("description")}</p>

      {/* digest 는 서버가 이 렌더 실패에 붙인 식별자다. 문의가 들어왔을 때 로그와 대조할 유일한 실마리라 화면에 남긴다. */}
      {error.digest && (
        <code className="body-6 text-font-disabled">{error.digest}</code>
      )}

      <button
        type="button"
        onClick={reset}
        className="title-5 mt-4 rounded-lg bg-brand px-6 py-3 text-on-brand transition hover:brightness-110"
      >
        {t("retry")}
      </button>
    </section>
  );
};

export default ErrorPage;
