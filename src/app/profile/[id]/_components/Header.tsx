import React from "react";
import Image from "next/image";
import { useFollowCountQuery } from "@/api/follow/getFollowCount";
import { useModalStore } from "@/store/useModalStore";
import { useUserStore } from "@/store/useUserStore";

interface HeaderProps {
  userId: string;
}

interface StatItemProps {
  label: string;
  value: number | string;
  onClick?: () => void;
  disabled?: boolean;
}

const formatCount = (value: number | string) =>
  typeof value === "number" ? new Intl.NumberFormat("ko-KR").format(value) : value;

const StatItem = ({ label, value, onClick, disabled = false }: StatItemProps) => {
  const content = (
    <>
      <span className="body-2 text-font-2">{label}</span>
      <span className="title-3 text-font-1">{formatCount(value)}</span>
    </>
  );

  if (!onClick) {
    return <div className="flex items-center gap-[7px]">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-[7px] disabled:cursor-default"
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
  const { data: followCount } = useFollowCountQuery(userId);
  const { followerCount = 0, followingCount = 0 } = followCount ?? {};

  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const isOwnProfile = user?.id === userId;

  const profileImage = user?.profileImage;
  const nickname = user?.nickname || "이름";
  const bio = user?.bio || "";
  const chatCount = 0;

const openFollowModal = (tab: "followers" | "following") => {
    openModal("FOLLOW", {
      activeTab: tab,
      userId,
      nickname,
      isOwnProfile,
    });
  };

  const handleProfileEditBtn = () => {
    if (!isOwnProfile) return;

    openModal("PROFILE_EDIT");
  };

  return (
    <header id="profile-header" className="flex w-full max-w-[1200px] flex-col gap-5">
      <section id="profile-info-summary" className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src={profileImage || "/p1.png"}
              alt="프로필 이미지"
              width={68}
              height={68}
              className="size-[68px] shrink-0 rounded-full bg-[#d9d9d9] object-cover"
            />

            <h1 className="title-1 min-w-0 max-w-[346px] truncate text-font-1">
              {nickname}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleProfileEditBtn}
            disabled={!isOwnProfile}
            className="title-3 flex h-12 shrink-0 items-center justify-center rounded-2xl border border-card-hover bg-bg-dark px-4 text-font-1 disabled:cursor-default"
          >
            프로필 수정
          </button>
        </div>

        <nav className="body-2 flex items-center gap-1.5 whitespace-nowrap">
          <StatItem
            label="팔로워"
            value={followerCount}
            onClick={() => openFollowModal("followers")}
          />
          <StatDivider />
          <StatItem
            label="팔로잉"
            value={followingCount}
            onClick={() => openFollowModal("following")}
          />
          <StatDivider />
          <StatItem label="대화량" value={chatCount} />
        </nav>
      </section>

      {bio && (
        <p className="body-4 w-full whitespace-pre-line text-font-2">{bio}</p>
      )}
    </header>
  );
};

export default Header;
