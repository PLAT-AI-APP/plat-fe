"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
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
  page = 0,
  size = 10,
}: GetOfficialPreviewParams) => {
  const response = await authAxios.get<OfficialPreviewItem[]>(
    "/home/official-preview",
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 홈 화면 공식 캐릭터 미리보기 목록 조회 */
export const useOfficialPreviewQuery = (params: GetOfficialPreviewParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<OfficialPreviewItem[], AppError>({
    queryKey: ["get-official-preview", locale, params.page, params.size],
    queryFn: () => getOfficialPreview(params),
    staleTime: 1000 * 60 * 5,
  });
};
