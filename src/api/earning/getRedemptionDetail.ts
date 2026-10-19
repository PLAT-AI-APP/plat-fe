import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { RedemptionDetail } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getRedemptionDetail = async (redemptionNo: string) => {
  const response = await authAxios.get<RedemptionDetail>(
    `/earnings/redemptions/${encodeURIComponent(redemptionNo)}`,
  );
  return response.data;
};

/** 교환 한 건(교환 번호로). 번호가 없으면 부르지 않는다. */
export const useRedemptionDetailQuery = (redemptionNo: string | null) => {
  const authReady = useAuthReady();

  return useQuery<RedemptionDetail, AppError>({
    queryKey: earningQueryKeys.redemption(redemptionNo ?? ""),
    queryFn: () => getRedemptionDetail(redemptionNo as string),
    enabled: authReady && redemptionNo !== null,
  });
};
