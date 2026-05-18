"use client";

import { useState, useEffect } from "react"; // useEffect 추가
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { cn } from "@/lib/utils";
import { useMyInfoQuery } from "@/api/user/getMyInfo";
import { ModalManager } from "@/components/modal/ModalManager";
import { useAuthStore } from "@/store/useAuthStore";
// import { useAuthStore } from "@/store/useAuthStore";

// 사이드바를 아예 보여주지 않을 경로 리스트
const HIDE_SIDEBAR_PATHS = ["/character-creat"];

// 헤더를 아예 보여주지 않을 경로 리스트
const HIDE_HEADER_PATHS = ["/character-creat"];

// 사이드바를 기본으로 접어둘 경로 리스트
const FOLD_SIDEBAR_PATHS = ["/chatting-room"];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useMyInfoQuery();

  // 현재 경로가 사이드바 숨김 대상인지 확인
  const isSidebarHidden = HIDE_SIDEBAR_PATHS.some((path) =>
    pathname?.startsWith(path),
  );
  // 현재 경로가 헤더 숨김 대상인지 확인
  const isHeaderHidden = HIDE_HEADER_PATHS.some((path) =>
    pathname?.startsWith(path),
  );

  const [prevPathname, setPrevPathname] = useState(pathname);

  // 초기값은 무조건 false (어떤 경로든, 어떤 화면 크기든 첫 로딩은 펴짐)
  const [isFolded, setIsFolded] = useState(
    FOLD_SIDEBAR_PATHS.some((path) => pathname?.startsWith(path)),
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handleSceneChange = (e: MediaQueryListEvent) => {
      setIsFolded(e.matches);
    };

    mql.addEventListener("change", handleSceneChange);
    return () => mql.removeEventListener("change", handleSceneChange);
  }, [pathname]); // isFolded를 의존성에 추가하여 최신 상태 확인

  // 경로 변경 감지 로직 (기존 유지)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname?.startsWith("/chatting-room")) {
      setIsFolded(true);
    }
  }

  const handleFoldToggle = () => setIsFolded((prev) => !prev);
  const { isScrolling, onScroll } = useScrollTimeout();

  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 인증(로그인)이 꼭 필요한 보호 경로 목록 정의
    const protectedRoutes = ["/mypage", "/studio"];

    // 현재 접속한 pathname이 보호 경로 중 하나로 시작하는지 검사
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // 보호된 경로인데 토큰이 없다면 홈으로 튕겨내기
    if (isProtectedRoute && !accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      router.replace("/");
    }
  }, [accessToken, pathname, router]);
  return (
    <>
      {!isHeaderHidden && <Header handleFoldToggle={handleFoldToggle} />}
      <main
        id="main-container"
        className={cn(
          "flex flex-row overflow-hidden", // 내부 요소가 삐져나가지 않게 차단
          isHeaderHidden ? "h-screen" : "h-[calc(100vh-60px)]",
        )}
      >
        {!isSidebarHidden && <Sidebar isFolded={isFolded} />}

        <div
          id="page-content"
          onScroll={onScroll}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden flex flex-col",
            "min-h-0 w-full mx-auto", // min-h-0이 핵심입니다.
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
