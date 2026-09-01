"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    // 렌더 트리 전체가 백지화되는 대신 원인을 남겨 추적할 수 있게 합니다.
    console.error(error);
  }, [error]);

  return (
    <section
      id="error-container"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dark px-6 py-20 text-center"
    >
      <h2 className="heading-2 text-font-1">
        일시적인 오류가 발생했습니다
      </h2>
      <p className="text-font-2">
        잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침 해주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="title-5 mt-4 rounded-lg bg-brand px-6 py-3 text-on-brand transition hover:brightness-110"
      >
        다시 시도
      </button>
    </section>
  );
};

export default ErrorPage;
