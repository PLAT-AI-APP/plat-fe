import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ChatCatalog } from "@/type/chat";

const getChatModels = async () => {
  const response = await authAxios.get<ChatCatalog>("/chat/models");

  return response.data;
};

/** 채팅 모델·프롬프트 배수 카탈로그 조회. 구성이 자주 바뀌지 않아 오래 캐싱합니다. */
export const useChatModelsQuery = () => {
  return useQuery<ChatCatalog, AppError>({
    queryKey: ["get-chat-models"],
    queryFn: getChatModels,
    staleTime: 1000 * 60 * 30,
  });
};
