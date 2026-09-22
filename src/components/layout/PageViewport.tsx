"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageViewportProps {
  children: ReactNode;
  isChattingRoomPath: boolean;
  isHeaderHidden: boolean;
  isHomePath: boolean;
}

const PageViewport = ({
  children,
  isChattingRoomPath,
  isHeaderHidden,
  isHomePath,
}: PageViewportProps) => {
  return (
    <div
      id="page-content"
      className={cn(
        // scroll-smooth 를 두면 라우트 이동 때 Next 가 부르는 scrollIntoView 까지 부드럽게 굴러가
        // 새 페이지가 뜬 뒤 스크롤이 천천히 올라간다. 부드러운 이동이 필요한 곳은 behavior 로 넘긴다.
        "relative flex-1 overflow-x-hidden",
        "min-h-0 w-full mx-auto",
        isHeaderHidden ? "overflow-hidden" : "overflow-y-auto",
        !isHomePath && !isChattingRoomPath && "content-x",
      )}
    >
      {children}
    </div>
  );
};

export default PageViewport;
