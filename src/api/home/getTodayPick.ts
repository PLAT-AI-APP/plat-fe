"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";
import type { BaseCard, CardCreator } from "@/type/card";

export type TodayPickCreator = CardCreator;

export type TodayPickItem = BaseCard;

interface GetTodayPickParams {
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getTodayPick = async ({
  page = 0,
  size = 10,
  tendency = "ALL",
}: GetTodayPickParams) => {
  const response = await authAxios.get<TodayPickItem[]>("/home/today-pick", {
    params: {
      tendency,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 오늘의 PICK 목록 조회 */
export const useTodayPickQuery = (params: GetTodayPickParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<TodayPickItem[], AppError>({
    queryKey: ["get-today-pick", locale, tendency, params.page, params.size],
    queryFn: () => getTodayPick({ ...params, tendency }),
  });
};
