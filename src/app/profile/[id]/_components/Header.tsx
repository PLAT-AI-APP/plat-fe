"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useFollowCountQuery } from "@/api/follow/getFollowCount";
import type { UserProfile } from "@/api/user/getUserProfile";
import { useFollowToggle } from "@/hooks/follow/useFollowToggle";
import useToggle from "@/hooks/common/useToggle";
import ProfileActionPopover from "@/components/popover/ProfileActionPopover";
import { Dots } from "@/icons";
import { cn, formatWithCommas } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

interface HeaderProps {
  userId: string;
  /** 아직 불러오는 중이면 undefined. 실패는 이 컴포넌트를 그리기 전에 부모가 처리한다. */
  profile?: UserProfile;
}

interface StatItemProps {
  label: string;
  /**
   * 아직 모르는 값(불러오는 중이거나 실패)은 undefined 를 넘긴다.
   * 0 으로 바꿔 놓으면 "팔로워가 0명" 이라는 사실과 구별되지 않는다.
   */
  value: number | string | undefined;
  onClick?: () => void;
}

/** 값을 모를 때 자리를 지키는 표시. 0 이라고 단언하지 않는다. */
const UNKNOWN_STAT = "—";

const StatItem = ({ label, value, onClick }: StatItemProps) => {
  const content = (
    <>
      <span className="body-3 text-font-2">{label}</span>
      <span className="title-3 text-font-1">
        {value === undefined ? UNKNOWN_STAT : formatWithCommas(value)}
      </span>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex items-center gap-2 text-font-2 hover:text-font-1">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-font-2 hover:text-font-1"
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

const Header = ({ userId, profile }: HeaderProps) => {
  const t = useTranslations();
  const { data: followCount } = useFollowCountQuery(userId);
  // 기본값 0 을 주지 않는다. 못 불러온 것과 0 명인 것은 다른 사실이다.
  const { followerCount, followingCount } = followCount ?? {};
  const openModal = useModalStore((state) => state.openModal);
  const user = useUserStore((state) => state.user);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const {
    isOpen: isActionPopoverOpen,
    toggle: toggleActionPopover,
    close: closeActionPopover,
  } = useToggle();
  const actionTriggerRef = useRef<HTMLButtonElement>(null);

  const isOwnProfile = user?.id === userId;
  // 로그인한 내 정보(user)가 아니라 이 페이지 유저의 프로필을 그린다. 남의 프로필에서 내 닉네임이 뜨던 문제.
  const isProfileLoading = !profile;
  const nickname = profile?.nickname || t("profile.defaultName");
  const bio = profile?.bio ?? "";
  const chatCount = 0;

  const {
    isFollowing,
    isPending: isFollowPending,
    toggle: handleFollowToggle,
  } = useFollowToggle({
    // 이 화면은 아직 서버에서 팔로우 여부를 받아오지 않는다. 팔로우 카운트만
    // 조회하고 있어, 처음에는 "팔로우 안 함"으로 두고 누른 뒤부터 반영한다.
    userId,
    isFollowing: false,
  });

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
      className="flex w-full max-w-(--content-max-width) flex-col gap-5"
    >
      <section id="profile-info-summary" className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {isProfileLoading ? (
              <div className="skeleton size-[68px] shrink-0 rounded-full" />
            ) : (
              <Image
                src={profile.profileImageUrl || "/p1.png"}
                alt="프로필 이미지"
                width={68}
                height={68}
                // 백엔드 이미지 호스트가 remotePatterns 에 없으면 next/image 가 렌더 단계에서 던진다.
                unoptimized
                className="size-[68px] shrink-0 rounded-full bg-card-hover object-cover"
              />
            )}

            <div className="flex min-w-0 items-center gap-1">
              {isProfileLoading ? (
                // title-1 한 줄 높이(20px × 1.35)에 맞춰 이름이 들어올 때 줄이 튀지 않게 한다.
                <div className="skeleton h-[27px] w-32 rounded-full" />
              ) : (
                <h1 className="title-1 min-w-0 truncate text-font-1">
                  {nickname}
                </h1>
              )}

              {/* 차단 확인 다이얼로그가 닉네임을 보여 주므로 불러온 뒤에만 연다. */}
              {!isOwnProfile && !isProfileLoading && (
                <div className="relative flex size-6 shrink-0 items-center justify-center">
                  <button
                    ref={actionTriggerRef}
                    type="button"
                    aria-label={t("profile.moreMenu")}
                    aria-expanded={isActionPopoverOpen}
                    onClick={toggleActionPopover}
                    className="flex size-6 items-center justify-center text-font-2 transition-colors hover:text-font-1"
                  >
                    <Dots className="size-6 rotate-90" aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {isActionPopoverOpen && (
                      <ProfileActionPopover
                        triggerRef={actionTriggerRef}
                        onClose={closeActionPopover}
                        onShare={handleShareProfile}
                        onBlock={() =>
                          openDialog("USER_BLOCK", {
                            nickname,
                            onConfirm: handleBlockConfirm,
                          })
                        }
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={handleProfileEdit}
              className="title-5 flex h-11 w-fit items-center justify-center text-nowrap rounded-2xl border border-card-hover bg-dark px-4 text-font-1 hover:bg-btn-hover"
            >
              {t("profile.editProfile")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={isFollowPending}
              className={cn(
                "title-3 flex h-11 items-center justify-center rounded-2xl px-4 py-2.5",
                isFollowing ? "bg-main text-font-1" : "bg-font-1 text-dark",
                isFollowPending && "pending-state",
              )}
            >
              {isFollowing ? t("profile.following") : t("profile.follow")}
            </button>
          )}
        </div>

        <nav className="body-3 flex items-center gap-1.5 whitespace-nowrap">
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
        <p className="body-5 w-full whitespace-pre-line text-font-2">{bio}</p>
      )}
    </header>
  );
};

export default Header;
