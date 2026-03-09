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
    { name: "내 채팅", link: "/activity", icon: Chat },
    { name: "스튜디오", link: "/activity", icon: Camera },
    { name: "공지사항", link: "/activity", icon: Megaphone },
    { name: "고객센터", link: "/activity", icon: Headphone },
  ];

  return (
    <div className="flex flex-col pt-4 pl-4 pr-2 gap-2">
      {menuArray.map((menu) => {
        const Icon = menu.icon;
        const isActive =
          menu.link === "/" ? pathname === "/" : pathname.startsWith(menu.link);

        return (
          <Link key={menu.name} href={menu.link}>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`rounded-lg flex items-center h-11.5 overflow-hidden transition-colors
                ${isFolded ? "w-11.5" : "w-53"} 
                ${isActive ? "bg-brand-opacity" : ""}
                hover:bg-btn-hover`}
            >
              <motion.div
                layout="position"
                className="flex-none w-11.5 flex items-center justify-center"
              >
                <Icon
                  className={`w-5.5 h-5.5 ${isActive ? "text-brand" : "text-font-2"}`}
                />
              </motion.div>

              <AnimatePresence>
                {!isFolded && (
                  <motion.span
                    layout
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
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
        );
      })}
    </div>
  );
};

export default Sidebar;
