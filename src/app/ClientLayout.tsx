"use client";

import { useState, useEffect } from "react"; // useEffect 추가
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useScrollTimeout } from "@/hooks/useScrollTiemout";
import { cn } from "@/lib/utils";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isFolded, setIsFolded] = useState(
    () => !pathname?.startsWith("/chatting-room"),
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
      <Header handleFoldToggle={handleFoldToggle} />
      <main id="main-container" className="flex h-[calc(100vh-60px)]">
        <Sidebar isFolded={isFolded} />

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
