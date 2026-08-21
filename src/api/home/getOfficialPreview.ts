"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface OfficialPreviewScenario {
  episodeNo: number;
  title: string;
  content: string;
}

export interface OfficialPreviewItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  tags: string[];
  chatCount: number;
  remainingFreeChatCount: number;
  scenarios: OfficialPreviewScenario[];
}

interface GetOfficialPreviewParams {
  page?: number;
  size?: number;
}

const getOfficialPreview = async ({
  lang,
  page = 0,
  size = 10,
}: GetOfficialPreviewParams & { lang: string }) => {
  const response = await authAxios.get<OfficialPreviewItem[]>(
    "/home/official-preview",
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

/** 홈 화면 공식 캐릭터 미리보기 목록 조회 */
export const useOfficialPreviewQuery = (params: GetOfficialPreviewParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<OfficialPreviewItem[], AppError>({
    queryKey: ["get-official-preview", lang, params.page, params.size],
    queryFn: () => getOfficialPreview({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
