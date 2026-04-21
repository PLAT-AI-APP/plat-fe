"use client";
import React, { useState } from "react";
import Image from "next/image";
import ProfileEditModal from "@/components/modal/ProfileEditModal";
import { FollowModal } from "@/components/modal/FollowModal";
import { useUserStore } from "@/store/useUserStore";
import { ArrowRight } from "@/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Header = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const [isProfileEditodal, setIsProfileEditodal] = useState(false);
  const [isFollowModal, setIsFollowModal] = useState(false);

  const toggleIsProfileEditodal = () => {
    setIsProfileEditodal((prev) => !prev);
  };

  const toggleIsFollowModal = () => {
    setIsFollowModal((prev) => !prev);
  };

  const profileImage = useUserStore((state) => state.user?.profileImage);
  const nickname = useUserStore((state) => state.user?.nickname);
  const bio = useUserStore((state) => state.user?.bio);

  return (
    <header
      id="profile-header"
      className="flex justify-between items-center gap-4 w-full"
    >
      <section id="profile-info-summary" className="flex flex-col gap-4">
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
                  onClick={toggleIsFollowModal}
                  className="flex gap-1 text-sm cursor-pointer"
                  type="button"
                >
                  <span className="text-font-2">팔로워</span>
                  <span>12</span>
                </button>
                <button
                  onClick={toggleIsFollowModal}
                  className="flex gap-1 text-sm cursor-pointer"
                  type="button"
                >
                  <span className="text-font-2">팔로잉</span>
                  <span>1,232</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <p className="text-sm text-font-2">{bio}</p>
      </section>

      <Link
        href={`/profile/${id}`}
        onClick={toggleIsProfileEditodal}
        type="button"
        className="inline p-1 w-fit h-fit rounded-lg hover:bg-btn-hover"
      >
        <ArrowRight className="w-4 h-4 text-font-2" />
      </Link>

      {/* 모달 레이어 */}
      {isProfileEditodal && (
        <ProfileEditModal onClose={toggleIsProfileEditodal} />
      )}
      {isFollowModal && <FollowModal onClose={toggleIsFollowModal} />}
    </header>
  );
};

export default Header;
