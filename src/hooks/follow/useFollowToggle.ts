"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFollowMutation } from "@/api/follow/postFollow";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import type { GetFollowCountResponse } from "@/api/follow/getFollowCount";
import { followQueryKeys } from "@/api/follow/queryKeys";
import { useRequireLogin } from "@/hooks/common/useRequireLogin";

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
  const requireLogin = useRequireLogin();
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState<
    boolean | null
  >(null);

  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();

  const isPending = isFollowMutating || isUnFollowMutating;
  const isFollowing = optimisticIsFollowing ?? serverIsFollowing;

  /**
   * 버튼과 함께 대상의 팔로워 수와 "내가 팔로우 중인지" 캐시도 먼저 고친다. 예전에는 버튼만 바로
   * 바뀌고 숫자는 요청과 재조회가 끝나야 따라와 둘이 잠깐 어긋나 보였다.
   *
   * "팔로우 중인지" 는 이미 답을 알고 있으므로 무효화하지 않고 값을 넣는다. 무효화하면 팔로잉
   * 목록을 100명씩 끝까지 차례로 훑는 조회(getIsFollowing)가 다시 돌았다.
   */
  const applyOptimistic = (next: boolean) => {
    queryClient.setQueryData<GetFollowCountResponse>(
      followQueryKeys.count(userId),
      (current) =>
        current && {
          ...current,
          followerCount: Math.max(current.followerCount + (next ? 1 : -1), 0),
        },
    );
    // status 키는 [루트, 보는 사람, 대상] 이다. 보는 사람은 나 하나뿐이라 대상만 맞춰 찾는다.
    queryClient.setQueriesData<boolean>(
      {
        queryKey: followQueryKeys.statuses(),
        predicate: (query) => query.queryKey[2] === userId,
      },
      next,
    );
  };

  const invalidate = () => {
    const userIds = [userId, ...(alsoInvalidateUserIds ?? [])].filter(
      (id): id is string => Boolean(id),
    );

    // 숫자는 먼저 고쳐 두었지만, 그 사이 다른 사람이 팔로우했을 수 있어 뒤에서 맞춘다.
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

    // 팔로우는 로그인이 있어야 한다. 그대로 보내면 버튼이 잠깐 "팔로잉"으로 바뀌었다가
    // 401 로 되돌아가, 눌러도 아무 일이 없는 것처럼 보이므로 로그인 창을 먼저 연다.
    if (!requireLogin()) return;

    const next = !isFollowing;
    setOptimisticIsFollowing(next);
    applyOptimistic(next);

    const mutation = next ? follow : unFollow;
    mutation(
      { userId },
      {
        onSuccess: invalidate,
        // 되돌릴 때 !next 가 아니라 이전 값을 그대로 쓴다.
        onError: () => {
          setOptimisticIsFollowing(isFollowing);
          applyOptimistic(isFollowing);
        },
      },
    );
  };

  return { isFollowing, isPending, toggle };
};
