"use client";
import Logo from "@/icons/Logo";
import New from "@/icons/New";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const categoryArray = [
  {
    id: "all",
    name: "홈",
  },
  {
    id: "ranking",
    name: "랭킹",
  },
  {
    id: "new",
    name: "신작",
    icon: New,
  },
  {
    id: "official",
    name: "공식",
    icon: Logo,
  },
  {
    id: "categories",
    name: "카테고리",
  },
];

interface MenuTabProps {
  currentTab: string;
}
const MenuTab = ({ currentTab }: MenuTabProps) => {
  return (
    <nav
      id="category-navigation"
      aria-label="캐릭터 카테고리"
      className="w-full flex gap-2 mb-12"
    >
      {categoryArray.map(({ id, name, icon: Icon }) => {
        const isActive = currentTab === id;
        return (
          <Link
            key={name}
            id={`category-link-${name}`} // 각 링크에도 고유 ID 부여 (트래킹 용이)
            href={{ pathname: "/", query: { tab: id } }}
            // scroll={false}
            className={`relative px-2.5 py-2 flex gap-1 items-center justify-center
          ${isActive ? "text-font-1 title-2" : "body-1 text-font-2 hover:text-font-1"}`}
          >
            {name}
            {Icon && <Icon className="w-4.5 h-4.5 inline text-white" />}

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
