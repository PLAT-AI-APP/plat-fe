"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

/** 대화량순=누적 대화 수, 최신순=등록순. 서버 CategorySort 와 같은 값입니다. */
export type CategorySort = "CHAT" | "LATEST";

/** 서버가 태그를 최대 5개까지만 받습니다(초과하면 400). 태그 사이드바의 선택 상한과 같은 값입니다. */
export const MAX_CATEGORY_TAGS = 5;

export interface CategoryCardCreator {
  creatorId: string;
  nickname: string;
}

/** 백엔드 BaseCard. 랭킹·찜 목록과 같은 모양입니다. */
export interface CategoryCardItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: CategoryCardCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
  /** 로그인하지 않았으면 항상 false */
  liked: boolean;
}

interface GetCategorySearchParams {
  /** 고른 태그 id. 고른 것을 전부 가진 세계관만 나오므로 더할수록 결과가 좁아집니다. */
  tagIds?: string[];
  sort?: CategorySort;
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getCategorySearch = async (
  {
    tagIds = [],
    sort = "CHAT",
    tendency = "ALL",
    page = 0,
    size = 24,
  }: GetCategorySearchParams,
  authenticated: boolean,
) => {
  // 로그인 상태면 찜 여부가 채워져 내려오므로 토큰을 실어 보냅니다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<PageWith<CategoryCardItem>>(
    "/search/category",
    {
      params: {
        // 서버는 반복 파라미터도 받지만, 축약 표기(tagIds=1,2)가 URL 을 짧게 만듭니다.
        ...(tagIds.length > 0 ? { tagIds: tagIds.join(",") } : {}),
        sort,
        tendency,
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 카테고리(태그) 검색. 태그를 하나도 안 고르면 조건 없이 전체가 내려옵니다. */
export const useCategorySearchQuery = (
  params: GetCategorySearchParams = {},
) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const authenticated = isAuthReady && isLoggedIn;
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);
  const tagIds = params.tagIds ?? [];

  return useQuery<PageWith<CategoryCardItem>, AppError>({
    queryKey: [
      "get-category-search",
      locale,
      authenticated,
      tendency,
      // 고른 순서가 달라도 같은 결과라 정렬해서 키를 맞춥니다.
      [...tagIds].sort().join(","),
      params.sort,
      params.page,
      params.size,
    ],
    queryFn: () => getCategorySearch({ ...params, tendency }, authenticated),
    // 로그인 여부가 정해지기 전에 부르면 찜 여부 없는 응답이 캐시에 남습니다.
    enabled: isAuthReady,
    staleTime: 1000 * 60,
  });
};
