import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Google,
  Headphone,
  Kakao,
  Logout,
  Megaphone,
  Persona,
  Setting,
} from "@/icons";
import { useLogoutMutation } from "@/api/auth/logout";
import { useAuthStore } from "@/store/useAuthStore";
import Melody from "@/icons/Melody";
import Check from "@/icons/Check";
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { PopoverLayout } from "./layout";
import { useRouter } from "next/navigation";
import useToggle from "@/hooks/useToggle";
import { useModalStore } from "@/store/useModalStore";

const supportArray = [
  { name: "공지사항", link: "/notification", icon: Megaphone },
  { name: "고객센터", link: "/customer-service", icon: Headphone },
];
const tendencyArray = [
  { name: "전체", color: "#AA8BD8" },
  { name: "남성향", color: "#60A5FA" },
  { name: "여성향", color: "#F472B6" },
];
interface ProfilePopoverProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const ProfilePopover = ({ onClose, triggerRef }: ProfilePopoverProps) => {
  const router = useRouter();

  const { mutate: logout } = useLogoutMutation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const tendency = useToggle();
  const activityArray = [
    { name: "내 페르소나", link: "/persona", icon: Persona },
    { name: "콘텐츠 설정", icon: Setting, onclick: tendency.toggle },
  ];

  // isLoggedIn이 false일 때 "내 페르소나"를 필터링
  const filteredActivityArray = activityArray.filter((item) => {
    if (item.name === "내 페르소나") {
      return isLoggedIn; // 로그인 상태일 때만 true 반환하여 포함시킴
    }
    return true; // 나머지 아이템은 항상 표시
  });

  const [cureentTendency, setCurrentTendency] =
    useState<(typeof tendencyArray)[number]["name"]>("전체");

  const handleCurrentTendency = (name: string) => {
    setCurrentTendency(name);
    tendency.toggle();
  };

  const loginModalBtnRef = useRef(null);
  const loginModal = useToggle();

  const { openModal } = useModalStore();

  const handleLoginBtn = (name: "KAKAO" | "GOOGLE" | "LOGIN") => {
    if (name === "LOGIN") {
      openModal("LOGIN", {
        triggerRef,
      });
      return;
    }
    window.location.href =
      process.env.NEXT_PUBLIC_BASE_URI + name === "KAKAO"
        ? "/oauth2/authorization/kakao"
        : "/oauth2/authorization/google";
  };
  const handleProfilePopoverClose = () => {
    // 로그인 모달이 켜져 있다면, 어떤 바깥 클릭이 들어와도 프로필 모달은 무시
    if (loginModal.isOpen) {
      return;
    }
    onClose();
  };

  const profileImage = useUserStore((state) => state.user?.profileImage);
  const nickname = useUserStore((state) => state.user?.nickname);
  const userId = useUserStore((state) => state.user?.id);

  const handleRouterPush = () => {
    router.push(`/profile/${userId}`);
    onClose();
  };

  return (
    <PopoverLayout
      triggerRef={triggerRef}
      onClose={handleProfilePopoverClose} // 가드 로직이 포함된 핸들러
      className="w-75 transition-colors"
    >
      {isLoggedIn ? (
        <Link
          onClick={handleRouterPush}
          href={`/profile/${userId}`}
          className="flex p-2 items-center justify-between hover:bg-btn-hover rounded-lg cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Image
              src={profileImage || "/p1.png"}
              alt="profile image"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-font-1">{nickname}</span>
              <span className="flex items-center gap-0.5 text-sm text-font-1">
                <Melody className="w-4 h-4" /> 1100
              </span>
            </div>
          </div>
          <ArrowRight className="w-2.5 h-2.5 text-font-disabled" />
        </Link>
      ) : (
        <div className="p-2 flex flex-col gap-3 text-sm font-medium">
          <div
            // href={"/login"}
            onClick={() => handleLoginBtn("KAKAO")}
            className="flex cursor-pointer items-center justify-center relative text-center h-11.5 rounded-lg bg-[#FEE500] w-full py-2 text-bg-darkest"
          >
            <Kakao className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            카카오 계정으로 시작하기
          </div>
          <div
            // href={"/login"}
            onClick={() => handleLoginBtn("GOOGLE")}
            className="flex cursor-pointer items-center justify-center relative text-center h-11.5 rounded-lg bg-white w-full py-2 text-black"
          >
            <Google className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            구글 계정으로 시작하기
          </div>
          <div
            // href={"/login"}
            ref={loginModalBtnRef}
            onClick={() => handleLoginBtn("LOGIN")}
            className="flex cursor-pointer items-center justify-center relative text-center h-11.5 rounded-lg bg-card w-full py-2 text-font-2"
          >
            {/* <Kakao className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" /> */}
            다른 방법으로 로그인하기
          </div>
        </div>
      )}

      <hr className="text-border-main pb-2.5 mt-2.5" />

      <h3 className="pb-1.5 pl-2.5 text-xs text-font-2 font-medium">활동</h3>
      {filteredActivityArray.map((tab) => {
        const Icon = tab.icon;

        // 경로 이동용 tab이 아니라면
        if (!tab.link)
          return (
            <div
              key={tab.name}
              onClick={tab.name === "콘텐츠 설정" ? tendency.toggle : undefined}
              // className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-1 hover:text-font-1 text-sm"
            >
              <div className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors duration-300 ease-in-out text-font-1 hover:text-font-1 text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    size={18}
                    strokeWidth={0.5}
                    className={cn("shrink-0  text-font-2")}
                  />
                  {tab.name}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[13px] text-font-1">
                    {cureentTendency}
                  </span>
                  <ArrowRight
                    className={cn(
                      "w-2.5 h-2.5 text-font-disabled",
                      tendency.isOpen && "rotate-90",
                    )}
                  />
                </div>
              </div>

              <AnimatePresence>
                {tendency.isOpen && (
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ height: 0, opacity: 0 }} // 시작 상태: 높이 0, 투명도 0
                    animate={{ height: "auto", opacity: 1 }} // 펼쳐진 상태: 높이 자동, 투명도 1
                    exit={{ height: 0, opacity: 0 }} // 닫힐 때 상태
                    transition={{ duration: 0.3, ease: "easeInOut" }} // 애니메이션 속도 및 곡선
                    className="overflow-hidden" // 필수: 펼쳐지는 동안 내부 내용이 가려져야 함
                  >
                    <ul className="flex flex-col gap-1 p-2.5">
                      {tendencyArray.map(({ color, name }) => (
                        <li
                          key={name}
                          onClick={() => handleCurrentTendency(name)}
                          className={cn(
                            "text-xs cursor-pointer flex justify-between px-3.5 py-2.5 rounded-2xl hover:bg-btn-hover transition-colors duration-300 ease-in-out",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2.5 h-2.5 rounded-full`}
                              style={{ backgroundColor: color }}
                            />
                            {name}
                          </div>

                          {cureentTendency === name && (
                            <Check className="w-4 h-4 text-brand" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* {isModal && <TendencySettingModal onClose={toggleIstendency} />} */}
            </div>
          );

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors duration-300 ease-in-out text-font-1 hover:text-font-1 text-sm"
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
            onClick={onClose}
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
            className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-btn-hover transition-colors duration-300 ease-in-out text-font-1 hover:text-font-1 text-sm"
          >
            <Logout size={18} className="text-font-2 shrink-0" />
            로그아웃
          </div>
        </>
      )}
    </PopoverLayout>
  );
};

export default ProfilePopover;
