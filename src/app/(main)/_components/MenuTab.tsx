"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const categoryArray = [
  {
    name: "홈",
    link: "/",
  },
  // {
  //   name: "랭킹",
  //   link: "/ranking",
  // },
  // {
  //   name: "신작",
  //   link: "/new",
  //   icon: New,
  // },
  {
    name: "카테고리",
    link: "/?categories=",
  },
];
const MenuTab = () => {
  const pathname = usePathname();
  return (
    <nav
      id="category-navigation"
      aria-label="캐릭터 카테고리"
      className="w-full flex gap-2 font-medium"
    >
      {categoryArray.map((category) => (
        <Link
          key={category.name}
          id={`category-link-${category.name}`} // 각 링크에도 고유 ID 부여 (트래킹 용이)
          href={category.link}
          className={`px-2.5 py-2 flex gap-1 items-center justify-center text-sm
          ${pathname.startsWith(category.link) ? "text-font-1 box-border border-b-2 border-brand" : "font-normal text-font-2 hover:text-font-1"}`}
        >
          {category.name}
          {/* {category.icon && (
                  <category.icon className="w-4.5 h-4.5 inline text-white" />
                )} */}
        </Link>
      ))}
    </nav>
  );
};

export default MenuTab;
