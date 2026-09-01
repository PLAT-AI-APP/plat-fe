"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProfileEditModal from "@/components/modal/ProfileEditModal";
import { ArrowRight } from "@/icons";
import { useUserStore } from "@/store/useUserStore";

interface HeaderProps {
  id: string;
}

const Header = ({ id }: HeaderProps) => {
  const t = useTranslations("studio");
  const [isProfileEditModal, setIsProfileEditModal] = useState(false);
  const profileImage = useUserStore((state) => state.user?.profileImage);
  const nickname = useUserStore((state) => state.user?.nickname);
  const bio = useUserStore((state) => state.user?.bio);

  const toggleProfileEditModal = () => {
    setIsProfileEditModal((prev) => !prev);
  };

  return (
    <header
      id="profile-header"
      className="flex w-full items-center justify-between gap-4"
    >
      <section id="profile-info-summary" className="flex flex-col gap-4">
        <div className="flex gap-5">
          <aside className="shrink-0">
            <Image
              src={profileImage || "/public/p1.png"}
              alt={t("profileImageAlt")}
              width={60}
              height={60}
              className="h-15 w-15 rounded-full"
            />
          </aside>

          <div className="flex items-start gap-6">
            <div className="flex flex-col">
              <h1 className="title-2">{nickname}</h1>
            </div>
          </div>
        </div>

        <p className="body-4 text-font-2">{bio}</p>
      </section>

      <Link
        href={`/profile/${id}`}
        onClick={toggleProfileEditModal}
        className="inline h-fit w-fit rounded-lg p-1 transition-colors hover:bg-btn-hover"
      >
        <ArrowRight className="h-4 w-4 text-font-2" />
      </Link>

      {isProfileEditModal && (
        <ProfileEditModal onClose={toggleProfileEditModal} />
      )}
    </header>
  );
};

export default Header;
