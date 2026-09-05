"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, SliceWith } from "@/type/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

/** 백엔드 BaseCard. 랭킹·카테고리 검색과 같은 모양입니다. */
export interface AllCharacterCreator {
  creatorId: string;
  nickname: string;
}

export interface AllCharacterItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: AllCharacterCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
  /** 로그인하지 않았으면 항상 false */
  liked: boolean;
}

interface GetAllCharactersParams {
  tendency?: Tendency;
  page?: number;
  size?: number;
}

const getAllCharacters = async (
  { page = 0, size = 24, tendency = "ALL" }: GetAllCharactersParams,
  authenticated: boolean,
) => {
  // 로그인 상태면 찜 여부가 채워져 내려오므로 토큰을 실어 보냅니다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<SliceWith<AllCharacterItem>>("/home/all", {
    params: { tendency, page, size },
  });

  return response.data;
};

/** 전체 캐릭터 모음. 조건 없이 누적 대화 수 순으로 내려오고 로그인 없이도 볼 수 있습니다. */
export const useAllCharactersQuery = (params: GetAllCharactersParams = {}) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const authenticated = isAuthReady && isLoggedIn;
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<SliceWith<AllCharacterItem>, AppError>({
    queryKey: [
      "get-all-characters",
      locale,
      authenticated,
      tendency,
      params.page,
      params.size,
    ],
    queryFn: () => getAllCharacters({ ...params, tendency }, authenticated),
    // 로그인 여부가 정해지기 전에 부르면 찜 여부 없는 응답이 캐시에 남습니다.
    enabled: isAuthReady,
  });
};
