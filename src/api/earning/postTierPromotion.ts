import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { TierPromotionResult } from "@/type/earning";
import { earningQueryKeys } from "./queryKeys";

const postTierPromotion = async () => {
  const response = await authAxios.post<TierPromotionResult>(
    "/earnings/tier/promotions",
  );
  return response.data;
};

/**
 * 승급 신청. 서버가 조건을 다시 보고 한 단계 올린다. 연출이 끝난 뒤 화면이 등급을 다시 받도록
 * 무효화는 호출부가 연출을 닫을 때 한다. 실패 토스트는 전역 mutation 기본 처리에 맡긴다.
 */
export const useTierPromotionMutation = () =>
  useMutation<TierPromotionResult, AppError, void>({
    mutationKey: ["post-earning-tier-promotion"],
    mutationFn: postTierPromotion,
  });

/** 등급이 바뀐 뒤 요약(칩·보류)과 등급 화면을 다시 받는다. */
export const useInvalidateEarning = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: earningQueryKeys.all() });
};
