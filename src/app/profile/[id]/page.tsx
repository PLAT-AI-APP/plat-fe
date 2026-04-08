"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Character from "./_components/character/indext";
import Community from "./_components/community";
import Header from "./_components/Header";

const TABS = [
  { id: "profile", title: "캐릭터", component: Character },
  { id: "details", title: "커뮤니티", component: Community },
] as const;

const ProfilePage = () => {
  // 상태 및 데이터
  const [currentTabId, setCurrentTabId] =
    useState<(typeof TABS)[number]["id"]>("profile");

  // 로직 및 추출 변수
  const activeTab = TABS.find((tab) => tab.id === currentTabId);
  const ActiveComponent = activeTab?.component;

  return (
    <section className="flex flex-col gap-11.5 max-w-280 px-10 pt-7.5">
      {/* 사용자 프로필 정보 요약 영역 */}
      <Header />

      {/* 탭 메뉴 및 콘텐츠 영역 */}
      <section
        id="profile-content"
        className="flex-1 min-w-0 h-full rounded-3xl"
      >
        <nav className="flex gap-1 mb-1.5">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setCurrentTabId(tab.id)}
              className={cn(
                "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5",
                currentTabId === tab.id &&
                  "text-font-1 font-semibold border-b-2 border-brand",
              )}
            >
              {tab.title}
            </button>
          ))}
        </nav>
        <article>{ActiveComponent ? <ActiveComponent /> : null}</article>
      </section>
    </section>
  );
};

export default ProfilePage;
