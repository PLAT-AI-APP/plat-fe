import React, { useState } from "react";
import Image from "next/image";
import ProfileEditModal from "@/components/modal/ProfileEditModal";
import { FollowModal } from "@/components/modal/FollowModal";

const Header = () => {
  const [isProfileEditodal, setIsProfileEditodal] = useState(true);
  const [isFollowModal, setIsFollowModal] = useState(false);

  const toggleIsProfileEditodal = () => {
    setIsProfileEditodal((prev) => !prev);
  };

  const toggleIsFollowModal = () => {
    setIsFollowModal((prev) => !prev);
  };

  return (
    <header id="profile-header" className="flex flex-col gap-4">
      <section id="profile-info-summary" className="flex justify-between">
        <div className="flex gap-5.25">
          <aside className="shrink-0">
            <Image
              src={"/p1.png"}
              alt="프로필 이미지"
              width={60}
              height={60}
              className="rounded-full w-15 h-15"
            />
          </aside>

          <div className="flex flex-col">
            <h1 className="text-lg font-medium">고리타분한멸치</h1>

            <nav className="flex gap-4">
              <button
                onClick={toggleIsFollowModal}
                className="flex gap-1 text-sm cursor-pointer"
                type="button"
              >
                <span className="text-font-2">팔로워</span>
                <strong>12</strong>
              </button>
              <button
                onClick={toggleIsFollowModal}
                className="flex gap-1 text-sm cursor-pointer"
                type="button"
              >
                <span className="text-font-2">팔로잉</span>
                <strong>1,232</strong>
              </button>
            </nav>
          </div>
        </div>

        <button
          onClick={toggleIsProfileEditodal}
          type="button"
          className="h-fit px-4 py-2 text-sm bg-bg-darkest rounded-xl border border-border-main"
        >
          프로필 수정
        </button>
      </section>

      <p className="text-sm text-font-2">
        어쩌구저쩌구 자기소개ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ·
      </p>

      {/* 모달 레이어 */}
      {isProfileEditodal && (
        <ProfileEditModal onClose={toggleIsProfileEditodal} />
      )}
      {isFollowModal && <FollowModal onClose={toggleIsFollowModal} />}
    </header>
  );
};

export default Header;
