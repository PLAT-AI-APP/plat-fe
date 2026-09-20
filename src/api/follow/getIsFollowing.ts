"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useUserStore } from "@/store/useUserStore";
import type { FollowPageResponse } from "./followPage";
import { followQueryKeys } from "./queryKeys";

/** 서버가 받아 주는 size 상한(PageParams.MAX_SIZE). 한 번에 많이 받아 요청 횟수를 줄인다. */
const FOLLOWING_SCAN_PAGE_SIZE = 100;
/** hasNext 가 계속 true 로 오는 비정상 응답에서 끝없이 돌지 않게 하는 안전장치(최대 10,000명). */
const FOLLOWING_SCAN_MAX_PAGES = 100;

/**
 * 내 팔로잉 목록을 훑어 대상이 있는지 본다.
 *
 * 서버에 "이 사용자를 팔로우 중인가"를 한 번에 묻는 API 가 아직 없어서 목록 조회로 대신한다.
 * 찾으면 바로 멈추므로 팔로잉이 100명 이하면 요청은 한 번이다.
 * TODO: 공개 프로필 응답이나 전용 엔드포인트에 팔로우 여부가 생기면 이 훅만 그쪽으로 바꾼다.
 */
const getIsFollowing = async (targetUserId: string) => {
  for (let page = 0; page < FOLLOWING_SCAN_MAX_PAGES; page += 1) {
    const { data } = await authAxios.get<FollowPageResponse>(
      "/follow/following",
      { params: { page, size: FOLLOWING_SCAN_PAGE_SIZE } },
    );

    if (data.content.some((user) => user.userId === targetUserId)) return true;
    if (!data.page.hasNext) return false;
  }

  return false;
};

/**
 * 내가 이 사용자를 팔로우 중인지. 프로필 페이지의 팔로우 버튼 상태가 된다.
 *
 * 비로그인이거나 내 프로필이면 묻지 않는다(isFollowing 은 undefined). isLoading 은
 * "로그인은 했는데 내 정보가 아직 안 와서 물을 수 없는" 구간도 포함한다 — 그때 버튼을
 * "팔로우"로 그렸다가 "팔로잉"으로 뒤집으면 잘못된 상태가 잠깐 보이기 때문이다.
 */
export const useIsFollowingQuery = (targetUserId: string) => {
  const isAuthenticated = useAuthReady();
  const viewerId = useUserStore((state) => state.user?.id);

  const isOwnProfile = Boolean(viewerId) && viewerId === targetUserId;
  const enabled =
    isAuthenticated && Boolean(viewerId) && !isOwnProfile && Boolean(targetUserId);

  const query = useQuery<boolean, AppError>({
    queryKey: followQueryKeys.status(viewerId ?? "", targetUserId),
    queryFn: () => getIsFollowing(targetUserId),
    enabled,
    // 다른 기기에서 바꾼 팔로우도 방문할 때 반영되도록 오래 캐시하지 않는다.
    staleTime: 1000 * 30,
  });

  return {
    isFollowing: query.data,
    isLoading: query.isLoading || (isAuthenticated && !viewerId),
  };
};
