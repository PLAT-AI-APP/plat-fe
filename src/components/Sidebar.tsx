"use client";
import { Camera, Chat, Headphone, Home, Megaphone } from "@/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isFolded: boolean;
}

const Sidebar = ({ isFolded }: SidebarProps) => {
  const pathname = usePathname();

  const menuArray = [
    { name: "홈", link: "/", icon: Home },
    { name: "내 채팅", link: "/chatting-room", icon: Chat },
    { name: "캐릭터 제작", link: "/character-creat", icon: Camera },
    { name: "공지사항", link: "/notice", icon: Megaphone },
    { name: "고객센터", link: "/help", icon: Headphone },
  ];

  return (
    // aside 자체를 motion으로 만들고 너비를 animate로 관리합니다.
    <motion.aside
      id="main-sidebar"
      animate={{ width: isFolded ? "70px" : "240px" }}
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
                    <AnimatePresence mode="wait">
                      {!isFolded && (
                        <motion.span
                          id={`text-${menu.name}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "ml-1 whitespace-nowrap text-sm",
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
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
