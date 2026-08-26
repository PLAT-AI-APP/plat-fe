"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface TodayPickCreator {
  creatorId: string;
  nickname: string;
}

export interface TodayPickItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: TodayPickCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
}

interface GetTodayPickParams {
  page?: number;
  size?: number;
}

const getTodayPick = async ({ page = 0, size = 10 }: GetTodayPickParams) => {
  const response = await authAxios.get<TodayPickItem[]>("/home/today-pick", {
    params: {
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

  return useQuery<TodayPickItem[], AppError>({
    queryKey: ["get-today-pick", locale, params.page, params.size],
    queryFn: () => getTodayPick(params),
    staleTime: 1000 * 60 * 5,
  });
};
