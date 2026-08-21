"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface UserRecommendCreator {
  creatorId: string;
  nickname: string;
}

export interface UserRecommendItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: UserRecommendCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
}

interface GetUserRecommendParams {
  page?: number;
  size?: number;
}

const getUserRecommend = async ({
  lang,
  page = 0,
  size = 10,
}: GetUserRecommendParams & { lang: string }) => {
  const response = await authAxios.get<UserRecommendItem[]>(
    "/home/user-recommend",
    {
      params: {
        lang,
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 홈 화면 사용자 맞춤 추천 목록 조회 */
export const useUserRecommendQuery = (params: GetUserRecommendParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<UserRecommendItem[], AppError>({
    queryKey: ["get-user-recommend", lang, params.page, params.size],
    queryFn: () => getUserRecommend({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
