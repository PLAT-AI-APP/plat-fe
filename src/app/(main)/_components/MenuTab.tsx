"use client";

import ShallowLink from "@/components/navigation/ShallowLink";
import React from "react";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/character/character-card/TitleStatusIcon";

const MenuTab = ({ currentTab }: { currentTab: string }) => {
  const t = useTranslations();
  const categoryArray = [
    { id: "all", name: t("mainTabs.home") },
    { id: "ranking", name: t("mainTabs.ranking") },
    {
      id: "new",
      name: t("mainTabs.new"),
      badge: <StatusBadge isNew isOfficial={false} />,
    },
    {
      id: "official",
      name: t("mainTabs.official"),
      badge: <StatusBadge isNew={false} isOfficial />,
    },
    { id: "categories", name: t("mainTabs.categories") },
  ];

  return (
    <nav
      id="category-navigation"
      aria-label={t("mainTabs.navigation")}
      className="tab-strip mt-6 w-full gap-2"
    >
      {categoryArray.map(({ id, name, badge }) => {
        const isActive = currentTab === id;

        return (
          // 탭은 같은 페이지 안의 전환이라 서버에 다시 묻지 않는다(ShallowLink).
          <ShallowLink
            key={name}
            id={`category-link-${id}`}
            href={`/?tab=${id}`}
            className={`title-3 relative flex items-center justify-center gap-1 px-3 py-2.5 transition-colors ${
              isActive ? "text-font-0" : "text-font-2 hover:text-font-1"
            }`}
          >
            {name}
            {badge}

            {isActive && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-brand" />
            )}
          </ShallowLink>
        );
      })}
    </nav>
  );
};

export default MenuTab;
