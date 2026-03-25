"use client";
import { Camera, Chat, Headphone, Home, Megaphone } from "@/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isFolded: boolean;
}

const Sidebar = ({ isFolded }: SidebarProps) => {
  const pathname = usePathname();

  const menuArray = [
    { name: "홈", link: "/", icon: Home },
    { name: "내 채팅", link: "/chat", icon: Chat },
    { name: "스튜디오", link: "/studio", icon: Camera },
    { name: "공지사항", link: "/notice", icon: Megaphone },
    { name: "고객센터", link: "/help", icon: Headphone },
  ];

  return (
    // aside 자체를 motion으로 만들고 너비를 animate로 관리합니다.
    <motion.aside
      id="main-sidebar"
      animate={{ width: isFolded ? "70px" : "230px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-15 flex flex-col pt-4 pl-4 pr-2 gap-2 h-fit bg-background"
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
                  aria-current={isActive ? "page" : undefined} // 현재 페이지임을 브라우저에 알림
                >
                  <motion.div
                    id={`nav-button-${menu.name}`}
                    layout
                    initial={false}
                    animate={{ width: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`rounded-lg flex items-center h-11.5 overflow-hidden relative cursor-pointer hover:bg-btn-hover ${
                      isActive ? "bg-brand/10" : "bg-transparent"
                    }`}
                  >
                    {/* 아이콘 영역 */}
                    <motion.div
                      layout="position"
                      className="flex-none w-11.5 flex items-center justify-center"
                    >
                      <Icon
                        id={`icon-${menu.name}`}
                        className={`w-5.5 h-5.5 transition-colors ${
                          isActive ? "text-brand" : "text-font-2"
                        }`}
                      />
                    </motion.div>

                    {/* 텍스트 영역 */}
                    <AnimatePresence mode="wait">
                      {!isFolded && (
                        <motion.span
                          id={`text-${menu.name}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`text-sm font-medium whitespace-nowrap ml-1 ${
                            isActive ? "text-brand" : "text-font-2"
                          }`}
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
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
