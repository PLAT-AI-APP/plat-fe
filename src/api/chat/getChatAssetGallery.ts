import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import type { ChatAssetGalleryResponse } from "@/type/chat";

/** Fetch chat room asset gallery data */
export const getChatAssetGallery = async (chatRoomId: string) => {
  const response = await authAxios.get<
    ApiSuccessResponse<ChatAssetGalleryResponse>
  >(`/chat-rooms/${chatRoomId}/assets`);

  return response.data.data;
};

/** Query hook for chat room asset gallery data */
export const useChatAssetGalleryQuery = (chatRoomId: string) => {
  return useQuery<ChatAssetGalleryResponse, AppError>({
    queryKey: ["get-chat-asset-gallery", chatRoomId],
    queryFn: () => getChatAssetGallery(chatRoomId),
    staleTime: 1000 * 60 * 5,
  });
};
