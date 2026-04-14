import React, { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Headphone,
  Logout,
  Megaphone,
  Persona,
  Setting,
} from "@/icons";
import { useLogoutMutation } from "@/api/auth/logout";
import { useAuthStore } from "@/store/useAuthStore";
import Melody from "@/icons/Melody";
import TendencySettingModal from "./TendencySettingModal";

const activityArray = [
  { name: "내 페르소나", link: "/persona", icon: Persona },
  { name: "콘텐츠 설정", icon: Setting },
];
const supportArray = [
  { name: "공지사항", link: "/customer-service", icon: Megaphone },
  { name: "고객센터", link: "/customer-service", icon: Headphone },
];
interface ProfileModalProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const ProfileModal = ({ onClose, triggerRef }: ProfileModalProps) => {
  const { mutate: logout } = useLogoutMutation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // isLoggedIn이 false일 때 "내 페르소나"를 필터링
  const filteredActivityArray = activityArray.filter((item) => {
    if (item.name === "내 페르소나") {
      return isLoggedIn; // 로그인 상태일 때만 true 반환하여 포함시킴
    }
    return true; // 나머지 아이템은 항상 표시
  });

  const [isModal, setIsModal] = useState(false);
  const toggleIsModal = () => {
    setIsModal((prev) => !prev);
  };
  return (
    <ModalLayout
      triggerRef={triggerRef || null}
      onClose={onClose}
      className="w-60"
    >
      <Link
        href={"/profile/1"}
        className="flex p-2 items-center justify-between hover:bg-btn-hover rounded-lg cursor-pointer"
      >
        {isLoggedIn ? (
          <div className="flex gap-3">
            <Image
              src={"/p1.png"}
              alt="profile image"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-font-1">내혹한춤꾼</span>
              <span className="flex items-center gap-0.5 text-sm text-font-1">
                <Melody className="w-4 h-4" /> 1100
              </span>
            </div>
          </div>
        ) : (
          <Link href={"/login"} onClick={onClose} className="py-2 text-font-2">
            로그인을 해주세요.
          </Link>
        )}

        <ArrowRight className="w-2.5 h-2.5 text-font-disabled" />
      </Link>

      <hr className="text-border-main pb-2.5 mt-2.5" />

      <h3 className="pb-1.5 pl-2.5 text-xs text-font-2 font-medium">활동</h3>
      {filteredActivityArray.map((tab) => {
        const Icon = tab.icon;

        // 경로 이동용 tab이 아니라면
        if (!tab.link)
          return (
            <div
              key={tab.name}
              onClick={tab.name === "콘텐츠 설정" ? toggleIsModal : undefined}
              className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-1 hover:text-font-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <Icon
                  size={18}
                  strokeWidth={0.5}
                  className={cn("shrink-0  text-font-2")}
                />
                {tab.name}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[13px] text-font-1">남성향</span>
                <ArrowRight className="w-2.5 h-2.5 text-font-disabled" />
              </div>

              {isModal && <TendencySettingModal onClose={toggleIsModal} />}
            </div>
          );

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-1 hover:text-font-1 text-sm"
          >
            <div className="flex items-center gap-2">
              <Icon
                size={18}
                strokeWidth={0.5}
                className={cn("shrink-0  text-font-2")}
              />
              {tab.name}
            </div>
          </Link>
        );
      })}

      <hr className="text-border-main pb-2.5 mt-2.5" />

      <h3 className="pb-1.5 pl-2.5 text-xs text-font-2 font-medium">
        문의 및 설정
      </h3>
      {supportArray.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.link}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-1 hover:text-font-1 text-sm"
          >
            <Icon
              size={18}
              strokeWidth={0.5}
              className={cn("shrink-0  text-font-2")}
            />
            {tab.name}
          </Link>
        );
      })}

      {isLoggedIn && (
        <>
          <hr className="text-border-main pb-2.5 mt-2.5" />
          <div
            onClick={() => logout()}
            className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-card-hover transition-colors text-font-1 hover:text-font-1 text-sm"
          >
            <Logout size={18} className="text-font-2 shrink-0" />
            로그아웃
          </div>
        </>
      )}
    </ModalLayout>
  );
};

export default ProfileModal;
