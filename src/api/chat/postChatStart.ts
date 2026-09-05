import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatStartRequest, ChatStartResponse } from "@/type/chat";

/**
 * 턴 시작. 검증·예약만 동기로 끝내고 turnId를 돌려주며,
 * 실제 토큰은 이 turnId로 SSE를 따로 구독해서 받습니다.
 */
const postChatStart = async (request: ChatStartRequest) => {
  const response = await authAxios.post<ChatStartResponse>("/chat", request);

  return response.data;
};

/** 채팅 턴 시작 */
export const usePostChatStartMutation = () => {
  return useMutation<ChatStartResponse, AppError, ChatStartRequest>({
    mutationKey: ["post-chat-start"],
    mutationFn: postChatStart,
  });
};
