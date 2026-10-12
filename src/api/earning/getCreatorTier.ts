import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { CreatorTierStatus } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getCreatorTier = async () => {
  const response = await authAxios.get<CreatorTierStatus>("/earnings/tier");
  return response.data;
};

/** 내 제작자 등급·지표·등급표 조회 */
export const useCreatorTierQuery = () => {
  const authReady = useAuthReady();

  return useQuery<CreatorTierStatus, AppError>({
    queryKey: earningQueryKeys.tier(),
    queryFn: getCreatorTier,
    enabled: authReady,
  });
};
