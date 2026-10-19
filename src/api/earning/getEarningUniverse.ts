import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type {
  EarningUniverseDay,
  EarningUniverseSummary,
} from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getEarningUniverse = async (universeId: string) => {
  const response = await authAxios.get<EarningUniverseSummary>(
    `/earnings/universes/${universeId}`,
  );
  return response.data;
};

const getEarningUniverseDays = async (universeId: string, month: string) => {
  const response = await authAxios.get<EarningUniverseDay[]>(
    `/earnings/universes/${universeId}/days`,
    { params: { month } },
  );
  return response.data;
};

/** 캐릭터 하나의 최근 7일 · 30일 · 누적 수익 */
export const useEarningUniverseQuery = (universeId: string) => {
  const authReady = useAuthReady();

  return useQuery<EarningUniverseSummary, AppError>({
    queryKey: earningQueryKeys.universe(universeId),
    queryFn: () => getEarningUniverse(universeId),
    enabled: authReady,
  });
};

/** 캐릭터 하나의 한 달(YYYY-MM) 일별 수익 */
export const useEarningUniverseDaysQuery = (
  universeId: string,
  month: string,
) => {
  const authReady = useAuthReady();

  return useQuery<EarningUniverseDay[], AppError>({
    queryKey: earningQueryKeys.universeDays(universeId, month),
    queryFn: () => getEarningUniverseDays(universeId, month),
    enabled: authReady,
    placeholderData: keepPreviousData,
  });
};
