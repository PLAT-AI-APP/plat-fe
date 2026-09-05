"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 루트 레이아웃 자체가 깨졌을 때의 최후 방어선.
 *
 * 이 경계는 자기 <html>/<body>를 직접 그린다 — 레이아웃이 실패한 상황이라
 * 앱의 Provider나 전역 CSS에 기댈 수 없다. 그래서 스타일도 인라인으로 둔다.
 */
const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="ko">
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
          화면을 불러오지 못했습니다
        </h1>
        <p style={{ color: "#989db8", margin: 0 }}>
          잠시 후 다시 시도해 주세요.
        </p>
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
          다시 시도
        </button>
      </body>
    </html>
  );
};

export default GlobalError;
