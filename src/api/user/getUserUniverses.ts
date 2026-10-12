"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError, PageWith } from "@/type/api";
import { getNextPageNumber } from "@/lib/pagination";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import type { LikableCard } from "@/type/card";
import { useAdultMode } from "@/hooks/data/useAdultAccess";
import { userQueryKeys } from "./queryKeys";

/** 백엔드 BaseCard. 로그인 없이 조회 가능하고, 그때는 liked가 전부 false로 옵니다. */
export type UserUniverseCard = LikableCard;

/** 서버 기본값과 맞춥니다. */
export const USER_UNIVERSE_PAGE_SIZE = 20;

const getUserUniverses = async (
  userId: string,
  page: number,
  authenticated: boolean,
  own: boolean,
) => {
  // 내 목록은 비공개·검수 중인 것까지 받는 본인 전용 엔드포인트를 쓴다.
  const client = own || authenticated ? authAxios : axiosInstance;
  const response = await client.get<PageWith<UserUniverseCard>>(
    own ? "/users/me/universes" : `/users/${userId}/universes`,
    { params: { page, size: USER_UNIVERSE_PAGE_SIZE } },
  );

  return response.data;
};

/**
 * 특정 사용자가 만든 세계관 목록. 프로필의 캐릭터 탭이 그립니다.
 *
 * 남의 프로필은 노출 가능한 것만 주는 /users/{userId}/universes 로 — 로그인 없이도 조회할 수 있고,
 * 그때는 liked가 전부 false로 옵니다. 내 프로필은 /users/me/universes 로 공개 여부·검수 상태와
 * 상관없이 내가 만든 것을 전부 받습니다.
 */
export const useUserUniversesInfiniteQuery = (
  userId?: string,
  enabled = true,
  own = false,
) => {
  const authenticated = useAuthReady();
  const isAuthChecked = useAuthStore((state) => state.isAuthReady);
  // 성인 세계관을 목록에 섞을지(19 토글·성인인증)도 응답을 바꾼다.
  const adultMode = useAdultMode();

  return useInfiniteQuery<PageWith<UserUniverseCard>, AppError>({
    queryKey: [...userQueryKeys.universes(userId), authenticated, adultMode, own],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getUserUniverses(userId ?? "", pageParam as number, authenticated, own),
    getNextPageParam: getNextPageNumber,
    staleTime: 1000 * 60,
    // 인증 확인 전에 먼저 받으면, 확인이 끝나 키가 바뀔 때 처음부터 다시 로딩한다.
    enabled: Boolean(userId) && enabled && isAuthChecked && (!own || authenticated),
  });
};
