"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface NewWorkCreator {
  creatorId: string;
  nickname: string;
}

export interface NewWorkItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: NewWorkCreator;
  chatCount: number;
}

interface GetNewWorkParams {
  page?: number;
  size?: number;
}

const getNewWork = async ({
  lang,
  page = 0,
  size = 10,
}: GetNewWorkParams & { lang: string }) => {
  const response = await authAxios.get<NewWorkItem[]>("/home/new-work", {
    params: {
      lang,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 신작 목록 조회 */
export const useNewWorkQuery = (params: GetNewWorkParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<NewWorkItem[], AppError>({
    queryKey: ["get-new-work", lang, params.page, params.size],
    queryFn: () => getNewWork({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
