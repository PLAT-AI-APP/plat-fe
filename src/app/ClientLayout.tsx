"use client";

import { useState, useEffect } from "react"; // useEffect 추가
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { cn } from "@/lib/utils";
import { useMyInfoQuery } from "@/api/user/myInfo";

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

  const [isFolded, setIsFolded] = useState(() =>
    FOLD_SIDEBAR_PATHS.some((path) => pathname?.startsWith(path)),
  );

  const [prevPathname, setPrevPathname] = useState(pathname);

  // 화면 너비에 따른 자동 폴딩 로직 추가
  useEffect(() => {
    // 1024px 미만인지 체크하는 매치 미디어
    const mql = window.matchMedia("(max-width: 1023px)");

    const handleSceneChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // 1024px 미만이면 fold(true), 이상이면 fold 해제(false)
      setIsFolded(e.matches);
    };

    // 초기 실행
    handleSceneChange(mql);

    // 이벤트 리스너 등록
    mql.addEventListener("change", handleSceneChange);
    return () => mql.removeEventListener("change", handleSceneChange);
  }, []);

  // 경로 변경 감지 로직 (기존 유지)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname?.startsWith("/chatting-room")) {
      setIsFolded(true);
    }
  }

  const handleFoldToggle = () => setIsFolded((prev) => !prev);
  const { isScrolling, onScroll } = useScrollTimeout();

  return (
    <>
      {!isHeaderHidden && <Header handleFoldToggle={handleFoldToggle} />}
      <main
        id="main-container"
        className={cn(
          "flex",
          // 수정된 로직: 헤더가 숨겨졌을 때(true) 전체 높이, 헤더가 있을 때(false) 60px 차감
          isHeaderHidden ? "h-screen" : "h-[calc(100vh-60px)]",
        )}
      >
        {!isSidebarHidden && <Sidebar isFolded={isFolded} />}

        <div
          id="page-content"
          onScroll={onScroll}
          className={cn(
            "max-w-300 w-full mx-auto hide-scrollbar-on-idle flex-1 overflow-y-auto overflow-x-hidden flex flex-col",
            isScrolling && "is-scrolling",
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}
