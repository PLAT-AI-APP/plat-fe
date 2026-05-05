import React from "react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { useFollowCountQuery } from "@/api/follow/getFollowCount";
import { useModalStore } from "@/store/useModalStore";

interface HeaderProps {
  userId: string;
}
const Header = ({ userId }: HeaderProps) => {
  const { data: followCount } = useFollowCountQuery(userId);
  const { followerCount = 0, followingCount = 0 } = followCount ?? {};

  const { openModal } = useModalStore();

  // 모달을 열 때 탭 종류를 인자로 받음
  const openFollowModal = (tab: "followers" | "following") => {
    openModal("FOLLOW", { activeTab: tab, userId });
  };

  const profileImage = useUserStore((state) => state.user?.profileImage);
  const nickname = useUserStore((state) => state.user?.nickname);
  const bio = useUserStore((state) => state.user?.bio);

  const handleProfileEditBtn = () => {
    openModal("PROFILE_EDIT");
  };
  return (
    <header id="profile-header" className="flex flex-col gap-4">
      <section id="profile-info-summary" className="flex justify-between">
        <div className="flex gap-5.25">
          <aside className="shrink-0">
            <Image
              src={profileImage || "/p1.png"}
              alt="프로필 이미지"
              width={60}
              height={60}
              className="rounded-full w-15 h-15"
            />
          </aside>

          <div className="flex items-start gap-6">
            <div className="flex flex-col">
              <h1 className="text-lg font-medium">{nickname}</h1>

              <nav className="flex gap-4">
                <button
                  onClick={() => openFollowModal("followers")}
                  className="flex gap-1 text-sm cursor-pointer"
                  type="button"
                >
                  <span className="text-font-2">팔로워</span>
                  <span>{followerCount}</span>
                </button>
                <button
                  onClick={() => openFollowModal("following")}
                  className="flex gap-1 text-sm cursor-pointer"
                  type="button"
                >
                  <span className="text-font-2">팔로잉</span>
                  <span>{followingCount}</span>
                </button>
              </nav>
            </div>

            <button
              type="button"
              className="px-3.5 py-1.5 bg-font-1 text-bg-dark text-xs rounded-[100px]"
            >
              팔로우
            </button>
          </div>
        </div>

        <button
          onClick={handleProfileEditBtn}
          type="button"
          className="h-fit px-4 py-2 text-sm bg-bg-darkest rounded-xl border border-border-main"
        >
          프로필 수정
        </button>
      </section>

      <p className="text-sm text-font-2">{bio}</p>

      {/* 모달 레이어 */}
      {/* {profileEditodal.isOpen && (
        <ProfileEditModal onClose={profileEditodal.toggle} />
      )} */}
      {/* {followModal.isOpen && (
        <FollowModal
          onClose={followModal.toggle}
          userId={userId}
          activeTab={activeFollowTab}
        />
      )} */}
    </header>
  );
};

export default Header;
