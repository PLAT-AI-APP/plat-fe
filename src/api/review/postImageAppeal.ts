import { useMutation, useQueryClient } from "@tanstack/react-query";
// 상태 코드(409·429)로 안내를 가르므로 status 가 있는 AppError 를 쓴다.
import { authAxios, type AppError } from "..";
import { userQueryKeys } from "@/api/user/queryKeys";
import { reviewQueryKeys } from "./queryKeys";

const postImageAppeal = async (fileId: string) => {
  await authAxios.post(`/content-reviews/files/${fileId}/appeal`);
};

/**
 * AI 가 반려했거나 성인 이미지로 막은 내 이미지에 이의 신청. 운영자가 다시 본다.
 * 409(이의 신청할 수 없음)·429(잠시 뒤 다시) 안내는 부르는 쪽이 직접 한다.
 */
export const useImageAppealMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: ["post-image-appeal"],
    mutationFn: postImageAppeal,
    meta: { silent: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.allUniverses() });
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all() });
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.myInfo() });
    },
  });
};
