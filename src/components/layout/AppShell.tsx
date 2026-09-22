"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LazyLayerManagers from "@/components/LazyLayerManagers";
import ProtectedRouteGate from "@/components/auth/ProtectedRouteGate";
import ModalNavigationGuard from "@/components/modal/ModalNavigationGuard";
import DocumentTitle from "./DocumentTitle";
import PageViewport from "./PageViewport";
import SidebarFrame from "./SidebarFrame";

const HIDE_SIDEBAR_PATHS: string[] = [];
const HIDE_HEADER_PATHS = ["/chatting-room"];

const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isSidebarHidden = HIDE_SIDEBAR_PATHS.some((path) =>
    pathname.startsWith(path),
  );
  const isHeaderHidden = HIDE_HEADER_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <SidebarFrame
      isHeaderHidden={isHeaderHidden}
      isSidebarHidden={isSidebarHidden}
    >
      <PageViewport
        isChattingRoomPath={pathname.startsWith("/chatting-room")}
        isHeaderHidden={isHeaderHidden}
        isHomePath={pathname === "/"}
      >
        {/* 인증 확인을 기다리는 건 페이지 내용뿐이다. 헤더·사이드바까지 감싸면 새로고침할 때마다
            토큰 갱신이 끝날 때까지 화면 전체가 비어 보인다. */}
        <ProtectedRouteGate>{children}</ProtectedRouteGate>
        <LazyLayerManagers />
        <ModalNavigationGuard />
        <DocumentTitle />
      </PageViewport>
    </SidebarFrame>
  );
};

export default AppShell;
