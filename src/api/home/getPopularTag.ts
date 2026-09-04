"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

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
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getPopularTag = async ({
  page = 0,
  size = 10,
  tendency = "ALL",
}: GetPopularTagParams) => {
  const response = await authAxios.get<PopularTagItem[]>("/home/popular-tag", {
    params: {
      tendency,
      page,
      size,
    },
  });

  return response.data;
};

/** 홈 화면 인기 태그 캐릭터 모음 목록 조회 */
export const usePopularTagQuery = (params: GetPopularTagParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<PopularTagItem[], AppError>({
    queryKey: ["get-popular-tag", locale, tendency, params.page, params.size],
    queryFn: () => getPopularTag({ ...params, tendency }),
    staleTime: 1000 * 60 * 5,
  });
};
