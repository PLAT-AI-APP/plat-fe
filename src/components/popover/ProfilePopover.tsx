"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatWithCommas } from "@/lib/utils";
import {
  ArrowRight,
  Gear,
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
import { useWalletStore } from "@/store/useWalletStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

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
  const rootT = useTranslations();
  const selectorT = useTranslations("selector");
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);
  const tendency = useToggle();

  const supportArray = [
    { name: t("notice"), link: "/notification", icon: Megaphone },
    {
      name: t("customerService"),
      link: "/customer-service",
      icon: Headphone,
    },
    {
      name: rootT("characterDetail.tabs.settings"),
      link: "/settings",
      icon: Gear,
    },
  ];
  const tendencyArray: { value: Tendency; name: string; color: string }[] = [
    // 성별 선택 칩의 식별색. 상태색이 아니라 항목을 구분하는 고유색이라 테마와 무관하게 고정한다.
    { value: "ALL", name: selectorT("all"), color: "#AA8BD8" },
    { value: "MALE_ORIENTED", name: selectorT("male"), color: "#60A5FA" },
    { value: "FEMALE_ORIENTED", name: selectorT("female"), color: "#F472B6" },
  ];

  const handlePersonaModalOpen = () => {
    onClose();
    openModal("PERSONA");
  };

  const activityArray: ActivityTab[] = [
    {
      name: rootT("sidebar.noteCharge"),
      icon: Token,
      link: "/token-charge",
    },
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
    if (item.link === "/token-charge") {
      return isLoggedIn;
    }

    if (item.name === t("persona")) {
      return isLoggedIn;
    }
    return true;
  });

  // 선택한 성향은 홈·랭킹·신작 목록의 조회 조건이라 새로고침 뒤에도 남아야 한다(localStorage).
  const currentTendency = useTendencyStore((state) => state.tendency);
  const setCurrentTendency = useTendencyStore((state) => state.setTendency);
  const currentTendencyName =
    tendencyArray.find(({ value }) => value === currentTendency)?.name ??
    selectorT("all");

  const handleCurrentTendency = (value: Tendency) => {
    setCurrentTendency(value);
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
  // 프로필 팝오버의 보유 캐시는 헤더와 같은 지갑 잔액을 사용합니다.
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );

  const handleRouterPush = () => {
    router.push(`/profile/${userId}`);
    onClose();
  };

  useRouteEffect(onClose);

  return (
    <PopoverLayout
      triggerRef={triggerRef}
      onClose={handleProfilePopoverClose}
      className={cn(
        "transition-colors",
        isLoggedIn
          ? "w-[240px] min-w-[240px] overflow-hidden px-2 py-3 shadow-card-heavy"
          : "w-75",
      )}
    >
      {isLoggedIn ? (
        <Link
          onClick={handleRouterPush}
          href={`/profile/${userId}`}
          className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-btn-hover"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={profileImage || "/p1.png"}
              alt={t("profileImageAlt")}
              width={28}
              height={28}
              className="avatar-img size-7"
            />
            <span className="title-5 min-w-0 truncate text-font-1">
              {nickname}
            </span>
          </div>
          <ArrowRight className="size-2.5 shrink-0 text-font-disabled" />
        </Link>
      ) : (
        <div className="body-5 flex flex-col gap-3 p-2">
          <div
            onClick={() => handleLoginBtn("KAKAO")}
            className="flex cursor-pointer items-center justify-center relative body-5 text-center h-11 rounded-lg bg-[#FEE500] w-full py-2 text-scrim"
          >
            <Kakao className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            {t("loginWithKakao")}
          </div>
          <div
            onClick={() => handleLoginBtn("GOOGLE")}
            className="flex cursor-pointer items-center justify-center relative body-5 text-center h-11 rounded-lg bg-font-1 w-full py-2 text-font-4"
          >
            <Google className="absolute w-5.5 h-5.5 top-1/2 left-7.5 -translate-y-1/2" />
            {t("loginWithGoogle")}
          </div>
          <div
            ref={loginModalBtnRef}
            onClick={() => handleLoginBtn("LOGIN")}
            className="flex cursor-pointer items-center justify-center relative body-5 text-center h-11 rounded-lg bg-card w-full py-2 text-font-2"
          >
            {t("loginWithOther")}
          </div>
        </div>
      )}

      <div className="py-2.5">
        <div className="h-px w-full bg-main" />
      </div>

      <h3 className="title-7 pb-1.5 pl-2.5 text-font-2">{t("activity")}</h3>
      <div className="flex flex-col gap-1.5">
        {filteredActivityArray.map((tab) => {
          const Icon = tab.icon;
          const isTokenCharge = tab.link === "/token-charge";

          if (!tab.link) {
            return (
              <div key={tab.name}>
                <button
                  type="button"
                  onClick={tab.onClick}
                  className="menu-item body-5 w-full justify-between gap-2 text-left text-font-1 ease-in-out"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon
                      size={18}
                      strokeWidth={0.5}
                      className={cn("size-[18px] shrink-0 text-font-2")}
                    />
                    <span className="truncate">{tab.name}</span>
                  </span>

                  {tab.hasTendencyOptions && (
                    <span className="flex shrink-0 items-center gap-1">
                      <span className="title-6 text-font-1">
                        {currentTendencyName}
                      </span>
                      <ArrowRight
                        className={cn(
                          "size-2.5 text-font-disabled transition-transform",
                          tendency.isOpen && "rotate-90",
                        )}
                      />
                    </span>
                  )}
                </button>

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
                        {tendencyArray.map(({ color, name, value }) => (
                          <li
                            key={value}
                            onClick={() => handleCurrentTendency(value)}
                            className="body-6 flex cursor-pointer justify-between rounded-xl px-2.5 py-2 transition-colors duration-200 ease-in-out hover:bg-btn-hover"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              {name}
                            </div>

                            {currentTendency === value && (
                              <Check className="size-[18px] text-brand" />
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
              className={cn(
                "menu-item body-5 justify-between gap-2 text-font-1 ease-in-out",
                !isTokenCharge && "body-5",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon
                  size={18}
                  strokeWidth={0.5}
                  className={cn("size-[18px] shrink-0 text-font-2")}
                />
                <span className="truncate">{tab.name}</span>
              </span>

              {isTokenCharge && (
                <span className="flex shrink-0 items-center gap-1">
                  <span className="title-6 text-font-1">
                    {formatWithCommas(availableBalance)}
                  </span>
                  <ArrowRight className="size-2.5 text-font-disabled" />
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="py-2.5">
        <div className="h-px w-full bg-main" />
      </div>

      <h3 className="title-7 pb-1.5 pl-2.5 text-font-2">
        {t("inquiryAndSettings")}
      </h3>
      <div className="flex flex-col gap-1.5">
        {supportArray.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.link}
              className="menu-item body-5 gap-2 text-font-1"
            >
              <Icon
                size={18}
                strokeWidth={0.5}
                className={cn("size-[18px] shrink-0 text-font-2")}
              />
              <span className="truncate">{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {isLoggedIn && (
        <>
          <div className="py-2.5">
            <div className="h-px w-full bg-main" />
          </div>
          <div
            onClick={() => logout()}
            className="menu-item body-5 cursor-pointer gap-2 text-font-1 ease-in-out"
          >
            <Logout size={18} className="size-[18px] shrink-0 text-font-2" />
            {t("logout")}
          </div>
        </>
      )}
    </PopoverLayout>
  );
};

export default ProfilePopover;
