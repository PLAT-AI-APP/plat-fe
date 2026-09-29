import { useMutation } from "@tanstack/react-query";
import { chatAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatRegenerateRequest, ChatStartResponse } from "@/type/chat";

const postChatRegenerate = async (request: ChatRegenerateRequest) => {
  const response = await chatAxios.post<ChatStartResponse>(
    "/chat/regenerate",
    request,
  );

  return response.data;
};

/**
 * 마지막 답 다시 만들기. 시작·스트림·과금은 일반 턴과 같고, 서버가 확정할 때 옛 답을 새 답으로 바꾼다.
 * 실패 안내는 useChatTurn 이 직접 한다(노트 부족은 다이얼로그).
 */
export const usePostChatRegenerateMutation = () => {
  return useMutation<ChatStartResponse, AppError, ChatRegenerateRequest>({
    mutationKey: ["post-chat-regenerate"],
    mutationFn: postChatRegenerate,
    meta: { silent: true },
  });
};
