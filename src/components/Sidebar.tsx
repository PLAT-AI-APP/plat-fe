"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Camera, Chat, Fold, Home, NoteLine } from "@/icons";
import { cn } from "@/lib/utils";
import { SPRING_SOFT, TRANSITION } from "@/constants/motion";

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
      </nav>
    </aside>
  );
};

export default Sidebar;
