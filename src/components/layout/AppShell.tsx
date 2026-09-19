"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LazyLayerManagers from "@/components/LazyLayerManagers";
import ModalNavigationGuard from "@/components/modal/ModalNavigationGuard";
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
        {children}
        <LazyLayerManagers />
        <ModalNavigationGuard />
      </PageViewport>
    </SidebarFrame>
  );
};

export default AppShell;
