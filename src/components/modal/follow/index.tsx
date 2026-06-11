"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useFollowerListQuery } from "@/api/follow/getFollowerList";
import { useFollowingListQuery } from "@/api/follow/getFollowingList";
import { useFollowMutation } from "@/api/follow/postFollow";
import { ModalLayout } from "@/components/ModalLayout";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Close } from "@/icons";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { FollowModalProps } from "@/type/modal";
import { FOLLOW_TABS, FollowTab } from "./constants";
import FollowEmptyState from "./FollowEmptyState";
import FollowUserItem from "./FollowUserItem";

const FollowModal = ({
  onClose,
  userId,
  nickname = "이 유저",
  isOwnProfile = true,
  activeTab = "followers",
}: FollowModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const allowNextNavigation = useModalStore(
    (state) => state.allowNextNavigation,
  );
  const [activeTabs, setActiveTabs] = useState<FollowTab>(activeTab);
  const [followChangeIds, setFollowChangeIds] = useState<string[]>([]);
  const { mutate: follow } = useFollowMutation();
  const { mutate: unFollow } = useUnFollowMutation();

  // 모달에서 팔로우 상태를 바꿀 수 있으므로 닫힐 때 관련 목록/카운트를 갱신합니다.
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["get-following-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-follower-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-follow-count", userId] });
    };
  }, [queryClient, userId]);

  const ulRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = 0;
    }
  }, [activeTabs]);

  // 현재 선택된 탭의 query만 활성화해서 불필요한 API 호출을 막습니다.
  const followingQuery = useFollowingListQuery(activeTabs === "following");
  const followerQuery = useFollowerListQuery(activeTabs === "followers");
  const activeQuery =
    activeTabs === "following" ? followingQuery : followerQuery;

  // useInfiniteQuery의 page 구조를 리스트 렌더링에 쓰기 쉬운 1차원 배열로 평탄화합니다.
  const listData = useMemo(
    () => activeQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [activeQuery.data],
  );

  const { targetRef } = useIntersectionObserver({
    onIntersect: activeQuery.fetchNextPage,
    enabled: !!activeQuery.hasNextPage && !activeQuery.isFetchingNextPage,
    rootMargin: "200px",
  });

  const handleToggleFollow = (targetUserId: string, isFollowing: boolean) => {
    // 서버 응답 전에도 버튼 상태가 즉시 바뀌어 보이도록 로컬 토글 목록을 둡니다.
    setFollowChangeIds((prev) =>
      prev.includes(targetUserId)
        ? prev.filter((id) => id !== targetUserId)
        : [...prev, targetUserId],
    );

    if (isFollowing) {
      unFollow({ userId: targetUserId });
      return;
    }

    follow({ userId: targetUserId });
  };

  const moveWithModalClose = (href: string) => {
    // 모달 내부 CTA 이동은 navigation guard에 막히지 않도록 1회성 이동 허용을 소비합니다.
    allowNextNavigation();
    onClose();
    router.push(href);
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground={true}
      className="w-112.5 overflow-hidden p-5"
    >
      <header className="mb-8 flex items-center justify-between">
        <nav className="flex gap-1">
          {FOLLOW_TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTabs(tab.id)}
              className={cn(
                "body-2 translate-y-0.5 cursor-pointer px-7.25 py-2.75 text-font-disabled",
                activeTabs === tab.id &&
                  "title-3 border-b-2 border-brand text-font-1",
              )}
            >
              {tab.title}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onClose}
          className="flex size-6 items-center justify-center rounded-lg hover:bg-btn-hover"
          aria-label="닫기"
        >
          <Close className="size-5" />
        </button>
      </header>

      {activeQuery.isLoading ? (
        <div className="body-4 flex h-95 items-center justify-center text-font-2">
          로딩 중...
        </div>
      ) : listData.length === 0 ? (
        <FollowEmptyState
          activeTab={activeTabs}
          isOwnProfile={isOwnProfile}
          nickname={nickname}
          onCreateCharacter={() => moveWithModalClose("/character-creat")}
          onExploreCharacter={() => moveWithModalClose("/")}
          onFollow={() => follow({ userId })}
        />
      ) : (
        <ul
          ref={ulRef}
          className="custom-scrollbar flex h-95 flex-col gap-1 overflow-y-auto"
        >
          {listData.map((user) => {
            const isToggled = followChangeIds.includes(user.userId);
            const isFollowing =
              activeTabs === "followers" ? isToggled : !isToggled;

            return (
              <FollowUserItem
                key={user.userId}
                user={user}
                isFollowing={isFollowing}
                onToggleFollow={handleToggleFollow}
              />
            );
          })}

          <li className="py-0.5 text-center">
            <div ref={targetRef}>
              {activeQuery.isFetchingNextPage ? (
                <span className="body-6 animate-pulse text-font-2">
                  목록을 가져오는 중...
                </span>
              ) : activeQuery.hasNextPage ? (
                <div className="h-4" />
              ) : null}
            </div>
          </li>
        </ul>
      )}
    </ModalLayout>
  );
};

export default FollowModal;
