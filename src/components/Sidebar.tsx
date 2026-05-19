"use client";
import { Camera, Chat, Home } from "@/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const RECENT_CHATS_MOCK = [
  {
    id: 1,
    name: "사이버펑크 해커 리온",
    lastMessage:
      "네온 사인이 깜빡이는 뒷골목. 어떤 정보를 찾으러 왔어? 내 보안망은 아무나 못 뚫을 텐데.",
    thumbnail: "/images/sample.png", // 이미지의 해커 아바타
    tendency: "남성향",
    unreadCount: 2,
    updatedAt: "10분 전",
  },
  {
    id: 2,
    name: "판타지 엘프 마법사",
    lastMessage:
      "고대 숲의 깊은 곳. 은빛 머리카락이 흩날리는 그녀가 당신에게 조용히 손을 내밉니다.",
    thumbnail: "/images/sample.png", // 이미지의 해커 아바타
    tendency: "전체",
    unreadCount: 0,
    updatedAt: "1시간 전",
  },
  {
    id: 3,
    name: "냉혹한 춤꾼",
    lastMessage:
      "음악이 멈추면 모든 게 끝나는 거야. 마지막 춤을 출 준비는 됐어?",
    thumbnail: "/images/sample.png", // 이미지의 해커 아바타
    tendency: "여성향",
    unreadCount: 5,
    updatedAt: "3시간 전",
  },
  {
    id: 4,
    name: "우주 정거장 AI 안나",
    lastMessage:
      "현재 산소 포화도 98%입니다. 사령관님, 다음 목적지인 화성까지의 궤도를 수정할까요?",
    thumbnail: "/images/sample.png", // 이미지의 해커 아바타
    tendency: "전체",
    unreadCount: 0,
    updatedAt: "어제",
  },
  {
    id: 5,
    name: "조선 시대 무사 강혁",
    lastMessage:
      "이 칼 끝은 오직 정의만을 향한다. 네가 찾는 도적이 정말 이곳에 숨어 있다고 생각하느냐?",
    thumbnail: "/images/sample.png", // 이미지의 해커 아바타
    tendency: "남성향",
    unreadCount: 0,
    updatedAt: "2026.04.14",
  },
];

interface SidebarProps {
  isFolded: boolean;
}

const Sidebar = ({ isFolded = false }: SidebarProps) => {
  const pathname = usePathname();

  const menuArray = [
    { name: "홈", link: "/", icon: Home },
    { name: "내 채팅", link: "/my-chatting", icon: Chat },
    { name: "스튜디오", link: "/studio/1", icon: Camera },
    // { name: "공지사항", link: "/notice", icon: Megaphone },
    // { name: "고객센터", link: "/help", icon: Headphone },
  ];

  const sidebarWidth = isFolded ? "70px" : "240px";
  return (
    // aside 자체를 motion으로 만들고 너비를 animate로 관리합니다.
    <motion.aside
      id="main-sidebar"
      // initial={false} 대신 실제 너비를 초기값으로 전달
      initial={{ width: sidebarWidth }}
      animate={{ width: sidebarWidth }}
      // 브라우저가 JS 로드 전에도 이 너비를 유지하도록 style 추가
      style={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 flex flex-col pt-4 pl-4 pr-2 gap-2 h-fit bg-background overflow-hidden"
    >
      <nav
        id="sidebar-navigation"
        aria-label="사이드바 메뉴"
        className="w-full"
      >
        <ul
          id="sidebar-menu-list"
          className="flex flex-col gap-2 p-0 m-0 list-none"
        >
          {menuArray.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              menu.link === "/"
                ? pathname === "/"
                : pathname.startsWith(menu.link);

            return (
              <li key={menu.name} id={`menu-item-${menu.name}`}>
                <Link
                  id={`link-${menu.name}`}
                  href={menu.link}
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    id={`nav-button-${menu.name}`}
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
                    {/* 아이콘 영역 */}
                    <motion.div
                      layout="position"
                      className="flex w-11.5 flex-none items-center justify-center"
                    >
                      <Icon
                        id={`icon-${menu.name}`}
                        className={cn(
                          "h-5.5 w-5.5 transition-colors",
                          isActive ? "text-brand" : "text-font-2",
                        )}
                      />
                    </motion.div>

                    {/* 텍스트 영역 */}
                    <AnimatePresence mode="wait" initial={isFolded}>
                      {!isFolded && (
                        <motion.span
                          id={`text-${menu.name}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "ml-1 whitespace-nowrap title-3",
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

        <hr className="text-border-main my-4" />

        {/* 최근 대화 섹션 */}
        <div className="flex flex-col gap-3">
          {/* "최근 대화" 텍스트도 접힐 때 사라지게 처리 */}
          <AnimatePresence>
            {!isFolded && (
              <motion.p
                // 1. 나타날 때: 위에서 살짝 내려오며 투명도 회복
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
                // 2. 사라질 때: 왼쪽으로 밀리면서 높이가 부드럽게 줄어듦
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
                // 3. 텍스트가 꺾이지 않도록 방어
                className="text-font-2 body-4 pl-2 overflow-hidden whitespace-nowrap mb-1"
              >
                최근 대화
              </motion.p>
            )}
          </AnimatePresence>

          <ul className="flex flex-col gap-2">
            {RECENT_CHATS_MOCK.map((chat) => (
              <li key={chat.id}>
                <motion.div
                  layout
                  className={cn(
                    "flex items-center p-1.5 rounded-lg hover:bg-card-hover cursor-pointer overflow-hidden",
                  )}
                >
                  {/* 이미지 영역: flex-none으로 크기 고정 */}
                  <motion.div layout="position" className="flex-none">
                    <Image
                      src={chat.thumbnail}
                      width={36}
                      height={36}
                      alt={chat.name}
                      className="rounded-full w-9 h-9 object-cover"
                    />
                  </motion.div>

                  {/* 텍스트 영역: 가로폭(width)을 직접 애니메이션화 */}
                  <AnimatePresence mode="popLayout">
                    {!isFolded && (
                      <motion.div
                        // 초기값: 너비 0, 투명도 0
                        initial={{ width: 0, opacity: 0, x: -10 }}
                        // 펼쳐질 때: 너비 자동, 투명도 1
                        animate={{
                          width: "auto",
                          opacity: 1,
                          x: 0,
                          transition: {
                            width: { duration: 0.3, ease: "easeOut" },
                            opacity: { duration: 0.2, delay: 0.1 },
                          },
                        }}
                        // 접힐 때: 너비 0, 투명도 0
                        exit={{
                          width: 0,
                          opacity: 0,
                          x: -10,
                          transition: {
                            width: { duration: 0.25, ease: "easeIn" },
                            opacity: { duration: 0.1 },
                          },
                        }}
                        className="flex flex-col overflow-hidden whitespace-nowrap ml-3 flex-1 min-w-0"
                      >
                        <p className="font-medium body-4 text-font-1 truncate">
                          {chat.name}
                        </p>
                        <p className="text-font-2 body-5 truncate">
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
