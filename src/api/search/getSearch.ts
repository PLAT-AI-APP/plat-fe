"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocaleStore } from "@/store/useLocaleStore";

/**
 * 검색어 최소 길이. 서버도 같은 값으로 막습니다(SearchPolicy.MIN_KEYWORD_LENGTH).
 * 한 글자는 걸리는 것이 너무 많아 고르는 데 도움이 되지 않습니다.
 */
export const SEARCH_MIN_KEYWORD_LENGTH = 2;

/** 보낼 수 있는 검색어인지. 앞뒤 여백은 길이에서 빼고 셉니다. */
export const isSearchableKeyword = (keyword: string) =>
  keyword.trim().length >= SEARCH_MIN_KEYWORD_LENGTH;

export interface SearchCardCreator {
  creatorId: string;
  nickname: string;
}

/** 캐릭터·세계관 결과가 같은 모양이라 카드 컴포넌트를 그대로 공유합니다. */
export interface SearchCardItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: SearchCardCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
}

export interface SearchUserItem {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  followerCount: number;
  /** 그 유저가 만든 세계관들의 대화 수 합계 */
  chatCount: number;
  /** 로그인하지 않았으면 항상 false */
  following: boolean;
}

export interface SearchResponse {
  characters: PageWith<SearchCardItem>;
  universes: PageWith<SearchCardItem>;
  users: PageWith<SearchUserItem>;
}

interface GetSearchParams {
  q: string;
  page?: number;
  size?: number;
}

const getSearch = async (
  { q, page = 0, size = 9 }: GetSearchParams,
  authenticated: boolean,
) => {
  // 로그인 상태면 팔로우 여부가 채워져 내려오므로 토큰을 실어 보냅니다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<SearchResponse>("/search", {
    params: { q, page, size },
  });

  return response.data;
};

/**
 * 키워드 검색. 캐릭터·세계관·유저를 한 번에 받아 화면이 탭으로 나눠 그립니다.
 *
 * 서버가 이 요청 한 번을 검색어 집계로 세므로, 탭을 옮길 때마다 다시 부르면
 * 같은 검색이 여러 번 집계됩니다. 그래서 탭 전환은 받아 둔 결과를 거르기만 합니다.
 */
export const useSearchQuery = (params: GetSearchParams) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const authenticated = isAuthReady && isLoggedIn;
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<SearchResponse, AppError>({
    queryKey: ["get-search", locale, authenticated, params.q, params.page, params.size],
    queryFn: () => getSearch(params, authenticated),
    // 짧은 검색어는 서버가 400 으로 돌려보내므로 아예 보내지 않습니다.
    enabled: isSearchableKeyword(params.q) && isAuthReady,
    staleTime: 1000 * 60,
  });
};
