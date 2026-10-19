import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type {
  EarningUniverseListResponse,
  UniverseEarningSort,
} from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

export interface EarningUniversesParams {
  sort: UniverseEarningSort;
  direction: "DESC" | "ASC";
  /** 엔터 · 검색 버튼으로 확정한 검색어. 빈 문자열이면 전체 */
  keyword: string;
  /** 0부터 */
  page: number;
  size: number;
}

const getEarningUniverses = async ({
  keyword,
  ...params
}: EarningUniversesParams) => {
  const response = await authAxios.get<EarningUniverseListResponse>(
    "/earnings/universes",
    { params: { ...params, keyword: keyword || undefined } },
  );
  return response.data;
};

/** 캐릭터별 수익(어제 · 7일 · 30일 · 누적). 정렬 · 쪽을 바꿀 때 새 쪽이 올 때까지 이전 쪽을 둔다. */
export const useEarningUniversesQuery = (params: EarningUniversesParams) => {
  const authReady = useAuthReady();

  return useQuery<EarningUniverseListResponse, AppError>({
    queryKey: earningQueryKeys.universeList(params),
    queryFn: () => getEarningUniverses(params),
    enabled: authReady,
    placeholderData: keepPreviousData,
  });
};
