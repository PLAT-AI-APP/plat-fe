import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 채팅 화면을 어떤 모양으로 보여 줄지에 대한 사용자 선택.
 *
 * 사이드바(설정)와 메시지 목록(화면)이 서로 멀리 떨어져 있어 전역 스토어에 둔다.
 * 방마다 다시 켜지 않도록 브라우저에 남긴다.
 */
interface ChatViewState {
  /** 말풍선·프로필 없이 소설 문장처럼 이어서 보여 줄지. */
  isNovelView: boolean;
  toggleNovelView: () => void;
}

export const useChatViewStore = create<ChatViewState>()(
  persist(
    (set) => ({
      isNovelView: false,
      toggleNovelView: () =>
        set((state) => ({ isNovelView: !state.isNovelView })),
    }),
    {
      name: "chat-view-storage",
    },
  ),
);
