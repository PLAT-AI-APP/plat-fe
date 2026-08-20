"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
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

const getTodayPick = async ({
  lang,
  page = 0,
  size = 10,
}: GetTodayPickParams & { lang: string }) => {
  const response = await authAxios.get<TodayPickItem[]>("/home/today-pick", {
    params: {
      lang,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 오늘의 PICK 목록 조회 */
export const useTodayPickQuery = (params: GetTodayPickParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<TodayPickItem[], AppError>({
    queryKey: ["get-today-pick", lang, params.page, params.size],
    queryFn: () => getTodayPick({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
