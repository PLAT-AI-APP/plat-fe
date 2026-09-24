"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
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

const subscribeNothing = () => () => {};
/** 서버 렌더·하이드레이션 중에는 false, 브라우저에서 한 번 그린 뒤로는 true. */
const useHasMounted = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
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
  /*
   * 서버에는 화면 폭이 없어 useMediaQuery 가 늘 "넓은 화면"으로 답한다. 그래서 모바일에서 열면
   * 70px 사이드바 레일이 그려졌다가, 하이드레이션 뒤 드로어로 바뀌며 밀려 사라지고 본문이 옆으로
   * 튀었다. 브라우저가 폭을 알기 전까지는 같은 경계를 CSS(max-sm)로 먼저 적용해 둔다.
   */
  const hasMounted = useHasMounted();
  const hideInlineOnSmallBeforeMount = !hasMounted && isSidebarInline;

  // 사이드바 펼침 여부는 브라우저 저장값이라 서버는 모른다. 첫 렌더를 서버와 같은 기본값(접힘)으로
  // 맞춘 뒤 저장값을 불러온다 — 처음부터 저장값으로 그리면 서버 HTML 과 폭이 어긋난다.
  useEffect(() => {
    void useLayoutStore.persist.rehydrate();
  }, []);

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
          "grid",
          isSidebarInline
            ? "[grid-template-columns:var(--sidebar-width)_minmax(0,1fr)]"
            : "[grid-template-columns:minmax(0,1fr)]",
          hideInlineOnSmallBeforeMount &&
            "max-sm:[grid-template-columns:minmax(0,1fr)]",
          // 헤더 없는 화면(채팅방)은 화면 높이에 고정하고 안에서 스크롤한다. 나머지는 문서가
          // 스크롤하므로 높이를 가두지 않는다(최소 높이만 둔다).
          isHeaderHidden
            ? "h-dvh overflow-hidden"
            : "min-h-[calc(100dvh-var(--header-height))]",
        )}
      >
        {isSidebarRendered && (
          <Sidebar
            isFolded={!isSidebarExpanded}
            isOpen={!isMobile || isDrawerOpen}
            variant={isSidebarInline ? "inline" : "overlay"}
            onFoldToggle={isHeaderHidden ? handleFoldToggle : undefined}
            foldToggleRef={isHeaderHidden ? sidebarToggleRef : undefined}
            className={cn(
              // 문서가 스크롤하므로 사이드바는 헤더 아래에 붙어 화면 높이만큼만 차지한다.
              !isHeaderHidden &&
                "top-(--header-height) h-[calc(100dvh-var(--header-height))] self-start",
              hideInlineOnSmallBeforeMount && "max-sm:hidden",
            )}
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
