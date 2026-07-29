"use client";

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
import Check from "@/icons/Check";
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { PopoverLayout } from "./layout";
import { useRouter } from "next/navigation";
import useToggle from "@/hooks/useToggle";
import { useModalStore } from "@/store/useModalStore";
import useRouteEffect from "@/hooks/useRouteEffect";
import Token from "@/icons/Token";
import { useTranslations } from "next-intl";

interface ProfilePopoverProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

interface ActivityTab {
  name: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  link?: string;
  onClick?: () => void;
  hasTendencyOptions?: boolean;
}

const ProfilePopover = ({ onClose, triggerRef }: ProfilePopoverProps) => {
  const t = useTranslations("profilePopover");
  const selectorT = useTranslations("selector");
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { openModal } = useModalStore();
  const tendency = useToggle();

  const supportArray = [
    { name: t("notice"), link: "/notification", icon: Megaphone },
    {
      name: t("customerService"),
      link: "/customer-service",
      icon: Headphone,
    },
  ];
  const tendencyArray = [
    { name: selectorT("all"), color: "#AA8BD8" },
    { name: selectorT("male"), color: "#60A5FA" },
    { name: selectorT("female"), color: "#F472B6" },
  ];

  const handlePersonaModalOpen = () => {
    onClose();
    openModal("PERSONA");
  };

  const activityArray: ActivityTab[] = [
    {
      name: t("persona"),
      icon: Persona,
      onClick: handlePersonaModalOpen,
    },
    {
      name: t("contentSettings"),
      icon: Setting,
      onClick: tendency.toggle,
      hasTendencyOptions: true,
    },
  ];

  // 로그인 상태가 아닐 때는 개인화 기능으로 이어지는 항목을 숨깁니다.
  const filteredActivityArray = activityArray.filter((item) => {
    if (item.name === t("persona")) {
      return isLoggedIn;
    }
    return true;
  });

  const [currentTendency, setCurrentTendency] =
    useState<(typeof tendencyArray)[number]["name"]>(selectorT("all"));

  const handleCurrentTendency = (name: string) => {
    setCurrentTendency(name);
    tendency.toggle();
  };

  const loginModalBtnRef = useRef(null);
  const loginModal = useToggle();

  const handleLoginBtn = (name: "KAKAO" | "GOOGLE" | "LOGIN") => {
    if (name === "LOGIN") {
      openModal("LOGIN", {
        triggerRef,
      });
      return;
    }

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("prevPath", currentPath);
    }

    window.location.href =
      name === "KAKAO"
        ? `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/kakao`
        : `${process.env.NEXT_PUBLIC_BASE_URI}/oauth2/authorization/google`;
  };

  const handleProfilePopoverClose = () => {
    // 로그인 모달이 열려 있으면 배경 클릭이 부모 팝오버까지 닿지 않게 막습니다.
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

  useRouteEffect(onClose);

  return (
    <PopoverLayout
      triggerRef={triggerRef}
      onClose={handleProfilePopoverClose}
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
              alt={t("profileImageAlt")}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <span className="title-5 text-font-1">{nickname}</span>
              <span className="flex items-center gap-0.5 body-4 text-font-1">
                <Token className="w-4 h-4" /> 1100
              </span>
            </div>
          </div>
          <ArrowRight className="w-2.5 h-2.5 text-font-disabled" />
        </Link>
      ) : (
        <div className="p-2 flex flex-col gap-3 text-sm font-medium">
          <div
            onClick={() => handleLoginBtn("KAKAO")}
            className="flex cursor-pointer items-center justify-center relative body-4 text-center h-11.5 rounded-lg bg-[#FEE500] w-full py-2 text-bg-darkest"
          >
            <Kakao className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            {t("loginWithKakao")}
          </div>
          <div
            onClick={() => handleLoginBtn("GOOGLE")}
            className="flex cursor-pointer items-center justify-center relative body-4 text-center h-11.5 rounded-lg bg-white w-full py-2 text-black"
          >
            <Google className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            {t("loginWithGoogle")}
          </div>
          <div
            ref={loginModalBtnRef}
            onClick={() => handleLoginBtn("LOGIN")}
            className="flex cursor-pointer items-center justify-center relative body-4 text-center h-11.5 rounded-lg bg-card w-full py-2 text-font-2"
          >
            {t("loginWithOther")}
          </div>
        </div>
      )}

      <hr className="text-border-main pb-2.5 mt-2.5" />

      <h3 className="pb-1.5 pl-2.5 caption-1 text-font-2 font-medium">
        {t("activity")}
      </h3>
      {filteredActivityArray.map((tab) => {
        const Icon = tab.icon;

        if (!tab.link) {
          return (
            <div key={tab.name} onClick={tab.onClick}>
              <div className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors duration-200 ease-in-out text-font-1 hover:text-font-1">
                <div className="flex items-center gap-2 body-4">
                  <Icon
                    size={18}
                    strokeWidth={0.5}
                    className={cn("shrink-0 text-font-2")}
                  />
                  {tab.name}
                </div>

                {tab.hasTendencyOptions && (
                  <div className="flex items-center gap-1">
                    <span className="title-6 text-font-1">
                      {currentTendency}
                    </span>
                    <ArrowRight
                      className={cn(
                        "w-2.5 h-2.5 text-font-disabled",
                        tendency.isOpen && "rotate-90",
                      )}
                    />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {tab.hasTendencyOptions && tendency.isOpen && (
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col gap-1 p-2.5">
                      {tendencyArray.map(({ color, name }) => (
                        <li
                          key={name}
                          onClick={() => handleCurrentTendency(name)}
                          className="body-5 cursor-pointer flex justify-between px-3.5 py-2.5 rounded-2xl hover:bg-btn-hover transition-colors duration-200 ease-in-out"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            {name}
                          </div>

                          {currentTendency === name && (
                            <Check className="w-4 h-4 text-brand" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        return (
          <Link
            key={tab.name}
            href={tab.link}
            className="relative cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors duration-200 ease-in-out text-font-1 hover:text-font-1 text-sm"
          >
            <div className="flex items-center gap-2">
              <Icon
                size={18}
                strokeWidth={0.5}
                className={cn("shrink-0 text-font-2")}
              />
              {tab.name}
            </div>
          </Link>
        );
      })}

      <hr className="text-border-main pb-2.5 mt-2.5" />

      <h3 className="pb-1.5 pl-2.5 caption-1 text-font-2">
        {t("inquiryAndSettings")}
      </h3>
      {supportArray.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.link}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-btn-hover transition-colors text-font-1 hover:text-font-1 body-4"
          >
            <Icon
              size={18}
              strokeWidth={0.5}
              className={cn("shrink-0 text-font-2")}
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
            className="cursor-pointer flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-btn-hover transition-colors duration-200 ease-in-out text-font-1 hover:text-font-1 body-4"
          >
            <Logout size={18} className="text-font-2 shrink-0" />
            {t("logout")}
          </div>
        </>
      )}
    </PopoverLayout>
  );
};

export default ProfilePopover;
