"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Profile from "./_components/profile";
import { CharacterCreateFormValues } from "@/type/character";
import { FormProvider, useForm } from "react-hook-form";
import DetailInfo from "./_components/detail-info";
import Asset from "./_components/asset";

const TABS = [
  { id: "profile", title: "프로필", component: <Profile /> },
  { id: "details", title: "상세정보", component: <DetailInfo /> },
  { id: "assets", title: "에셋", component: <Asset /> },
  { id: "scenario", title: "시나리오", component: null },
  { id: "settings", title: "설정", component: null },
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
      assetImage: "",
      assetName: "",
      assetSituation: "",

      // 시나리오 탭
      scenarioName: [],

      // 설정 탭
      isPublic: true,
      characterDescription: "",
      tendency: "",
      category: "",
      tagList: [],
    },
  });

  const [currentTab, setCurrentTab] = useState<{
    id: string;
    title: string;
    component: React.ReactNode | null;
  }>({
    id: "profile",
    title: "프로필",
    component: <Profile />,
  });

  const handleCurrentTab = (tab: {
    id: string;
    title: string;
    component: React.ReactNode | null;
  }) => {
    setCurrentTab(tab);
  };
  return (
    <section className="flex flex-col p-5 h-[calc(100vh-60px)]">
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

        <div className="flex gap-4 flex-1 pb-5">
          <section className="flex-1 h-full p-5 rounded-3xl bg-bg-darker border border-border-main">
            <nav className="flex gap-1 border-b-2 border-font-disabled mb-9">
              {TABS.map((tab) => (
                <div
                  onClick={() => handleCurrentTab(tab)}
                  key={tab.id}
                  className={cn(
                    "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5",
                    currentTab.title === tab.title &&
                      "text-font-1 font-semibold border-b-2 border-brand",
                  )}
                >
                  {tab.title}
                </div>
              ))}
            </nav>

            {currentTab.component}
          </section>
          <section className="flex-1"></section>
        </div>
      </FormProvider>
    </section>
  );
};

export default CharacterCreatPage;
