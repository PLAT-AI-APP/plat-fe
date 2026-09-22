"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import {
  MOBILE_MAX_WIDTH_QUERY,
  TABLET_MAX_WIDTH_QUERY,
} from "@/constants/layout";
import { useMediaQuery } from "@/hooks/dom/useMediaQuery";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/store/useLayoutStore";

const SIDEBAR_WIDTH_EXPANDED = "240px";
const SIDEBAR_WIDTH_FOLDED = "70px";

interface SidebarFrameProps {
  children: ReactNode;
  isHeaderHidden: boolean;
  isSidebarHidden: boolean;
}

const SidebarFrame = ({
  children,
  isHeaderHidden,
  isSidebarHidden,
}: SidebarFrameProps) => {
  const t = useTranslations();
  const isNarrow = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  const isMobile = useMediaQuery(MOBILE_MAX_WIDTH_QUERY);
  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const setSidebarExpanded = useLayoutStore((state) => state.setSidebarExpanded);
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);
  const isDrawerOpen = isNarrow && isSidebarExpanded;
  const isSidebarRendered = !isSidebarHidden;
  const isSidebarInline = isSidebarRendered && !isMobile && !isDrawerOpen;

  const handleFoldToggle = useCallback(() => toggleSidebar(), [toggleSidebar]);
  const closeDrawer = useCallback(
    () => setSidebarExpanded(false),
    [setSidebarExpanded],
  );

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeDrawer();
      sidebarToggleRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, isDrawerOpen]);

  return (
    <>
      {!isHeaderHidden && (
        <Header
          handleFoldToggle={handleFoldToggle}
          foldToggleRef={sidebarToggleRef}
        />
      )}
      <main
        id="main-container"
        style={
          {
            "--sidebar-width":
              !isNarrow && isSidebarExpanded
                ? SIDEBAR_WIDTH_EXPANDED
                : SIDEBAR_WIDTH_FOLDED,
          } as CSSProperties
        }
        className={cn(
          // 열 폭은 애니메이션하지 않는다. 폭을 300ms 동안 매 프레임 바꾸면 오른쪽 콘텐츠 전체(카드
          // 그리드 등)가 매 프레임 레이아웃을 다시 해 무거운 화면에서 끊겼다. 접힘의 움직임은
          // 사이드바 라벨의 opacity/transform 전환(Sidebar.tsx)이 맡는다.
          "grid overflow-hidden",
          isSidebarInline
            ? "[grid-template-columns:var(--sidebar-width)_minmax(0,1fr)]"
            : "[grid-template-columns:minmax(0,1fr)]",
          isHeaderHidden ? "h-dvh" : "h-[calc(100dvh-var(--header-height))]",
        )}
      >
        {isSidebarRendered && (
          <Sidebar
            isFolded={!isSidebarExpanded}
            isOpen={!isMobile || isDrawerOpen}
            variant={isSidebarInline ? "inline" : "overlay"}
            onFoldToggle={isHeaderHidden ? handleFoldToggle : undefined}
            foldToggleRef={isHeaderHidden ? sidebarToggleRef : undefined}
          />
        )}

        <button
          type="button"
          aria-label={t("sidebar.close")}
          aria-hidden={!isDrawerOpen}
          tabIndex={isDrawerOpen ? 0 : -1}
          onClick={closeDrawer}
          className={cn(
            "fixed inset-0 z-30 bg-scrim/40 transition-opacity duration-slow ease-out",
            isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        {children}
      </main>
    </>
  );
};

export default SidebarFrame;
