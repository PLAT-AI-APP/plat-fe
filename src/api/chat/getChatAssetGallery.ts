import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatAssetGalleryResponse } from "@/type/chat";
import { chatQueryKeys } from "./queryKeys";

/** 채팅방 에셋 갤러리 데이터 조회. 방 소유자가 아니면 404 다. */
export const getChatAssetGallery = async (chatRoomId: string) => {
  const response = await authAxios.get<ChatAssetGalleryResponse>(
    `/rooms/${chatRoomId}/assets`,
  );

  return response.data;
};

/** 채팅방 에셋 갤러리 데이터 조회 hook */
export const useChatAssetGalleryQuery = (chatRoomId: string) => {
  return useQuery<ChatAssetGalleryResponse, AppError>({
    queryKey: chatQueryKeys.assetGallery(chatRoomId),
    queryFn: () => getChatAssetGallery(chatRoomId),
  });
};
