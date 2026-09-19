/** 채팅 관련 캐시 키의 단일 출처. */
export const chatQueryKeys = {
  models: () => ["get-chat-models"] as const,
  assetGallery: (chatRoomId: string) =>
    ["get-chat-asset-gallery", chatRoomId] as const,
};
