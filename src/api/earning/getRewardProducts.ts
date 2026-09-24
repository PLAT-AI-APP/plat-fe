import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RewardProduct } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getRewardProducts = async () => {
  const response = await authAxios.get<RewardProduct[]>(
    "/earnings/reward-products",
  );
  return response.data;
};

/** 교환 상품 조회 */
export const useRewardProductsQuery = () => {
  const authReady = useAuthReady();

  return useQuery<RewardProduct[], AppError>({
    queryKey: earningQueryKeys.rewardProducts(),
    queryFn: getRewardProducts,
    enabled: authReady,
  });
};
