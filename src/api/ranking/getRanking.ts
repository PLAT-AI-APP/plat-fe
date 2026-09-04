"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

/** 백엔드 StatPeriod. 실시간은 오늘 0시부터 지금까지고 1분마다 갱신됩니다. */
export type RankingPeriod = "REALTIME" | "DAILY" | "WEEKLY" | "MONTHLY";
/** 대화량순 / 찜순 */
export type RankingSort = "CHAT" | "LIKE";
/** 전체 랭킹 / 신작 랭킹 */
export type RankingScope = "ALL" | "NEW";
/** 순위 등락. 신작 랭킹은 직전 스냅샷이 없어 내려오지 않습니다. */
export type RankTrend = "NEW" | "UP" | "DOWN" | "SAME";

export interface RankedCardCreator {
  creatorId: string;
  nickname: string;
}

export interface RankedCardItem {
  rank: number;
  score: number;
  trend: RankTrend | null;
  card: {
    universeId: string;
    images: string[];
    title: string;
    description: string;
    creator: RankedCardCreator;
    chatCount: number;
    isNew: boolean;
    isOfficial: boolean;
  };
}

interface GetRankingParams {
  period?: RankingPeriod;
  sort?: RankingSort;
  scope?: RankingScope;
  tendency?: Tendency;
  page?: number;
  size?: number;
}

/** 랭킹은 보는 사람에 따라 달라지지 않아 인증을 태우지 않는다. */
const getRanking = async ({
  period = "REALTIME",
  sort = "CHAT",
  scope = "ALL",
  tendency = "ALL",
  page = 0,
  size = 24,
}: GetRankingParams) => {
  const response = await axiosInstance.get<PageWith<RankedCardItem>>(
    "/ranking",
    { params: { period, sort, scope, tendency, page, size } },
  );

  return response.data;
};

/** 랭킹·신작 랭킹 조회. 로그인하지 않아도 볼 수 있습니다. */
export const useRankingQuery = (params: GetRankingParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<PageWith<RankedCardItem>, AppError>({
    queryKey: [
      "get-ranking",
      locale,
      tendency,
      params.period,
      params.sort,
      params.scope,
      params.page,
      params.size,
    ],
    queryFn: () => getRanking({ ...params, tendency }),
    // 실시간 랭킹이 1분마다 갱신되므로 그보다 짧게 잡을 이유가 없습니다.
    staleTime: 1000 * 60,
  });
};
