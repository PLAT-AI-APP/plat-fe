"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFollowMutation } from "@/api/follow/postFollow";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { followQueryKeys } from "@/api/follow/queryKeys";

interface UseFollowToggleOptions {
  /** 팔로우 대상. */
  userId: string;
  /** 서버가 준 현재 상태. 낙관적 값이 없을 때 이 값을 쓴다. */
  isFollowing: boolean;
  /**
   * 이 토글로 숫자가 함께 변하는 다른 사용자들. 프로필 화면처럼
   * 대상과 나의 카운트가 동시에 움직이는 경우에 넘긴다.
   */
  alsoInvalidateUserIds?: readonly (string | undefined)[];
  /**
   * 팔로우 여부가 실려 있는 다른 캐시. 캐릭터 상세처럼 응답 안에
   * creator.isFollowing 이 함께 오는 화면이 이걸 넘긴다.
   */
  extraInvalidateKeys?: readonly (readonly unknown[])[];
}

/**
 * 팔로우 / 언팔로우 토글.
 *
 * 같은 코드가 검색 결과 카드, 프로필 헤더, 캐릭터 상세 사이드바, 팔로우
 * 모달 네 곳에 복사돼 있었다. 네 벌 모두 낙관적 값을 로컬 state 로 들고,
 * 실패하면 되돌리고, 같은 캐시 키 세 개를 손으로 적어 무효화했다.
 *
 * 낙관적 표시를 남기는 이유: 팔로우는 누른 즉시 반응해야 하는데 서버 왕복을
 * 기다리면 버튼이 굳은 것처럼 보인다. 실패하면 원래대로 되돌린다.
 * (실패 사실 자체는 전역 토스트가 알린다 — 변경은 화면에 실패를 담을 자리가
 * 없는 쪽이라 토스트가 맞다.)
 */
export const useFollowToggle = ({
  userId,
  isFollowing: serverIsFollowing,
  alsoInvalidateUserIds,
  extraInvalidateKeys,
}: UseFollowToggleOptions) => {
  const queryClient = useQueryClient();
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState<
    boolean | null
  >(null);

  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();

  const isPending = isFollowMutating || isUnFollowMutating;
  const isFollowing = optimisticIsFollowing ?? serverIsFollowing;

  const invalidate = () => {
    const userIds = [userId, ...(alsoInvalidateUserIds ?? [])].filter(
      (id): id is string => Boolean(id),
    );

    userIds.forEach((id) => {
      queryClient.invalidateQueries({ queryKey: followQueryKeys.count(id) });
    });
    queryClient.invalidateQueries({
      queryKey: followQueryKeys.followingList(),
    });
    queryClient.invalidateQueries({ queryKey: followQueryKeys.followerList() });

    extraInvalidateKeys?.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey: [...queryKey] });
    });
  };

  const toggle = () => {
    if (isPending) return;

    const next = !isFollowing;
    setOptimisticIsFollowing(next);

    const mutation = next ? follow : unFollow;
    mutation(
      { userId },
      {
        onSuccess: invalidate,
        // 되돌릴 때 !next 가 아니라 이전 값을 그대로 쓴다.
        onError: () => setOptimisticIsFollowing(isFollowing),
      },
    );
  };

  return { isFollowing, isPending, toggle };
};
