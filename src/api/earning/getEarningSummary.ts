import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { EarningSummary } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getEarningSummary = async () => {
  const response = await authAxios.get<EarningSummary>("/earnings/summary");
  return response.data;
};

/** 수익 요약 조회 */
export const useEarningSummaryQuery = () => {
  const authReady = useAuthReady();

  return useQuery<EarningSummary, AppError>({
    queryKey: earningQueryKeys.summary(),
    queryFn: getEarningSummary,
    enabled: authReady,
  });
};
