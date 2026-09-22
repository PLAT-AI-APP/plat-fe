"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SKIP_AUTH_ALERT_ONCE_KEY,
  isProtectedPath,
} from "@/constants/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

const ProtectedNavigationInterceptor = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const clearModals = useModalStore((state) => state.clearModals);
  const openModal = useModalStore((state) => state.openModal);

  const requestLogin = useCallback(() => {
    openModal("LOGIN", { triggerRef: undefined });
  }, [openModal]);

  useEffect(() => {
    if (!isAuthReady || isLoggedIn) return;
    // 보호 경로인지는 usePathname 이 아니라 브라우저의 실제 주소로 판단한다(pathname 은 다시 확인할 시점을 알리는 용도).
    // 뒤로가기 직후에는 주소가 먼저 바뀌고 usePathname 은 새 화면을 그린 뒤에야 바뀐다. 그 사이 세션이 만료되면
    // api 인터셉터(handleSessionExpired)는 새 주소를 보고 "세션 만료" 안내를, 여기서는 이전 보호 경로를 보고
    // 로그인 창을 각각 띄워 둘이 겹쳤다. 두 쪽이 같은 기준(window.location)을 쓰면 한쪽만 반응한다.
    if (!isProtectedPath(pathname) || !isProtectedPath(window.location.pathname)) {
      return;
    }

    const shouldSkipAuthAlert =
      sessionStorage.getItem(SKIP_AUTH_ALERT_ONCE_KEY) === "true";

    clearModals();

    if (shouldSkipAuthAlert) {
      sessionStorage.removeItem(SKIP_AUTH_ALERT_ONCE_KEY);
      router.replace("/");
      return;
    }

    requestLogin();
  }, [
    clearModals,
    isAuthReady,
    isLoggedIn,
    pathname,
    requestLogin,
    router,
  ]);

  useEffect(() => {
    const handleProtectedLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      if (!isProtectedPath(url.pathname) || isLoggedIn) return;

      event.preventDefault();
      event.stopPropagation();
      if (!isAuthReady) return;

      requestLogin();
    };

    document.addEventListener("click", handleProtectedLinkClick, true);
    return () => {
      document.removeEventListener("click", handleProtectedLinkClick, true);
    };
  }, [isAuthReady, isLoggedIn, requestLogin]);

  return null;
};

export default ProtectedNavigationInterceptor;
