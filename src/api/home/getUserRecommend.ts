"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";
import { useAuthStore } from "@/store/useAuthStore";

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
  UserRecommendItem[] | UserRecommendSliceResponse | "";

/** SliceWith 래핑/204 빈 응답을 모두 배열로 정규화 */
const getNormalizedUserRecommend = (
  data: UserRecommendApiResponse,
): UserRecommendItem[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;

  return [];
};

interface GetUserRecommendParams {
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getUserRecommend = async ({
  page = 0,
  size = 10,
  tendency = "ALL",
}: GetUserRecommendParams) => {
  const response = await authAxios.get<UserRecommendApiResponse>(
    "/home/user-recommend",
    {
      params: {
        tendency,
        page,
        size,
      },
    },
  );

  return getNormalizedUserRecommend(response.data);
};

/*
 * MVP 에서 화면을 내린 섹션이라 지금은 부르는 곳이 없다. 서버도 같은 이유로 경로를 떼어 뒀으므로
 * 지금 부르면 404 다 — 섹션을 다시 열 때 서버 경로와 함께 되살린다.
 */
/** 홈 화면 사용자 맞춤 추천 목록 조회. 로그인 필수 API라 비로그인 상태에선 401 재시도 낭비 없이 아예 호출하지 않습니다. */
export const useUserRecommendQuery = (params: GetUserRecommendParams = {}) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery<UserRecommendItem[], AppError>({
    queryKey: [
      "get-user-recommend",
      locale,
      tendency,
      params.page,
      params.size,
    ],
    queryFn: () => getUserRecommend({ ...params, tendency }),
    enabled: isAuthReady && isLoggedIn,
  });
};
