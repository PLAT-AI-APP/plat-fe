"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * 미디어 쿼리 일치 여부를 구독한다.
 *
 * subscribe / getSnapshot 은 반드시 렌더 사이에 identity 가 유지돼야 한다.
 * 예전에는 `subscribe(query)` 를 호출부에서 바로 넘겨 매 렌더마다 새 함수가
 * 만들어졌고, 그때마다 useSyncExternalStore 가 matchMedia 리스너를 떼었다
 * 다시 붙였다. ClientLayout 처럼 자주 리렌더되는 곳에서 두 번씩 쓰이므로
 * 리스너 재등록이 계속 일어났다.
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // 서버에는 뷰포트가 없다. false 로 고정하면 첫 페인트는 항상 "일치하지 않음"
  // 기준으로 그려지고, 하이드레이션 직후 실제 값으로 맞춰진다.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
