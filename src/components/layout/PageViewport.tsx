"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import BetaBanner from "./BetaBanner";
import MaintenanceBanner from "./MaintenanceBanner";

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
        // 이 요소는 스크롤하지 않는다(문서가 스크롤한다, base.css 참고). 가로 넘침만 자른다.
        // overflow-x:hidden 이면 스크롤 컨테이너가 되어 안쪽 sticky 가 이 요소에 붙어 버리므로
        // 스크롤 컨테이너를 만들지 않는 clip 을 쓴다.
        "relative min-w-0 w-full mx-auto",
        isHeaderHidden ? "min-h-0 overflow-hidden" : "overflow-x-clip",
        !isHomePath && !isChattingRoomPath && "content-x",
      )}
    >
      {/*
        채팅방은 화면 높이를 꽉 채워 쓰므로 띠를 두지 않는다. 버그 제보는 프로필 메뉴에도 있고,
        점검으로 새 메시지가 막히면 axios 가 점검 화면으로 보낸다.
      */}
      {!isChattingRoomPath && (
        <div className={cn("pt-3", isHomePath && "content-x")}>
          <MaintenanceBanner />
          <BetaBanner />
        </div>
      )}
      {children}
    </div>
  );
};

export default PageViewport;
