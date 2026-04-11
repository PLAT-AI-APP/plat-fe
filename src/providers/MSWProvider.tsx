"use client";

import { useEffect, useState } from "react";

export default function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    // 1. 이미 준비되었거나 개발 환경이 아니면 종료
    if (mswReady || process.env.NODE_ENV !== "development") {
      setMswReady(true);
      return;
    }

    const initMsw = async () => {
      try {
        const { worker } = await import("@/mocks/browser");

        await worker.start({
          onUnhandledRequest: "bypass",
          serviceWorker: {
            // Next.js public 폴더 내의 서비스 워커 파일 경로를 명시적으로 지정
            url: "/mockServiceWorker.js",
          },
        });

        setMswReady(true);
      } catch (error) {
        console.error("[MSW] 초기화 실패:", error);
        // 실패하더라도 앱은 돌아가야 하므로 true로 설정
        setMswReady(true);
      }
    };

    initMsw();
  }, [mswReady]);

  // 서버 사이드에서는 아무것도 렌더링하지 않음 (Hydration 에러 방지)
  if (typeof window === "undefined") return null;

  // 개발 환경에서 MSW 준비 전까지 로딩 처리 (준비 안 되면 null 반환으로 렌더링 지연)
  if (!mswReady && process.env.NODE_ENV === "development") {
    return null;
  }

  return <>{children}</>;
}
