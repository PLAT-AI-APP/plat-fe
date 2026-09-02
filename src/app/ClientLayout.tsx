"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { useWalletBalanceQuery } from "@/api/wallet/getWalletBalance";
import { ModalManager } from "@/components/modal/ModalManager";
import ModalNavigationGuard from "@/components/modal/ModalNavigationGuard";
import DialogManager from "@/components/dialog/DialogManager";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import { isAuthExpiredError } from "@/api";
import {
  LOGOUT_REDIRECT_IN_PROGRESS_KEY,
  PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
  PENDING_WELCOME_CREDIT_DIALOG_KEY,
  SKIP_AUTH_ALERT_ONCE_KEY,
  isProtectedPath,
} from "@/constants/auth";
import { TRANSITION } from "@/constants/motion";
import { SIDEBAR_WIDTH, TABLET_MAX_WIDTH_QUERY } from "@/constants/layout";

// 사이드바 없이 전용 화면을 쓰는 경로
const HIDE_SIDEBAR_PATHS: string[] = [];

// 헤더 없이 전용 상단 UI를 쓰는 경로
const HIDE_HEADER_PATHS = ["/chatting-room"];

/** 사이드바 바깥 화면 오버레이 전환 */
const sidebarOverlayMotion = {
  initial: { opacity: 0, backdropFilter: "blur(0px)" },
  animate: { opacity: 1, backdropFilter: "blur(6px)" },
  exit: { opacity: 0, backdropFilter: "blur(0px)" },
};

