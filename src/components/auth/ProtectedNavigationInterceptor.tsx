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
    if (!isAuthReady || !isProtectedPath(pathname) || isLoggedIn) return;

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
