"use client";

import type { ReactNode } from "react";
import { useScrollTimeout } from "@/hooks/dom/useScrollTiemout";
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
  const { isScrolling, onScroll } = useScrollTimeout();

  return (
    <div
      id="page-content"
      onScroll={onScroll}
      className={cn(
        "relative flex-1 overflow-x-hidden scroll-smooth",
        "min-h-0 w-full mx-auto",
        isHeaderHidden ? "overflow-hidden" : "overflow-y-auto",
        isScrolling && "is-scrolling",
        !isHomePath && !isChattingRoomPath && "content-x",
      )}
    >
      {children}
    </div>
  );
};

export default PageViewport;
