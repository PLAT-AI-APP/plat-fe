"use client";

import { useState } from "react";
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

  // 초기값 설정 단계에서 현재 경로를 즉시 반영
  const [isFolded, setIsFolded] = useState(
    () => !pathname?.startsWith("/chatting-room"),
  );

  // 이전 경로를 저장하여 경로 변경을 감지
  const [prevPathname, setPrevPathname] = useState(pathname);

  // 경로가 바뀌었을 때만 실행되는 로직
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
            "hide-scrollbar-on-idle flex-1 overflow-y-auto overflow-x-hidden flex flex-col",
            isScrolling && "is-scrolling",
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}
