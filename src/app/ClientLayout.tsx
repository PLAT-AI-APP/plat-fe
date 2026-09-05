"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import {
  MOBILE_MAX_WIDTH_QUERY,
  TABLET_MAX_WIDTH_QUERY,
} from "@/constants/layout";
import { useLayoutStore } from "@/store/useLayoutStore";

// 사이드바 없이 전용 화면을 쓰는 경로
const HIDE_SIDEBAR_PATHS: string[] = [];

// 헤더 없이 전용 상단 UI를 쓰는 경로
const HIDE_HEADER_PATHS = ["/chatting-room"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations();

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
  const isHomePath = pathname === "/";
  const isChattingRoomPath = pathname?.startsWith("/chatting-room");

  /*
   * 사이드바는 메뉴라 중요도가 낮다. 그래서 상태는 useLayoutStore 하나뿐이고,
   * 라우트나 탭이 바뀐다고 앱이 그 값을 덮어쓰지 않는다 — 사용자가 편 것은 펴진 채로 남는다.
   *
   * 좁은 화면에서만 펼침이 오버레이 드로어가 되어 콘텐츠를 밀지 않는다.
   * 그때만 얇은 스크림을 깔고, 메인 콘텐츠에 블러는 걸지 않는다.
   */
  const isNarrow = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  // 모바일에서는 접힌 레일(70px)조차 두지 않는다. 여백까지 합치면 폭의 3분의 1을 메뉴가 먹는다.
  const isMobile = useMediaQuery(MOBILE_MAX_WIDTH_QUERY);
  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const setSidebarExpanded = useLayoutStore((state) => state.setSidebarExpanded);
  const isDrawerOpen = isNarrow && isSidebarExpanded;
  // 모바일에서 접힌 상태면 사이드바를 아예 렌더하지 않는다(드로어로 열 때만 등장).
  const isSidebarRendered = !isSidebarHidden && (!isMobile || isDrawerOpen);
  /*
   * 사이드바가 그리드 열을 차지하는 경우(=콘텐츠를 옆으로 미는 경우)만 2열로 둔다.
   * 드로어는 position: fixed 라 그리드 흐름에서 빠지므로, 그때도 2열을 유지하면
   * 콘텐츠가 사이드바 칸으로 들어가 폭이 0 이 된다.
   */
  const isSidebarInline = isSidebarRendered && !isMobile && !isDrawerOpen;
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);

  const handleFoldToggle = useCallback(() => toggleSidebar(), [toggleSidebar]);
  const closeDrawer = useCallback(
    () => setSidebarExpanded(false),
    [setSidebarExpanded],
  );

  // 드로어가 열린 채 넓은 화면으로 돌아가면 인라인 펼침으로 이어지므로 상태는 그대로 둔다.
  // 다만 드로어일 때는 Esc 로 닫을 수 있어야 한다.
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeDrawer();
      sidebarToggleRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, isDrawerOpen]);
  const { isScrolling, onScroll } = useScrollTimeout();

  /*
   * selector 없이 useAuthStore() 를 부르면 스토어 전체를 구독한다. 이 레이아웃은
   * 앱 껍데기(헤더·사이드바·모달·children)를 감싸므로, 토큰이 갱신될 때마다
   * 화면 전체가 다시 그려졌다. 필요한 조각만 따로 구독한다.
   */
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
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
      {!isHeaderHidden && (
        <Header
          handleFoldToggle={handleFoldToggle}
          foldToggleRef={sidebarToggleRef}
        />
      )}
      <main
        id="main-container"
        style={{
          // 사이드바가 차지하는 열 폭.
          // 모바일: 0(콘텐츠가 전체 폭을 쓴다) · 태블릿: 레일 폭 고정(펼쳐도 콘텐츠를 밀지 않음)
          // 데스크탑: 사용자가 정한 접힘/펼침 폭
          ["--sidebar-width" as string]:
            !isNarrow && isSidebarExpanded
              ? "var(--sidebar-width-expanded)"
              : "var(--sidebar-width-folded)",
        }}
        className={cn(
          "grid overflow-hidden",
          "[transition:grid-template-columns_var(--motion-base)_var(--motion-ease-out)]",
          // 사이드바를 렌더하지 않을 때 2열 템플릿을 그대로 두면 콘텐츠가 사이드바 칸(0px)에
          // 들어가 폭이 0이 된다. 렌더 여부에 따라 열 자체를 바꾼다.
          isSidebarInline
            ? "[grid-template-columns:var(--sidebar-width)_minmax(0,1fr)]"
            : "[grid-template-columns:minmax(0,1fr)]",
          isHeaderHidden ? "h-dvh" : "h-[calc(100dvh-var(--header-height))]",
        )}
      >
        {isSidebarRendered && (
          <Sidebar
            isFolded={!isSidebarExpanded}
            variant={isSidebarInline ? "inline" : "overlay"}
            onFoldToggle={isHeaderHidden ? handleFoldToggle : undefined}
            foldToggleRef={isHeaderHidden ? sidebarToggleRef : undefined}
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
          {/* 좁은 화면에서 사이드바가 콘텐츠 위에 얹힐 때만 스크림을 깐다.
              메인 콘텐츠에 블러는 걸지 않는다 — 메뉴가 콘텐츠를 가리면 안 된다. */}
          {isDrawerOpen && (
            <button
              type="button"
              aria-label={t("sidebar.close")}
              onClick={closeDrawer}
              className="fixed inset-0 z-30 bg-scrim/40"
            />
          )}
          {children}
          <ModalManager />
          <DialogManager />
          <ModalNavigationGuard />
        </div>
      </main>
    </>
  );
}
