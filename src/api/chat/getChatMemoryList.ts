import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import type { ChatMemoryEntry } from "@/type/chat";

/** 채팅방 장기기억 목록 조회 */
export const getChatMemoryList = async (chatRoomId: string) => {
  const response = await authAxios.get<ApiSuccessResponse<ChatMemoryEntry[]>>(
    `/chat-rooms/${chatRoomId}/memories`,
  );

  return response.data.data;
};

/** 채팅방 장기기억 목록 조회 hook */
export const useChatMemoryListQuery = (chatRoomId: string) => {
  return useQuery<ChatMemoryEntry[], AppError>({
    queryKey: ["get-chat-memory-list", chatRoomId],
    queryFn: () => getChatMemoryList(chatRoomId),
    staleTime: 1000 * 60 * 5,
  });
};
