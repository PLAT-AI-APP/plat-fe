import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { NoteConversionRequest, RewardRedemption } from "@/type/earning";
import { walletQueryKeys } from "../wallet/queryKeys";
import { noteQueryKeys } from "../note/queryKeys";
import { earningQueryKeys } from "./queryKeys";

const postNoteConversion = async (request: NoteConversionRequest) => {
  const response = await authAxios.post<RewardRedemption>(
    "/earnings/note-conversions",
    request,
  );
  return response.data;
};

/**
 * 수익 포인트를 노트로 전환한다. 수익 요약·내역과 함께 노트 지갑·노트 사용 내역도 다시 받는다.
 * 실패 토스트는 전역 mutation 기본 처리에 맡긴다.
 */
export const usePostNoteConversionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardRedemption, AppError, NoteConversionRequest>({
    mutationKey: ["post-earning-note-conversion"],
    mutationFn: postNoteConversion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earningQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: walletQueryKeys.balance() });
      queryClient.invalidateQueries({
        queryKey: noteQueryKeys.usageHistoryLists(),
      });
    },
  });
};
