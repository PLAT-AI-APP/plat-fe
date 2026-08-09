"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Camera, Chat, Fold, Home, NoteLine } from "@/icons";
import { cn } from "@/lib/utils";

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
  onFoldToggle?: () => void;
}

const Sidebar = ({ isFolded = false, onFoldToggle }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations();

  const menuArray = [
    { name: t("sidebar.home"), link: "/", icon: Home },
    { name: t("sidebar.myChatting"), link: "/my-chatting", icon: Chat },
    { name: t("sidebar.studio"), link: "/studio/1", icon: Camera },
    { name: t("sidebar.noteCharge"), link: "/token-charge", icon: NoteLine },
  ];

  const sidebarWidth = isFolded ? "70px" : "240px";

  return (
    <motion.aside
      id="main-sidebar"
      initial={{ width: sidebarWidth }}
      animate={{ width: sidebarWidth }}
      style={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 flex h-full flex-col gap-2 overflow-hidden bg-dark pt-4 pr-2 pl-4"
    >
      <nav
        id="sidebar-navigation"
        aria-label={t("sidebar.navigation")}
        className="w-full"
      >
        {onFoldToggle && (
          <div className="mb-4 flex px-[7px]">
            <button
              id="sidebar-toggle-button"
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
                    animate={{ width: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                      "relative flex h-11.5 cursor-pointer items-center overflow-hidden rounded-lg transition-colors",
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

                    <AnimatePresence mode="wait" initial={isFolded}>
                      {!isFolded && (
                        <motion.span
                          id={`text-${menu.link}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "title-3 ml-1 whitespace-nowrap",
                            isActive ? "font-medium text-brand" : "text-font-2",
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
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2, delay: 0.1 },
                    x: { duration: 0.2 },
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                  height: 0,
                  transition: {
                    height: { duration: 0.25, ease: "easeInOut" },
                    opacity: { duration: 0.15 },
                    x: { duration: 0.2 },
                  },
                }}
                className="body-4 mb-1 overflow-hidden whitespace-nowrap pl-2 text-font-2"
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
                  className="flex cursor-pointer items-center overflow-hidden rounded-lg p-1.5 hover:bg-card-hover"
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
                            width: { duration: 0.3, ease: "easeOut" },
                            opacity: { duration: 0.2, delay: 0.1 },
                          },
                        }}
                        exit={{
                          width: 0,
                          opacity: 0,
                          x: -10,
                          transition: {
                            width: { duration: 0.25, ease: "easeIn" },
                            opacity: { duration: 0.1 },
                          },
                        }}
                        className="ml-3 flex min-w-0 flex-1 flex-col overflow-hidden whitespace-nowrap"
                      >
                        <p className="body-4 truncate font-medium text-font-1">
                          {chat.name}
                        </p>
                        <p className="body-5 truncate text-font-2">
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
    </motion.aside>
  );
};

export default Sidebar;
