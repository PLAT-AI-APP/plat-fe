"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useFollowerListQuery } from "@/api/follow/getFollowerList";
import { useFollowingListQuery } from "@/api/follow/getFollowingList";
import { useFollowMutation } from "@/api/follow/postFollow";
import { ModalLayout } from "@/components/ModalLayout";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useTabUnderline } from "@/hooks/useTabUnderline";
import { Close } from "@/icons";
import { ErrorState } from "@/components/state";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { FollowModalProps } from "@/type/modal";
import { FOLLOW_TAB_IDS, FollowTab } from "./constants";
import FollowEmptyState from "./FollowEmptyState";
import FollowUserItem from "./FollowUserItem";
import { SPRING_SNAPPY } from "@/constants/motion";

const FollowModal = ({
  onClose,
  userId,
  nickname,
  isOwnProfile = true,
  activeTab = "followers",
}: FollowModalProps) => {
  const t = useTranslations("modalUi.follow");
  const commonT = useTranslations("modalUi.common");
  const router = useRouter();
  const queryClient = useQueryClient();
  const allowNextNavigation = useModalStore(
    (state) => state.allowNextNavigation,
  );
  const [activeTabs, setActiveTabs] = useState<FollowTab>(activeTab);
  const [followChangeIds, setFollowChangeIds] = useState<string[]>([]);
  const {
    containerRef: tabNavRef,
    setTabRef,
    rect: underlineRect,
  } = useTabUnderline(activeTabs);
  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();
  const displayNickname = nickname || t("fallbackNickname");
  const isFollowPending = isFollowMutating || isUnFollowMutating;

  const invalidateFollowQueries = useCallback(
    (targetUserId?: string) => {
      queryClient.invalidateQueries({ queryKey: ["get-following-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-follower-list"] });
      queryClient.invalidateQueries({
        queryKey: ["get-follow-count", userId],
      });

      if (!targetUserId) return;

      queryClient.invalidateQueries({
        queryKey: ["get-follow-count", targetUserId],
      });
    },
    [queryClient, userId],
  );

  const toggleFollowChangeId = useCallback((targetUserId: string) => {
    setFollowChangeIds((prev) =>
      prev.includes(targetUserId)
        ? prev.filter((id) => id !== targetUserId)
        : [...prev, targetUserId],
    );
  }, []);

  useEffect(() => {
    return () => {
      invalidateFollowQueries();
    };
  }, [invalidateFollowQueries]);

  const ulRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = 0;
    }
  }, [activeTabs]);

  const followingQuery = useFollowingListQuery(activeTabs === "following");
  const followerQuery = useFollowerListQuery(activeTabs === "followers");
  const activeQuery =
    activeTabs === "following" ? followingQuery : followerQuery;

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
    if (isFollowPending) return;

    toggleFollowChangeId(targetUserId);

    const mutationOptions = {
      onSuccess: () => invalidateFollowQueries(targetUserId),
      onError: () => toggleFollowChangeId(targetUserId),
    };

    if (isFollowing) {
      unFollow({ userId: targetUserId }, mutationOptions);
      return;
    }

    follow({ userId: targetUserId }, mutationOptions);
  };

  const handleFollowEmptyProfile = () => {
    if (isFollowPending) return;

    follow(
      { userId },
      {
        onSuccess: () => invalidateFollowQueries(userId),
      },
    );
  };

  const moveWithModalClose = (href: string) => {
    allowNextNavigation();
    onClose();
    router.push(href);
  };

  const tabTitles = {
    followers: t("followers"),
    following: t("following"),
  } as const;

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-112.5 overflow-hidden p-5"
    >
      <header className="mb-8 flex items-center justify-between">
        <nav
          ref={tabNavRef as React.RefObject<HTMLElement>}
          className="relative flex gap-1"
        >
          {FOLLOW_TAB_IDS.map((tabId) => (
            <button
              type="button"
              key={tabId}
              ref={(el) => setTabRef(tabId, el)}
              onClick={() => setActiveTabs(tabId)}
              className={cn(
                "body-2 translate-y-0.5 cursor-pointer px-5 py-2.5 text-font-disabled",
                activeTabs === tabId && "title-3 text-font-1",
              )}
            >
              {tabTitles[tabId]}
            </button>
          ))}

          <motion.span
            className="absolute bottom-0 h-0.5 bg-brand"
            initial={false}
            animate={{ x: underlineRect.left, width: underlineRect.width }}
            transition={SPRING_SNAPPY}
          />
        </nav>

        <button
          type="button"
          onClick={onClose}
          aria-label={commonT("close")}
          className="flex size-6 items-center justify-center rounded-lg hover:bg-btn-hover"
        >
          <Close className="size-5" />
        </button>
      </header>

      {activeQuery.isLoading ? (
        <ul className="flex h-95 flex-col gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="flex w-full items-center gap-3 rounded-2xl p-3"
            >
              <div className="skeleton size-[45px] shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="skeleton h-4 w-28 rounded-full" />
                <div className="skeleton h-3 w-40 rounded-full" />
              </div>
              <div className="skeleton h-7 w-24 shrink-0 rounded-full" />
            </li>
          ))}
        </ul>
      ) : activeQuery.isError ? (
        // 불러오지 못한 것과 진짜로 아무도 없는 것은 다르다.
        // 예전에는 실패해도 "팔로워가 없습니다"가 떠서 사용자가 잘못된 결론을 내렸다.
        <ErrorState
          error={activeQuery.error}
          onRetry={activeQuery.refetch}
          className="h-95"
        />
      ) : listData.length === 0 ? (
        <FollowEmptyState
          activeTab={activeTabs}
          isOwnProfile={isOwnProfile}
          nickname={displayNickname}
          onCreateCharacter={() => moveWithModalClose("/character-creat")}
          onExploreCharacter={() => moveWithModalClose("/")}
          onFollow={handleFollowEmptyProfile}
        />
      ) : (
        <ul
          ref={ulRef}
          className="custom-scrollbar flex h-95 flex-col gap-1 overflow-y-auto"
        >
          {listData.map((user) => {
            const isToggled = followChangeIds.includes(user.userId);
            const baseIsFollowing = activeTabs === "following";
            const isFollowing = isToggled ? !baseIsFollowing : baseIsFollowing;

            return (
              <FollowUserItem
                key={user.userId}
                user={user}
                isFollowing={isFollowing}
                isPending={isFollowPending}
                onToggleFollow={handleToggleFollow}
              />
            );
          })}

          <li className="py-0.5 text-center">
            <div ref={targetRef}>
              {activeQuery.isFetchingNextPage ? (
                <span
                  className="mx-auto block size-4 animate-spin rounded-full border border-main border-t-brand"
                  aria-label={commonT("loadingMore")}
                >
                  <span className="sr-only">{commonT("loadingMore")}</span>
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
