"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { cn } from "@/lib/utils";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { ModalManager } from "@/components/modal/ModalManager";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import axios from "axios";

// 사이드바를 아예 보여주지 않을 경로 리스트
const HIDE_SIDEBAR_PATHS = ["/character-creat"];

// 헤더를 아예 보여주지 않을 경로 리스트
const HIDE_HEADER_PATHS = ["/character-creat"];

// 사이드바를 기본으로 접어둘 경로 리스트
const FOLD_SIDEBAR_PATHS = ["/chatting-room"];
const FOLD_SIDEBAR_FULL_PATHS = ["/?tab=categories"];
const PROTECTED_ROUTES = [
  "/my-chatting",
  "/chatting-room",
  "/character-creat",
  "/studio",
  "/usage-history",
  "/token-charge",
];

const isProtectedPath = (path: string) =>
  PROTECTED_ROUTES.some((route) => path.startsWith(route));

const isAuthExpiredError = (error: unknown) =>
  axios.isAxiosError(error) &&
  (error.response?.status === 401 || error.response?.status === 403);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 쿼리스트링을 포함한 전체 경로(fullPath) 생성
  const queryString = searchParams.toString();
  const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

  useMyInfoQuery();

  // 현재 경로가 사이드바 숨김 대상인지 확인
  const isSidebarHidden = HIDE_SIDEBAR_PATHS.some((path) =>
    pathname?.startsWith(path),
  );
  // 현재 경로가 헤더 숨김 대상인지 확인
  const isHeaderHidden = HIDE_HEADER_PATHS.some((path) =>
    pathname?.startsWith(path),
  );

  // 사이드바 접힘 조건 판단 함수 (fullPath 활용)
  const shouldFoldSidebar = () => {
    const isFoldedPath = FOLD_SIDEBAR_PATHS.some((path) =>
      pathname?.startsWith(path),
    );
    // 통합된 fullPath로 바로 비교
    const isFoldedFullPath = FOLD_SIDEBAR_FULL_PATHS.includes(fullPath);
    return isFoldedPath || isFoldedFullPath;
  };

  // 초기값 설정 시 조건 반영
  const [isFolded, setIsFolded] = useState(shouldFoldSidebar());

  const [prevFullPath, setPrevFullPath] = useState(fullPath);

  // 반응형 미디어 쿼리 제어 (기존 로직 유지)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handleSceneChange = (e: MediaQueryListEvent) => {
      setIsFolded(e.matches);
    };

    mql.addEventListener("change", handleSceneChange);
    return () => mql.removeEventListener("change", handleSceneChange);
  }, [pathname]);

  // 한 번의 비교로 경로와 쿼리스트링 변경 모두 감지
  if (fullPath !== prevFullPath) {
    setPrevFullPath(fullPath);

    if (shouldFoldSidebar()) {
      setIsFolded(true);
    }
  }

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
  const isProtectedRoute = isProtectedPath(pathname);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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
    ];

    // 현재 접속한 pathname이 보호 경로 중 하나로 시작하는지 검사
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // 보호된 경로인데 토큰이 없다면 홈으로 튕겨내기
    if (isAuthChecking) return;

    if (isProtectedRoute && !isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      router.replace("/");
    }
  }, [isAuthChecking, isLoggedIn, pathname, router]);

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

      alert("로그인이 필요한 서비스입니다.");
    };

    document.addEventListener("click", handleProtectedLinkClick, true);

    return () => {
      document.removeEventListener("click", handleProtectedLinkClick, true);
    };
  }, [isAuthChecking, isLoggedIn]);

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
          isHeaderHidden ? "h-screen" : "h-[calc(100vh-60px)]",
        )}
      >
        {!isSidebarHidden && <Sidebar isFolded={isFolded} />}

        <div
          id="page-content"
          onScroll={onScroll}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "min-h-0 w-full mx-auto",
            isScrolling && "is-scrolling",
          )}
        >
          {children}
          <ModalManager />
        </div>
      </main>
    </>
  );
}
