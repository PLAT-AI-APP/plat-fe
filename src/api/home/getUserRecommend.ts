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

/** 선호 태그 근거가 있을 때만 SliceWith로 감싸져 내려오고, 없으면 204(빈 문자열)로 내려옵니다. */
interface UserRecommendSliceResponse {
  content?: UserRecommendItem[];
}

type UserRecommendApiResponse =
  | UserRecommendItem[]
  | UserRecommendSliceResponse
  | "";

/** SliceWith 래핑/204 빈 응답을 모두 배열로 정규화 */
const getNormalizedUserRecommend = (
  data: UserRecommendApiResponse,
): UserRecommendItem[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;

  return [];
};

interface GetUserRecommendParams {
  page?: number;
  size?: number;
}

const getUserRecommend = async ({
  lang,
  page = 0,
  size = 10,
}: GetUserRecommendParams & { lang: string }) => {
  const response = await authAxios.get<UserRecommendApiResponse>(
    "/home/user-recommend",
    {
      params: {
        lang,
        page,
        size,
      },
    },
  );

  return getNormalizedUserRecommend(response.data);
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
