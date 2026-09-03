"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

/** 직전 갱신 대비 순위 등락. 이번에 처음 올라온 검색어는 NEW 입니다. */
export type SearchTermTrend = "NEW" | "UP" | "DOWN" | "SAME";

export interface PopularSearchTerm {
  rank: number;
  keyword: string;
  /** 최근 24시간 검색 수 */
  count: number;
  trend: SearchTermTrend;
}

const getPopularSearchTerms = async (size: number) => {
  const response = await axiosInstance.get<PopularSearchTerm[]>(
    "/search/popular-terms",
    { params: { size } },
  );

  return response.data;
};

/**
 * 실시간 인기 검색어. 서버가 1분마다 스냅샷을 다시 만들므로 그보다 자주 물어도
 * 같은 값이 옵니다. 결과가 0건이던 검색은 애초에 집계되지 않아 여기 오르지 않습니다.
 */
export const usePopularSearchTermsQuery = (size = 10) => {
  return useQuery<PopularSearchTerm[], AppError>({
    queryKey: ["get-popular-search-terms", size],
    queryFn: () => getPopularSearchTerms(size),
    staleTime: 1000 * 60,
  });
};
