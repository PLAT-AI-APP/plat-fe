import { useMutation, useQueryClient } from "@tanstack/react-query";
// 상태 코드(409·429)로 안내를 가르므로 status 가 있는 AppError 를 쓴다.
import { authAxios, type AppError } from "..";
import { userQueryKeys } from "@/api/user/queryKeys";
import { reviewQueryKeys } from "./queryKeys";

const postUniverseAppeal = async (universeId: string) => {
  await authAxios.post(`/content-reviews/universes/${universeId}/appeal`);
};

/**
 * AI 가 반려한 내 세계관 본문에 이의 신청. 운영자가 다시 본다(AI 재판정은 없다).
 * 이미지 이의 신청과 사용자별 횟수 한도를 나눠 쓰며, 409(신청할 수 없음)·429(잠시 뒤 다시) 안내는 부르는 쪽이 한다.
 */
export const useUniverseAppealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["post-universe-appeal"],
    mutationFn: postUniverseAppeal,
    meta: { silent: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.allUniverses() });
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all() });
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.myInfo() });
    },
  });
};
