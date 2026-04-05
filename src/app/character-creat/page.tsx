"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Profile from "./_components/profile";
import { CharacterCreateFormValues } from "@/type/character";
import { FormProvider, useForm } from "react-hook-form";
import DetailInfo from "./_components/detail-info";
import Asset from "./_components/asset";
import Scenario from "./_components/scenario";
import Setting from "./_components/setting";

const TABS = [
  { id: "profile", title: "프로필", component: Profile },
  { id: "details", title: "상세정보", component: DetailInfo },
  { id: "assets", title: "에셋", component: Asset },
  { id: "scenario", title: "시나리오", component: Scenario },
  { id: "settings", title: "설정", component: Setting },
] as const;

const CharacterCreatPage = () => {
  const methods = useForm<CharacterCreateFormValues>({
    defaultValues: {
      // 프로필 탭
      representativeImage: "",
      title: "",
      name: "",
      characterIntroduce: "",

      // 상세정보 탭
      height: "",
      weight: "",
      characterDetailSetting: "",

      // 에셋 탭
      asset: [
        {
          assetFile: null,
          assetImage: "/images/sample.png",
          assetName: "행복",
          assetSituation: "캐릭터가 행복이라는 감정을 느낄 떄",
        },
      ],

      // 시나리오 탭
      scenarioName: [{ name: "기본 시나리오" }],

      // 설정 탭
      isPublic: true,
      characterDescription: "",
      tendency: "전체",
      category: "",
      tagList: [],
    },
  });

  // 1. 상태를 문자열(ID)로만 관리
  const [currentTabId, setCurrentTabId] =
    useState<(typeof TABS)[number]["id"]>("profile");

  // 2. 현재 선택된 탭 객체 찾기
  const activeTab = TABS.find((tab) => tab.id === currentTabId);
  const ActiveComponent = activeTab?.component;
  return (
    <section className="flex flex-col flex-1 min-w-0 p-5 h-[calc(100vh-60px)]">
      <FormProvider {...methods}>
        <header className="flex items-center justify-between pb-4">
          <h2 className="text-[20px] font-medium">캐릭터 생성</h2>

          <div className="flex gap-3">
            <button className="px-5 py-2 bg-card border border-border-main rounded-xl hover:bg-card-hover">
              임시저장
            </button>
            <button className="px-5 py-2 bg-brand rounded-xl">등록</button>
          </div>
        </header>

        <div className="flex gap-4 flex-1 min-w-0 pb-5">
          <section className="flex-1 min-w-0 max-w-125 h-full p-5 rounded-3xl bg-bg-darker border border-border-main">
            <nav className="flex gap-1 border-b-2 border-font-disabled mb-9">
              {TABS.map((tab) => (
                <div
                  onClick={() => setCurrentTabId(tab.id)}
                  key={tab.id}
                  className={cn(
                    "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5",
                    currentTabId === tab.id &&
                      "text-font-1 font-semibold border-b-2 border-brand",
                  )}
                >
                  {tab.title}
                </div>
              ))}
            </nav>
            {ActiveComponent ? <ActiveComponent /> : null}
          </section>
          <section className="flex-1 min-w-0"></section>
        </div>
      </FormProvider>
    </section>
  );
};

export default CharacterCreatPage;
