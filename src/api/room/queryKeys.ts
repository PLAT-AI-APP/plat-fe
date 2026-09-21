const roomListRootKey = ["get-room-list"] as const;

/** 채팅방 관련 캐시 키의 단일 출처. */
export const roomQueryKeys = {
  /**
   * 내 채팅방 목록 전체(페이지 크기와 무관).
   * 방을 만들거나 고정·삭제한 뒤 목록을 다시 받을 때 무효화합니다.
   */
  lists: () => roomListRootKey,
  list: (size?: number) => [...roomListRootKey, size] as const,
  detail: (roomId?: string) => ["get-room-detail", roomId] as const,
  messages: (roomId?: string) => ["get-room-messages", roomId] as const,
};
