"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UseUnsavedChangesFallbackGuardOptions {
  isDirty: boolean;
  /** 브라우저 뒤로가기를 자체적으로 막아냈을 때, 원래 가려던 경로와 함께 호출됩니다. */
  onBlockedByBack: (targetPath: string) => void;
}

/**
 * next-navigation-guard(v0.2.0)는 router.push로 가는 이동은 정상적으로 가로채지만,
 * <a> 클릭과 브라우저 뒤로가기(popstate)는 Next.js 16에서 이 라이브러리가 내부적으로
 * 참조하는 Next.js private API가 바뀌면서 전혀 감지하지 못한다(직접 재현 확인,
 * npm 최신 0.2.0도 동일). 이 훅은 그 두 경로만 보완한다.
 *
 * - 링크 클릭: 기본 이동을 막고 router.push로 대신 보낸다. 이렇게 하면 이미 정상
 *   동작하는 useNavigationGuard의 confirm 콜백이 그대로 잡아준다.
 * - 뒤로가기: popstate는 브라우저 URL이 이미 바뀐 뒤에야 발생해 미리 막을 수
 *   없다. 대신 이벤트가 발생하면 즉시 원래 있던 경로로 다시 push해 눈에 보이는
 *   URL을 원위치로 되돌리고, 사용자가 가려던 목적지는 onBlockedByBack으로 알려준다.
 *   "나가기"를 확정하면 leaveToBlockedTarget(path)로 그 목적지에 router.push한다.
 *   history.go(-1)/router.back()으로 "진짜 뒤로가기"를 재현하는 방식도 시도했지만,
 *   더미 history 엔트리 + 재진입 상황에서 실제 이동이 반영되지 않는 경우가 있어
 *   (원인 불명) 이미 안정적으로 동작하는 router.push 하나로 통일했다.
 */
export const useUnsavedChangesFallbackGuard = ({
  isDirty,
  onBlockedByBack,
}: UseUnsavedChangesFallbackGuardOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDirtyRef = useRef(isDirty);
  const onBlockedByBackRef = useRef(onBlockedByBack);
  // 현재 렌더링된 경로. popstate 시점엔 이미 URL이 바뀐 뒤라, 되돌아갈 "원래
  // 있던 경로"를 미리 별도로 추적해둬야 한다.
  const currentPathRef = useRef(pathname);
  useEffect(() => {
    isDirtyRef.current = isDirty;
    onBlockedByBackRef.current = onBlockedByBack;
    const search = searchParams.toString();
    currentPathRef.current = search ? `${pathname}?${search}` : pathname;
  }, [isDirty, onBlockedByBack, pathname, searchParams]);

  // leaveToBlockedTarget으로 실제 이탈을 실행하는 동안 스스로가 발생시킨 push까지
  // 다시 가로채는 걸 막는 플래그.
  const isLeavingRef = useRef(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isDirtyRef.current || isLeavingRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname + url.search ===
        window.location.pathname + window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      router.push(url.pathname + url.search);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  useEffect(() => {
    if (!isDirty) return;

    const handlePopState = () => {
      if (isLeavingRef.current || !isDirtyRef.current) return;

      const targetPath = window.location.pathname + window.location.search;

      // state를 null로 밀어 넣으면 Next.js App Router가 각 history 엔트리에 심어둔
      // 자체 상태(__NA, __PRIVATE_NEXTJS_INTERNALS_TREE 등)가 지워져 이후 라우팅이
      // 꼬인다. 원래 있던 state를 그대로 복제해 되돌린다.
      window.history.pushState(
        window.history.state,
        "",
        currentPathRef.current,
      );
      onBlockedByBackRef.current(targetPath);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  /** 다이얼로그에서 "나가기"를 확정했을 때, 뒤로가기로 가려던 목적지로 실제 이동한다. */
  const leaveToBlockedTarget = useCallback(
    (targetPath: string) => {
      isLeavingRef.current = true;
      router.push(targetPath);
    },
    [router],
  );

  return { leaveToBlockedTarget, isLeavingRef };
};
