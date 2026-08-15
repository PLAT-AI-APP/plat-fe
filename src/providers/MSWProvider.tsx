"use client";

import { useEffect, useState } from "react";

// .env의 NEXT_PUBLIC_API_MOCKING 하나로 목업을 켜고 끕니다.
// 표기 차이로 목업이 안 켜졌다고 오해하지 않도록 자주 쓰는 값들을 함께 허용합니다.
const MOCKING_ENABLED_VALUES = ["enabled", "true", "1", "on"];

export const isMockingEnabled = MOCKING_ENABLED_VALUES.includes(
  (process.env.NEXT_PUBLIC_API_MOCKING ?? "").trim().toLowerCase(),
);

let workerReadyPromise: Promise<void> | null = null;

/**
 * 목업을 끈 뒤에도 이전에 등록된 서비스 워커가 남아 요청을 계속 가로챕니다.
 * 이 상태에서는 RSC 프리페치 같은 Next 내부 요청까지 ERR_FAILED로 끊기므로 등록을 정리합니다.
 */
const unregisterStaleWorker = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  const staleRegistrations = registrations.filter((registration) =>
    registration.active?.scriptURL.includes("mockServiceWorker.js"),
  );

  if (staleRegistrations.length === 0) return;

  await Promise.all(
    staleRegistrations.map((registration) => registration.unregister()),
  );

  // 이미 워커가 제어 중인 문서는 새로고침해야 정상 요청으로 돌아옵니다.
  if (navigator.serviceWorker.controller) {
    console.warn(
      "[MSW] 남아 있던 목업 서비스 워커를 해제했습니다. 새로고침하면 정상 동작합니다.",
    );
  }
};

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
    if (!isMockingEnabled) {
      unregisterStaleWorker().catch((error) => {
        console.error("[MSW] failed to unregister worker:", error);
      });
      return;
    }

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