/** 사이드바 펼침 속도에 맞춘 오버레이 전환 */
const sidebarOverlayTransition = TRANSITION;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useMyInfoQuery();
  useWalletBalanceQuery();

  // 현재 경로가 사이드바 숨김 대상인지 확인
  const isSidebarHidden = HIDE_SIDEBAR_PATHS.some((path) =>
    pathname?.startsWith(path),
  );
  // 현재 경로가 헤더 숨김 대상인지 확인
  const isHeaderHidden = HIDE_HEADER_PATHS.some((path) =>
    pathname?.startsWith(path),
  );
  const currentMainTab = searchParams.get("tab") ?? "all";
  const isHomePath = pathname === "/";
  const isCategoryHomePath = isHomePath && currentMainTab === "categories";
  const isChattingRoomPath = pathname?.startsWith("/chatting-room");
  // 태블릿 폭에서는 콘텐츠 영역을 확보하기 위해 모든 화면에서 접힘 + 블러 사이드바를 씁니다.
  const isTablet = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  const shouldUseFocusSidebar =
    isCategoryHomePath || isChattingRoomPath || isTablet;

  // 복잡도가 높은 화면 또는 태블릿 폭에서만 접힘 + 블러 사이드바를 사용합니다.
  const shouldFoldSidebar = useMemo(
    () => shouldUseFocusSidebar,
    [shouldUseFocusSidebar],
  );

  // 기본 화면은 펼친 상태, 포커스 화면은 접힌 상태로 시작합니다.
  const [isFolded, setIsFolded] = useState(() => shouldFoldSidebar);

  // 경로, 홈 탭, 뷰포트 폭이 바뀌면 화면 정책에 맞춰 접힘 상태를 재계산합니다.
  useEffect(() => {
    setIsFolded(shouldFoldSidebar);
  }, [pathname, shouldFoldSidebar]);

  // 한 번의 비교로 경로와 쿼리스트링 변경 모두 감지
  const handleFoldToggle = () => setIsFolded((prev) => !prev);
  const { isScrolling, onScroll } = useScrollTimeout();

  const {
    accessToken,
    isLoggedIn,
    logout,
    setAccessToken,
    setAuthReady,
    setLoggedIn,
  } = useAuthStore();
  const router = useRouter();
  const clearModals = useModalStore((state) => state.clearModals);
  const openModal = useModalStore((state) => state.openModal);
  const openDialog = useDialogStore((state) => state.openDialog);
  const isProtectedRoute = isProtectedPath(pathname);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const openLoginRequiredDialog = useCallback(() => {
    // 보호 경로 안내도 전역 Dialog로 통일해 브라우저 alert와 모달 스택이 섞이지 않게 합니다.
    openDialog("LOGIN_REQUIRED", {
      label: "dialog.loginRequired.title",
      description: "dialog.loginRequired.description",
      confirmText: "dialog.loginRequired.confirm",
      onConfirm: () => {
        openModal("LOGIN", { triggerRef: undefined });
      },
    });
  }, [openDialog, openModal]);

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!hasHydrated) return;

      if (!isLoggedIn) {
        if (isMounted) {
          setAuthReady(true);
          setIsAuthChecking(false);
        }
        return;
      }

      if (accessToken) {
        if (isMounted) {
          setAuthReady(true);
          setIsAuthChecking(false);
        }
        return;
      }

      try {
        const refreshedAccessToken = await refreshAccessToken();
        if (!isMounted) return;

        if (refreshedAccessToken) {
          setAccessToken(refreshedAccessToken);
          setLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        if (isMounted) {
          if (isAuthExpiredError(error)) {
            logout();
          }
        }
      } finally {
        if (isMounted) {
          setAuthReady(true);
          setIsAuthChecking(false);
        }
      }
    };

    setAuthReady(false);
    setIsAuthChecking(true);
    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    hasHydrated,
    isLoggedIn,
    logout,
    setAccessToken,
    setAuthReady,
    setLoggedIn,
  ]);

  useEffect(() => {
    // 인증(로그인)이 꼭 필요한 보호 경로 목록 정의
    const protectedRoutes = [
      "/my-chatting",
      "/chatting-room",
      "/character-creat",
      "/studio",
      "/usage-history",
      "/token-charge",
      "/withdrawal",
      "/profile",
    ];

    // 현재 접속한 pathname이 보호 경로 중 하나로 시작하는지 검사
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // 보호된 경로인데 토큰이 없다면 홈으로 튕겨내기
    if (isAuthChecking) return;

    if (isProtectedRoute && !isLoggedIn) {
      const shouldSkipAuthAlert =
        sessionStorage.getItem(SKIP_AUTH_ALERT_ONCE_KEY) === "true";

      if (shouldSkipAuthAlert) {
        sessionStorage.removeItem(SKIP_AUTH_ALERT_ONCE_KEY);
        clearModals();
        router.replace("/");
        return;
      }

      clearModals();
      openLoginRequiredDialog();
      router.replace("/");
    }
  }, [
    clearModals,
    isAuthChecking,
    isLoggedIn,
    openLoginRequiredDialog,
    pathname,
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
      if (!isProtectedPath(url.pathname)) return;
      if (isLoggedIn) return;

      event.preventDefault();
      event.stopPropagation();
      if (isAuthChecking) return;

      openLoginRequiredDialog();
    };

    document.addEventListener("click", handleProtectedLinkClick, true);

    return () => {
      document.removeEventListener("click", handleProtectedLinkClick, true);
    };
  }, [isAuthChecking, isLoggedIn, openLoginRequiredDialog]);

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    const isLogoutRedirecting =
      sessionStorage.getItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY) === "true";

    if (isLogoutRedirecting) {
      sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);
      sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
      return;
    }

    const pendingSignupCompleteDialog = sessionStorage.getItem(
      PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
    );

    if (pendingSignupCompleteDialog) {
      sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);

      const parsedDialogData = JSON.parse(pendingSignupCompleteDialog) as {
        nickname?: string;
      };

      // 회원가입 페이지에서 홈으로 이동한 뒤 완료 Dialog를 열어 라우팅과 레이어 순서를 분리합니다.
      openDialog("SIGNUP_COMPLETE", {
        nickname: parsedDialogData.nickname || "",
        onLogin: () => {
          openModal("LOGIN", { triggerRef: undefined });
        },
      });
      return;
    }

    const shouldOpenWelcomeDialog =
      sessionStorage.getItem(PENDING_WELCOME_CREDIT_DIALOG_KEY) === "true";

    if (!shouldOpenWelcomeDialog) return;

    // 홈에 진입한 뒤 한 번만 소비해 로그인 모달이 닫힌 다음 환영 다이얼로그가 뜨도록 맞춥니다.
    sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
    openDialog("WELCOME_CREDIT", {});
  }, [openDialog, openModal, pathname]);

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    sessionStorage.removeItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY);
  }, [pathname]);

  if (isProtectedRoute && (isAuthChecking || !isLoggedIn)) {
    return null;
  }

  return (
    <>
      {!isHeaderHidden && <Header handleFoldToggle={handleFoldToggle} />}
      <main
        id="main-container"
        className={cn(
          "flex flex-row overflow-hidden",
          isHeaderHidden ? "h-screen" : "h-[calc(100vh-var(--header-height))]",
        )}
      >
        {!isSidebarHidden && (
          <Sidebar
            isFolded={isFolded}
            onFoldToggle={isHeaderHidden ? handleFoldToggle : undefined}
          />
        )}

        <div
          id="page-content"
          onScroll={onScroll}
          className={cn(
            "relative flex-1 overflow-x-hidden scroll-smooth",
            "min-h-0 w-full mx-auto",
            isHeaderHidden ? "overflow-hidden" : "overflow-y-auto",
            isScrolling && "is-scrolling",
            // 홈 배너와 채팅방은 화면 끝까지 붙는 풀블리드 레이아웃이라 공통 여백에서 제외합니다.
            !isHomePath && !isChattingRoomPath && "content-x",
          )}
        >
          <AnimatePresence>
            {/* 사이드바 펼침 시 사이드바를 제외한 화면만 흐리게 처리 */}
            {!isSidebarHidden && !isFolded && shouldUseFocusSidebar && (
              <motion.div
                role="button"
                tabIndex={0}
                {...sidebarOverlayMotion}
                transition={sidebarOverlayTransition}
                style={{
                  // 오버레이는 사이드바가 펼쳐진 상태에서만 뜨므로 펼침 폭 기준으로 시작 위치를 잡습니다.
                  left: SIDEBAR_WIDTH.expanded,
                  top: isHeaderHidden ? 0 : 60,
                }}
                className="fixed bottom-0 right-0 z-20 bg-scrim/50"
                aria-label="사이드바 접기"
                onClick={handleFoldToggle}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleFoldToggle();
                  }
                }}
              />
            )}
          </AnimatePresence>
          {children}
          <ModalManager />
          <DialogManager />
          <ModalNavigationGuard />
        </div>
      </main>
    </>
  );
}
