"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useFollowCountQuery } from "@/api/follow/getFollowCount";
import { useFollowMutation } from "@/api/follow/postFollow";
import ProfileActionPopover from "@/components/popover/ProfileActionPopover";
import { Dots } from "@/icons";
import { cn, formatWithCommas } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

interface HeaderProps {
  userId: string;
}

interface StatItemProps {
  label: string;
  value: number | string;
  onClick?: () => void;
}

const StatItem = ({ label, value, onClick }: StatItemProps) => {
  const content = (
    <>
      <span className="body-2 text-font-2">{label}</span>
      <span className="title-3 text-font-1">{formatWithCommas(value)}</span>
    </>
  );

  if (!onClick) {
    return <div className="flex items-center gap-[7px]">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[7px]"
    >
      {content}
    </button>
  );
};

const StatDivider = () => (
  <span className="title-3 text-font-disabled" aria-hidden="true">
    ·
  </span>
);

const Header = ({ userId }: HeaderProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { data: followCount } = useFollowCountQuery(userId);
  const { followerCount = 0, followingCount = 0 } = followCount ?? {};
  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const { mutate: follow, isPending: isFollowMutating } = useFollowMutation();
  const { mutate: unFollow, isPending: isUnFollowMutating } =
    useUnFollowMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useState<
    boolean | null
  >(null);
  const [isActionPopoverOpen, setIsActionPopoverOpen] = useState(false);
  const actionTriggerRef = useRef<HTMLButtonElement>(null);

  const isOwnProfile = user?.id === userId;
  const profileImage = user?.profileImage;
  const nickname = user?.nickname || t("profile.defaultName");
  const bio = user?.bio || "";
  const chatCount = 0;
  const isFollowPending = isFollowMutating || isUnFollowMutating;
  const isFollowing = optimisticIsFollowing ?? false;

  const invalidateFollowQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["get-follow-count", userId] });
    queryClient.invalidateQueries({ queryKey: ["get-following-list"] });
    queryClient.invalidateQueries({ queryKey: ["get-follower-list"] });
  };

  const openFollowModal = (tab: "followers" | "following") => {
    // 팔로워/팔로잉 목록은 본인만 볼 수 있으므로 타인 프로필에서는 모달을 열지 않습니다.
    if (!isOwnProfile) {
      return;
    }

    openModal("FOLLOW", {
      activeTab: tab,
      userId,
      nickname,
      isOwnProfile,
    });
  };

  const handleProfileEdit = () => {
    openModal("PROFILE_EDIT");
  };

  const handleFollowToggle = () => {
    if (isFollowPending) return;

    if (isFollowing) {
      setOptimisticIsFollowing(false);
      unFollow(
        { userId },
        {
          onSuccess: invalidateFollowQueries,
          onError: () => setOptimisticIsFollowing(true),
        },
      );
      return;
    }

    setOptimisticIsFollowing(true);
    follow(
      { userId },
      {
        onSuccess: invalidateFollowQueries,
        onError: () => setOptimisticIsFollowing(false),
      },
    );
  };

  const handleShareProfile = () => {
    if (typeof window === "undefined") {
      return;
    }

    // 공유 API가 아직 없어서 현재 프로필 주소를 복사하는 최소 동작으로 유지합니다.
    void navigator.clipboard?.writeText(window.location.href);
  };

  const handleBlockConfirm = () => {
    closeDialog();
  };

  return (
    <header
      id="profile-header"
      className="flex w-full max-w-[1200px] flex-col gap-5"
    >
      <section id="profile-info-summary" className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src={profileImage || "/p1.png"}
              alt="프로필 이미지"
              width={68}
              height={68}
              className="size-[68px] shrink-0 rounded-full bg-card-hover object-cover"
            />

            <div className="flex min-w-0 items-center gap-1">
              <h1 className="title-1 min-w-0 truncate text-font-1">
                {nickname}
              </h1>

              {!isOwnProfile && (
                <div className="relative flex size-6 shrink-0 items-center justify-center">
                  <button
                    ref={actionTriggerRef}
                    type="button"
                    aria-label={t("profile.moreMenu")}
                    aria-expanded={isActionPopoverOpen}
                    onClick={() => setIsActionPopoverOpen((prev) => !prev)}
                    className="flex size-6 items-center justify-center text-font-2 transition-colors hover:text-font-1"
                  >
                    <Dots className="size-6 rotate-90" aria-hidden="true" />
                  </button>

                  {isActionPopoverOpen && (
                    <ProfileActionPopover
                      triggerRef={actionTriggerRef}
                      onClose={() => setIsActionPopoverOpen(false)}
                      onShare={handleShareProfile}
                      onBlock={() =>
                        openDialog("USER_BLOCK", {
                          nickname,
                          onConfirm: handleBlockConfirm,
                        })
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={handleProfileEdit}
              className="title-3 w-fit text-nowrap flex h-12 items-center justify-center rounded-2xl border border-card-hover bg-dark px-4 py-3 text-font-1"
            >
              {t("profile.editProfile")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={isFollowPending}
              className={cn(
                "title-3 flex h-11 items-center justify-center rounded-[20px] px-4 py-2.5",
                isFollowing
                  ? "bg-main text-font-1"
                  : "bg-font-1 text-dark",
                isFollowPending && "cursor-wait opacity-70",
              )}
            >
              {isFollowing ? t("profile.following") : t("profile.follow")}
            </button>
          )}
        </div>

        <nav className="body-2 flex items-center gap-1.5 whitespace-nowrap">
          <StatItem
            label={t("profile.followers")}
            value={followerCount}
            onClick={
              isOwnProfile ? () => openFollowModal("followers") : undefined
            }
          />
          <StatDivider />
          <StatItem
            label={t("profile.followingTab")}
            value={followingCount}
            onClick={
              isOwnProfile ? () => openFollowModal("following") : undefined
            }
          />
          <StatDivider />
          <StatItem label={t("profile.chatCount")} value={chatCount} />
        </nav>
      </section>

      {bio && (
        <p className="body-4 w-full whitespace-pre-line text-font-2">{bio}</p>
      )}
    </header>
  );
};

export default Header;
