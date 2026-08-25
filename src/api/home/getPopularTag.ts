"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface PopularTagCreator {
  creatorId: string;
  nickname: string;
}

export interface PopularTagItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: PopularTagCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
}

interface GetPopularTagParams {
  page?: number;
  size?: number;
}

const getPopularTag = async ({
  lang,
  page = 0,
  size = 10,
}: GetPopularTagParams & { lang: string }) => {
  const response = await authAxios.get<PopularTagItem[]>("/home/popular-tag", {
    params: {
      lang,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 인기 태그 캐릭터 모음 목록 조회 */
export const usePopularTagQuery = (params: GetPopularTagParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<PopularTagItem[], AppError>({
    queryKey: ["get-popular-tag", lang, params.page, params.size],
    queryFn: () => getPopularTag({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
