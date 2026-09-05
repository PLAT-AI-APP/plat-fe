"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError, PageWith } from "@/type/api";

/** 백엔드 BaseCard. 찜 목록은 전부 내가 찜한 것이라 liked 는 항상 true 로 옵니다. */
export interface LikedUniverseCard {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: {
    creatorId: string;
    nickname: string;
  };
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
  liked: boolean;
}

/** 찜/취소 후 이 목록도 다시 받아야 해서 키를 밖으로 냅니다. */
export const likedUniversesQueryKey = ["get-liked-universes"];

/** 서버 기본값과 맞춥니다. */
export const LIKED_UNIVERSE_PAGE_SIZE = 20;

const getLikedUniverses = async (page: number) => {
  const response = await authAxios.get<PageWith<LikedUniverseCard>>(
    "/users/me/likes",
    { params: { page, size: LIKED_UNIVERSE_PAGE_SIZE } },
  );

  return response.data;
};

/**
 * 내가 찜한 세계관 목록. 최근에 찜한 것부터 옵니다.
 *
 * 정렬 기준을 받지 않습니다 — 서버가 찜한 시각 역순 하나만 지원합니다.
 * 남의 찜 목록을 주는 API 는 아직 없어서 내 프로필에서만 부를 수 있습니다.
 */
export const useLikedUniversesInfiniteQuery = (enabled = true) =>
  useInfiniteQuery<PageWith<LikedUniverseCard>, AppError>({
    queryKey: likedUniversesQueryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getLikedUniverses(pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? lastPage.page.number + 1 : null,
    staleTime: 1000 * 60,
    enabled,
  });
