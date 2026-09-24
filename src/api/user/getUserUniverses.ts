"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import type { LikableCard } from "@/type/card";
import { userQueryKeys } from "./queryKeys";

/** 백엔드 BaseCard. 로그인 없이 조회 가능하고, 그때는 liked가 전부 false로 옵니다. */
export type UserUniverseCard = LikableCard;

/** 서버 기본값과 맞춥니다. */
export const USER_UNIVERSE_PAGE_SIZE = 20;

const getUserUniverses = async (
  userId: string,
  page: number,
  authenticated: boolean,
) => {
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<PageWith<UserUniverseCard>>(
    `/users/${userId}/universes`,
    { params: { page, size: USER_UNIVERSE_PAGE_SIZE } },
  );

  return response.data;
};

/**
 * 특정 사용자가 만든 세계관 목록. 프로필의 캐릭터 탭이 그립니다.
 *
 * 본인 프로필이든 남의 프로필이든 같은 엔드포인트(/users/{userId}/universes)로
 * 처리됩니다 — 로그인 없이도 조회할 수 있고, 그때는 liked가 전부 false로 옵니다.
 */
export const useUserUniversesInfiniteQuery = (
  userId?: string,
  enabled = true,
) => {
  const authenticated = useAuthReady();
  const isAuthChecked = useAuthStore((state) => state.isAuthReady);

  return useInfiniteQuery<PageWith<UserUniverseCard>, AppError>({
    queryKey: [...userQueryKeys.universes(userId), authenticated],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getUserUniverses(userId ?? "", pageParam as number, authenticated),
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60,
    // 인증 확인 전에 먼저 받으면, 확인이 끝나 키가 바뀔 때 처음부터 다시 로딩한다.
    enabled: Boolean(userId) && enabled && isAuthChecked,
  });
};
