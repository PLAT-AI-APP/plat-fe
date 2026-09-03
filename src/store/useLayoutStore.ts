import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 레이아웃 셸 상태의 유일한 소유처.
 *
 * 사이드바는 "메뉴"라 중요도가 낮다. 그래서 기본은 접힘(아이콘만)이고,
 * 펼침 여부는 오직 사용자가 정한다 — 라우트나 탭이 바뀐다고 앱이 마음대로
 * 접거나 펴지 않는다. 그 선택은 persist 로 브라우저에 남는다.
 *
 * 좁은 화면 여부는 여기 두지 않는다. 뷰포트는 매 순간 바뀌는 환경 값이라
 * 저장하면 다음 방문 때 틀린 값으로 시작한다. useMediaQuery 로 그때그때 읽는다.
 */
interface LayoutState {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarExpanded: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ isSidebarExpanded: expanded }),
    }),
    {
      name: "layout-storage",
      partialize: (state) => ({ isSidebarExpanded: state.isSidebarExpanded }),
    },
  ),
);
