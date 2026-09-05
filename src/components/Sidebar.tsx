"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Camera, Chat, Fold, Home, NoteLine } from "@/icons";
import { cn } from "@/lib/utils";
import {
  DURATION,
  EASE_IN_OUT,
  EASE_OUT,
  SPRING_SOFT,
  TRANSITION,
} from "@/constants/motion";

export const RECENT_CHATS_MOCK = [
  {
    id: 1,
    name: "사이버펑크 해커 리온",
    lastMessage:
      "네온 사인이 깜빡이는 뒷골목. 어떤 정보를 찾으러 왔어? 내 보안망은 아무나 못 뚫을 텐데.",
    thumbnail: "/images/sample.png",
    tendency: "남성향",
    unreadCount: 2,
    updatedAt: "10분 전",
  },
  {
    id: 2,
    name: "판타지 엘프 마법사",
    lastMessage:
      "고대 숲의 깊은 곳. 은빛 머리카락이 흩날리는 그녀가 당신에게 조용히 손을 내밉니다.",
    thumbnail: "/images/sample.png",
    tendency: "전체",
    unreadCount: 0,
    updatedAt: "1시간 전",
  },
  {
    id: 3,
    name: "냉혹한 춤꾼",
    lastMessage:
      "음악이 멈추면 모든 게 끝나는 거야. 마지막 춤을 출 준비는 됐어?",
    thumbnail: "/images/sample.png",
    tendency: "여성향",
    unreadCount: 5,
    updatedAt: "3시간 전",
  },
  {
    id: 4,
    name: "우주 정거장 AI 안나",
    lastMessage:
      "현재 산소 포화도 98%입니다. 사령관님, 다음 목적지인 화성까지의 궤도를 수정할까요?",
    thumbnail: "/images/sample.png",
    tendency: "전체",
    unreadCount: 0,
    updatedAt: "어제",
  },
  {
    id: 5,
    name: "조선 시대 무사 강혁",
    lastMessage:
      "이 칼 끝은 오직 정의만을 향한다. 네가 찾는 도적이 정말 이곳에 숨어 있다고 생각하느냐?",
    thumbnail: "/images/sample.png",
    tendency: "남성향",
    unreadCount: 0,
    updatedAt: "2026.04.14",
  },
];

interface SidebarProps {
  isFolded: boolean;
  /**
   * inline: 그리드 열 하나를 차지해 콘텐츠를 옆으로 민다(데스크탑 기본).
   * overlay: 좁은 화면에서 콘텐츠 위에 얹히는 드로어. 콘텐츠를 밀지 않는다.
   */
  variant?: "inline" | "overlay";
  onFoldToggle?: () => void;
  foldToggleRef?: RefObject<HTMLButtonElement | null>;
}

