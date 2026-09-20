"use client";
import Image from "next/image";
import { Ref } from "react";
import { useTranslations } from "next-intl";

interface ProfileProps {
  triggerRef: Ref<HTMLImageElement | null> | undefined;
  handleToggle: () => void;
  profileImg: string;
}
const Profile = ({ triggerRef, handleToggle, profileImg }: ProfileProps) => {
  const t = useTranslations("profilePopover");

  return (
    <div className="relative text-nowrap w-8 h-8">
      <Image
        ref={triggerRef}
        src={profileImg || ""}
        alt={t("profileImageAlt")}
        width={32}
        height={32}
        className="w-full h-full cursor-pointer rounded-full shrink-0"
        onClick={handleToggle}
      />
    </div>
  );
};

export default Profile;
