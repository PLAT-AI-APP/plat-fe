"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * 앱 안에서 넘어온 기록이 있으면 뒤로 가고, 새 탭·외부 링크로 바로 들어와 돌아갈 곳이 없으면 대체 경로로 보냅니다.
 *
 * next-navigation-guard 가 history.state 에 앱 안 이동 순번을 남긴다(첫 진입이 0). router.back() 만 쓰면
 * 첫 진입 화면에서 뒤로가기가 사이트를 벗어나거나 아무 일도 하지 않는다.
 */
export const useSafeBack = () => {
  const router = useRouter();

  return useCallback(
    (fallbackPath = "/") => {
      const stackIndex = (
        window.history.state as {
          __next_navigation_guard_stack_index?: number;
        } | null
      )?.__next_navigation_guard_stack_index;

      if (typeof stackIndex === "number" && stackIndex > 0) {
        router.back();
        return;
      }

      router.push(fallbackPath);
    },
    [router],
  );
};
