import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RedeemGiftCardRequest, RewardRedemption } from "@/type/earning";
import { earningQueryKeys } from "./queryKeys";

const postRedemption = async (request: RedeemGiftCardRequest) => {
  const response = await authAxios.post<RewardRedemption>(
    "/earnings/redemptions",
    request,
  );
  return response.data;
};

/**
 * 상품권 교환 신청. 포인트는 신청 즉시 빠지므로 요약·내역을 다시 받는다.
 * 실패 토스트는 전역 mutation 기본 처리에 맡긴다.
 */
export const usePostRedemptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RewardRedemption, AppError, RedeemGiftCardRequest>({
    mutationKey: ["post-earning-redemption"],
    mutationFn: postRedemption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earningQueryKeys.all() });
    },
  });
};
