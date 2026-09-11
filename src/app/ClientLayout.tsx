"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
import { useMediaQuery } from "@/hooks/dom/useMediaQuery";
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
import { fadeVariants, SPRING_SOFT, TRANSITION_SLOW } from "@/constants/motion";

// 사이드바 없이 전용 화면을 쓰는 경로
const HIDE_SIDEBAR_PATHS: string[] = [];

// 헤더 없이 전용 상단 UI를 쓰는 경로
const HIDE_HEADER_PATHS = ["/chatting-room"];

// tokens.css의 --sidebar-width-expanded/--sidebar-width-folded와 값을 맞춘다.
// framer-motion으로 CSS 변수를 애니메이션하려면 var() 참조가 아니라 실제 값이 필요하다.
const SIDEBAR_WIDTH_EXPANDED = "240px";
const SIDEBAR_WIDTH_FOLDED = "70px";

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

  /*
   * 로그인 창을 곧장 연다. 예전에는 "로그인이 필요해요" 안내를 한 번 거쳤는데, 보호 경로로 들어가거나 보호 링크를
   * 누른 사람은 이미 로그인해야 한다는 것을 아는 상태라 확인 버튼 한 번이 더 있을 뿐이었다.
   */
  const requestLogin = useCallback(() => {
    openModal("LOGIN", { triggerRef: undefined });
  }, [openModal]);

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
    if (isAuthChecking) return;

    if (isProtectedRoute && !isLoggedIn) {
      // 로그아웃/회원탈퇴가 미리 남겨 둔 신호일 때만 홈으로 보낸다 — 그 흐름은
      // 이미 자기 손으로 window.location.replace("/")까지 마쳤으므로 여기서는
      // 남은 모달만 정리한다.
      const shouldSkipAuthAlert =
        sessionStorage.getItem(SKIP_AUTH_ALERT_ONCE_KEY) === "true";

      if (shouldSkipAuthAlert) {
        sessionStorage.removeItem(SKIP_AUTH_ALERT_ONCE_KEY);
        clearModals();
        router.replace("/");
        return;
      }

      /*
       * 그 외(세션 만료 등 사용자가 직접 로그아웃하지 않은 경우)는 페이지를 벗어나지 않는다.
       * 로그인 창만 띄워, 다시 로그인하면 있던 페이지를 그대로 이어서 쓸 수 있게 한다.
       */
      clearModals();
      requestLogin();
    }
  }, [
    clearModals,
    isAuthChecking,
    isLoggedIn,
    isProtectedRoute,
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
      if (!isProtectedPath(url.pathname)) return;
      if (isLoggedIn) return;

      event.preventDefault();
      event.stopPropagation();
      if (isAuthChecking) return;

      requestLogin();
    };

    document.addEventListener("click", handleProtectedLinkClick, true);

    return () => {
      document.removeEventListener("click", handleProtectedLinkClick, true);
    };
  }, [isAuthChecking, isLoggedIn, requestLogin]);

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

      // 보호 경로에서 뜬 로그인 모달의 "회원가입" 링크로 들어왔다면, 그 모달이 닫히지
      // 않은 채로 여기까지 남아있다. 완료 다이얼로그가 로그인보다 먼저 보여야 하므로
      // 먼저 정리한다.
      clearModals();
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
  }, [clearModals, openDialog, openModal, pathname]);

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    sessionStorage.removeItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY);
  }, [pathname]);

  /*
   * 로그인 여부가 아직 안 정해졌을 때만 감춘다. 로그인 여부가 정해진 뒤 세션이
   * 만료돼 isLoggedIn이 false가 돼도 페이지는 그대로 두어야 한다 — 위 effect가
   * 로그인 창만 띄우고 이동시키지 않으므로, 여기서도 내용을 지우면 안 된다.
   */
  if (isProtectedRoute && isAuthChecking) {
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
      <motion.main
        id="main-container"
        // 사이드바가 차지하는 열 폭.
        // 모바일: 0(콘텐츠가 전체 폭을 쓴다) · 태블릿: 레일 폭 고정(펼쳐도 콘텐츠를 밀지 않음)
        // 데스크탑: 사용자가 정한 접힘/펼침 폭
        // 폭이 조금씩 늘고 주는 변화라 SPRING_SOFT(면적 변화용 스프링)가 자연스럽다.
        // 화면을 가로지르는 드로어 슬라이드는 이동 거리가 커 스프링이 통통 튀어 보이므로
        // 그쪽은 TRANSITION_SLOW(감속 커브)를 따로 쓴다 — Sidebar.tsx 참고.
        animate={{
          ["--sidebar-width" as string]:
            !isNarrow && isSidebarExpanded
              ? SIDEBAR_WIDTH_EXPANDED
              : SIDEBAR_WIDTH_FOLDED,
        }}
        transition={SPRING_SOFT}
        className={cn(
          "grid overflow-hidden",
          // 사이드바를 렌더하지 않을 때 2열 템플릿을 그대로 두면 콘텐츠가 사이드바 칸(0px)에
          // 들어가 폭이 0이 된다. 렌더 여부에 따라 열 자체를 바꾼다.
          isSidebarInline
            ? "[grid-template-columns:var(--sidebar-width)_minmax(0,1fr)]"
            : "[grid-template-columns:minmax(0,1fr)]",
          isHeaderHidden ? "h-dvh" : "h-[calc(100dvh-var(--header-height))]",
        )}
      >
        <AnimatePresence>
          {isSidebarRendered && (
            <Sidebar
              key="sidebar"
              isFolded={!isSidebarExpanded}
              variant={isSidebarInline ? "inline" : "overlay"}
              onFoldToggle={isHeaderHidden ? handleFoldToggle : undefined}
              foldToggleRef={isHeaderHidden ? sidebarToggleRef : undefined}
            />
          )}
        </AnimatePresence>

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
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.button
                type="button"
                aria-label={t("sidebar.close")}
                onClick={closeDrawer}
                {...fadeVariants}
                transition={TRANSITION_SLOW}
                className="fixed inset-0 z-30 bg-scrim/40"
              />
            )}
          </AnimatePresence>
          {children}
          <ModalManager />
          <DialogManager />
          <ModalNavigationGuard />
        </div>
      </motion.main>
    </>
  );
}
