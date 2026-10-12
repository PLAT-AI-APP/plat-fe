import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatViewMode } from "@/type/chat";

/** 서버가 아직 값을 주지 않을 때 쓰는 기본 보기. */
export const DEFAULT_CHAT_VIEW_MODE: ChatViewMode = "CHAT";

/**
 * 채팅 화면을 어떤 모양으로 보여 줄지에 대한 사용자 선택.
 *
 * 사이드바(설정)와 메시지 목록(화면)이 서로 멀리 떨어져 있어 전역 스토어에 둔다.
 * 처음에는 제작자가 정한 세계관 기본 보기를 따르고, 유저가 토글을 직접 바꾼 세계관만 그 선택을 기억한다.
 * 같은 캐릭터의 다른 방에 들어가도 다시 켜지 않도록 세계관 단위로 브라우저에 남긴다.
 */
interface ChatViewState {
  /** 세계관 ID → 유저가 고른 소설형 보기 여부. 없으면 제작자 기본값을 따른다. */
  novelViewByUniverse: Record<string, boolean>;
  setNovelView: (universeId: string, isNovelView: boolean) => void;
}

export const useChatViewStore = create<ChatViewState>()(
  persist(
    (set) => ({
      novelViewByUniverse: {},
      setNovelView: (universeId, isNovelView) =>
        set((state) => ({
          novelViewByUniverse: {
            ...state.novelViewByUniverse,
            [universeId]: isNovelView,
          },
        })),
    }),
    {
      name: "chat-view-storage",
      // v0 은 전역 isNovelView 하나였다. 세계관별 기본값을 따르도록 바뀌며 예전 값은 버린다.
      version: 1,
      migrate: () => ({ novelViewByUniverse: {} }),
    },
  ),
);

/**
 * 이 세계관의 채팅방을 소설형으로 볼지와 그 토글.
 * 유저가 바꾼 적이 없으면 제작자 기본 보기(defaultViewMode)를, 바꾼 적이 있으면 그 선택을 쓴다.
 */
export const useNovelView = (
  universeId: string | undefined,
  defaultViewMode: ChatViewMode | null | undefined,
) => {
  const storedNovelView = useChatViewStore((state) =>
    universeId ? state.novelViewByUniverse[universeId] : undefined,
  );
  const setNovelView = useChatViewStore((state) => state.setNovelView);
  const isNovelView =
    storedNovelView ?? (defaultViewMode ?? DEFAULT_CHAT_VIEW_MODE) === "NOVEL";

  const toggleNovelView = () => {
    // 방 정보를 아직 못 받았으면 어느 세계관의 선택인지 몰라 남길 수 없다.
    if (!universeId) return;
    setNovelView(universeId, !isNovelView);
  };

  return { isNovelView, toggleNovelView };
};
