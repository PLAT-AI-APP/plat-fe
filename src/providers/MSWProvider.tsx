"use client";

import { useEffect, useState } from "react";

// .env의 NEXT_PUBLIC_API_MOCKING 하나로 목업을 켜고 끕니다.
// 표기 차이로 목업이 안 켜졌다고 오해하지 않도록 자주 쓰는 값들을 함께 허용합니다.
const MOCKING_ENABLED_VALUES = ["enabled", "true", "1", "on"];

export const isMockingEnabled = MOCKING_ENABLED_VALUES.includes(
  (process.env.NEXT_PUBLIC_API_MOCKING ?? "").trim().toLowerCase(),
);

let workerReadyPromise: Promise<void> | null = null;

const startWorker = async () => {
  if (!workerReadyPromise) {
    workerReadyPromise = import("@/mocks/browser").then(async ({ worker }) => {
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });
    });
  }

  return workerReadyPromise;
};

export default function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) return;

    console.info("[MSW] 목업이 활성화된 상태로 실행됩니다.");

    startWorker()
      .catch((error) => {
        console.error("[MSW] failed to start worker:", error);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
