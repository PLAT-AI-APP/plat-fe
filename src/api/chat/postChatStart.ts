import { useMutation } from "@tanstack/react-query";
import { chatAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatStartRequest, ChatStartResponse } from "@/type/chat";

/**
 * 턴 시작. 검증·예약만 동기로 끝내고 turnId를 돌려주며,
 * 실제 토큰은 이 turnId로 SSE를 따로 구독해서 받습니다.
 */
const postChatStart = async (request: ChatStartRequest) => {
  const response = await chatAxios.post<ChatStartResponse>("/chat", request);

  return response.data;
};

/**
 * 채팅 턴 시작. 실패 안내는 useChatTurn 이 직접 한다 — 노트 부족처럼 토스트 대신 다이얼로그로 알릴 오류가 있어서
 * 전역 토스트를 끈다.
 */
export const usePostChatStartMutation = () => {
  return useMutation<ChatStartResponse, AppError, ChatStartRequest>({
    mutationKey: ["post-chat-start"],
    mutationFn: postChatStart,
    meta: { silent: true },
  });
};
