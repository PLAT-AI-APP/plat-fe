"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import Logo from "@/icons/Logo";
import New from "@/icons/New";

const MenuTab = ({ currentTab }: { currentTab: string }) => {
  const t = useTranslations();
  const categoryArray = [
    { id: "all", name: t("mainTabs.home") },
    { id: "ranking", name: t("mainTabs.ranking") },
    { id: "new", name: t("mainTabs.new"), icon: New },
    { id: "official", name: t("mainTabs.official"), icon: Logo },
    { id: "categories", name: t("mainTabs.categories") },
  ];

  return (
    <nav
      id="category-navigation"
      aria-label={t("mainTabs.navigation")}
      className="mt-6 flex w-full gap-2"
    >
      {categoryArray.map(({ id, name, icon: Icon }) => {
        const isActive = currentTab === id;

        return (
          <Link
            key={name}
            id={`category-link-${id}`}
            href={{ pathname: "/", query: { tab: id } }}
            className={`body-4 relative flex items-center justify-center gap-1 px-2.5 py-2 transition-colors ${
              isActive ? "text-font-1" : "text-font-2 hover:text-font-1"
            }`}
          >
            {name}
            {Icon && <Icon className="inline h-4.5 w-4.5" />}

            {isActive && (
              <div className="absolute bottom-0 left-0 w-full box-border border-b-2 border-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default MenuTab;
