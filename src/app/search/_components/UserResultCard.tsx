"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useFollowMutation } from "@/api/follow/postFollow";
import { cn } from "@/lib/utils";
import DefaultAvatar from "./DefaultAvatar";

export interface SearchUserResult {
  userId: string;
  nickname: string;
  followerCount: number;
  chatVolumeLabel: string;
  isFollowing: boolean;
}

interface UserResultCardProps {
  user: SearchUserResult;
}

const UserResultCard = ({ user }: UserResultCardProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState<
    boolean | null
  >(null);
  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();
  const isFollowPending = isFollowMutating || isUnFollowMutating;
  const isFollowing = optimisticIsFollowing ?? user.isFollowing;

  const invalidateFollowQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-follow-count", user.userId],
    });
    queryClient.invalidateQueries({ queryKey: ["get-following-list"] });
    queryClient.invalidateQueries({ queryKey: ["get-follower-list"] });
  };

  const handleFollowToggle = () => {
    if (isFollowPending) return;

    if (isFollowing) {
      setOptimisticIsFollowing(false);
      unFollow(
        { userId: user.userId },
        {
          onSuccess: invalidateFollowQueries,
          onError: () => setOptimisticIsFollowing(true),
        },
      );
      return;
    }

    setOptimisticIsFollowing(true);
    follow(
      { userId: user.userId },
      {
        onSuccess: invalidateFollowQueries,
        onError: () => setOptimisticIsFollowing(false),
      },
    );
  };

  return (
    <div className="flex w-[389px] shrink-0 flex-col items-start rounded-2xl bg-btn-hover px-5 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <DefaultAvatar className="relative size-12 shrink-0 overflow-hidden rounded-full" />

          <div className="flex flex-col items-start justify-center gap-1">
            <span className="title-4 text-font-1">@{user.nickname}</span>
            <div className="body-5 flex items-start gap-1 text-font-disabled">
              <span>
                {t("searchResults.followerCount", {
                  count: user.followerCount,
                })}
              </span>
              <span>·</span>
              <span>
                {t("searchResults.chatVolume", { value: user.chatVolumeLabel })}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFollowToggle}
          disabled={isFollowPending}
          className={cn(
            "title-6 flex w-[69px] shrink-0 cursor-pointer items-center justify-center rounded-full px-3 py-1 transition-colors",
            isFollowing ? "bg-main text-font-1" : "bg-font-1 text-dark",
            isFollowPending && "cursor-wait opacity-70",
          )}
        >
          {isFollowing
            ? t("modalUi.common.following")
            : t("modalUi.common.follow")}
        </button>
      </div>
    </div>
  );
};

export default UserResultCard;
