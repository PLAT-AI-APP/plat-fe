"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import ProfileImg from "../../../public/p1.png";
import Link from "next/link";
import { Logout, Persona, Star, User } from "@/icons";
import { ModalLayout } from "../ModalLayout";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const tabArray = [
    { name: "프로필 설정", link: "/profile", icon: User },
    { name: "내 페르소나", link: "/persona", icon: Persona },
    { name: "토큰 충전", link: "/charge", icon: Star },
  ];

  const triggerRef = useRef<HTMLImageElement>(null);

  return (
    <div className="relative text-nowrap w-10 h-10">
      <Image
        ref={triggerRef}
        src={ProfileImg}
        alt="profile image"
        className="w-full h-full cursor-pointer shrink-0"
        onClick={handleToggle}
      />

      {isActive && (
        <ModalLayout
          triggerRef={triggerRef || null}
          onClose={() => setIsActive(false)}
          className="top-full right-0 w-60 translate-y-2.5 z-10 px-2 py-3 rounded-xl"
        >
          <div className="p-2 flex gap-3">
            <Image src={ProfileImg} alt="profile image" className="w-10 h-10" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-font-1 font-medium">
                내혹한춤꾼
              </span>
              <span className="text-xs font-bold text-font-2">1100 토큰</span>
            </div>
          </div>

          <hr className="text-border-main pb-2.5 mt-2.5" />
          {tabArray.map((tab) => {
            const Icon = tab.icon; // 컴포넌트로 할당 (대문자 시작 필수)
            return (
              <Link
                key={tab.name}
                href={tab.link}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-2 hover:text-font-1 text-sm font-medium"
              >
                <Icon
                  size={18}
                  strokeWidth={0.5}
                  className={cn(
                    "shrink-0 stroke-font-2",
                    tab.name === "토큰 충전" && "fill-none",
                  )}
                />
                {tab.name}
              </Link>
            );
          })}
          <hr className="text-border-main pb-2.5 mt-2.5" />

          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-card-hover transition-colors text-font-2 hover:text-font-1 text-sm font-medium"
          >
            <Logout size={18} className="text-font-2 shrink-0" />
            로그아웃
          </Link>
        </ModalLayout>
      )}
    </div>
  );
};

export default Profile;
