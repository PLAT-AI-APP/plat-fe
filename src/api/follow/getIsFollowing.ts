"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useUserStore } from "@/store/useUserStore";
import { followQueryKeys } from "./queryKeys";

interface FollowStatusResponse {
  following: boolean;
}

/**
 * 내가 이 사용자를 팔로우 중인지 서버에 한 번에 묻는다(GET /follow/{userId}/status, 로그인 필요).
 * 예전에는 팔로잉 목록을 100명씩 끝까지 훑어 찾았다.
 */
const getIsFollowing = async (targetUserId: string) => {
  const { data } = await authAxios.get<FollowStatusResponse>(
    `/follow/${targetUserId}/status`,
  );

  return data.following;
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