const Sidebar = ({
  isFolded = false,
  variant = "inline",
  onFoldToggle,
  foldToggleRef,
}: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations();

  const menuArray = [
    { name: t("sidebar.home"), link: "/", icon: Home },
    { name: t("sidebar.myChatting"), link: "/my-chatting", icon: Chat },
    { name: t("sidebar.studio"), link: "/studio/1", icon: Camera },
    { name: t("sidebar.noteCharge"), link: "/token-charge", icon: NoteLine },
  ];

  const isOverlay = variant === "overlay";

  return (
    <aside
      id="main-sidebar"
      className={cn(
        "flex flex-col gap-2 overflow-hidden bg-dark pt-4 pr-2 pl-4",
        isOverlay
          ? // 드로어는 헤더 아래에서 시작해 콘텐츠 위에 얹힌다. 스크림보다 한 층 위.
            "fixed bottom-0 left-0 top-(--header-height) z-40 w-(--sidebar-width-expanded) shadow-modal"
          : "sticky top-0 h-full w-full",
      )}
    >
      <nav
        id="sidebar-navigation"
        aria-label={t("sidebar.navigation")}
        className="w-full"
      >
        {onFoldToggle && (
          <div className="mb-4 flex px-[7px]">
            <button
              id="sidebar-inline-toggle-button"
              ref={foldToggleRef}
              type="button"
              aria-label={t("sidebar.toggle")}
              onClick={onFoldToggle}
              className="flex size-8 items-center justify-center rounded-lg bg-transparent text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
            >
              <Fold id="icon-sidebar-fold" className="size-6" />
            </button>
          </div>
        )}

        <ul
          id="sidebar-menu-list"
          className="m-0 flex list-none flex-col gap-2 p-0"
        >
          {menuArray.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              menu.link === "/"
                ? pathname === "/"
                : pathname.startsWith(menu.link);

            return (
              <li key={menu.name} id={`menu-item-${menu.link}`}>
                <Link
                  id={`link-${menu.link}`}
                  href={menu.link}
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    id={`nav-button-${menu.link}`}
                    layout
                    initial={false}
                    transition={SPRING_SOFT}
                    className={cn(
                      "relative flex h-10 cursor-pointer items-center overflow-hidden rounded-lg transition-colors",
                      isActive
                        ? "bg-brand/10"
                        : "bg-transparent hover:bg-btn-hover",
                    )}
                  >
                    <motion.div
                      layout="position"
                      className="flex w-11.5 flex-none items-center justify-center"
                    >
                      <Icon
                        id={`icon-${menu.link}`}
                        className={cn(
                          "h-5.5 w-5.5 transition-colors",
                          isActive ? "text-brand" : "text-font-2",
                        )}
                      />
                    </motion.div>

                    <AnimatePresence mode="wait" initial={false}>
                      {!isFolded && (
                        <motion.span
                          id={`text-${menu.link}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={TRANSITION}
                          className={cn(
                            "body-5 ml-1 whitespace-nowrap transition-colors",
                            isActive ? "text-brand" : "text-font-2",
                          )}
                        >
                          {menu.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="my-4 text-main" />

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {!isFolded && (
              <motion.p
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  height: "auto",
                  transition: {
                    height: { duration: DURATION.slow, ease: EASE_OUT },
                    opacity: { duration: DURATION.base, delay: DURATION.fast },
                    x: { duration: DURATION.base, ease: EASE_OUT },
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                  height: 0,
                  transition: {
                    height: { duration: DURATION.base, ease: EASE_IN_OUT },
                    opacity: { duration: DURATION.fast },
                    x: { duration: DURATION.base, ease: EASE_OUT },
                  },
                }}
                className="body-5 mb-1 overflow-hidden whitespace-nowrap pl-2 text-font-2"
              >
                {t("sidebar.recentChats")}
              </motion.p>
            )}
          </AnimatePresence>

          <ul className="flex flex-col gap-2">
            {RECENT_CHATS_MOCK.map((chat) => (
              <li key={chat.id}>
                <motion.div
                  layout
                  className="flex cursor-pointer items-center overflow-hidden rounded-lg p-1.5 transition-colors hover:bg-card-hover"
                >
                  <motion.div layout="position" className="flex-none">
                    <Image
                      src={chat.thumbnail}
                      width={36}
                      height={36}
                      alt={chat.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {!isFolded && (
                      <motion.div
                        initial={{ width: 0, opacity: 0, x: -10 }}
                        animate={{
                          width: "auto",
                          opacity: 1,
                          x: 0,
                          transition: {
                            width: { duration: DURATION.slow, ease: EASE_OUT },
                            opacity: {
                              duration: DURATION.base,
                              delay: DURATION.fast,
                            },
                          },
                        }}
                        exit={{
                          width: 0,
                          opacity: 0,
                          x: -10,
                          transition: {
                            width: {
                              duration: DURATION.base,
                              ease: EASE_IN_OUT,
                            },
                            opacity: { duration: DURATION.fast },
                          },
                        }}
                        className="ml-3 flex min-w-0 flex-1 flex-col overflow-hidden whitespace-nowrap"
                      >
                        <p className="body-5 truncate text-font-1">
                          {chat.name}
                        </p>
                        <p className="body-6 truncate text-font-2">
                          {chat.lastMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
