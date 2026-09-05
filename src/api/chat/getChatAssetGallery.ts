import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatAssetGalleryResponse } from "@/type/chat";

/** 채팅방 에셋 갤러리 데이터 조회 */
export const getChatAssetGallery = async (chatRoomId: string) => {
  const response = await authAxios.get<ChatAssetGalleryResponse>(
    `/chat-rooms/${chatRoomId}/assets`,
  );

  return response.data;
};

/** 채팅방 에셋 갤러리 데이터 조회 hook */
export const useChatAssetGalleryQuery = (chatRoomId: string) => {
  return useQuery<ChatAssetGalleryResponse, AppError>({
    queryKey: ["get-chat-asset-gallery", chatRoomId],
    queryFn: () => getChatAssetGallery(chatRoomId),
  });
};
