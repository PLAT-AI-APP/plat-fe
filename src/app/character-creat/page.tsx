"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/type/character";
import Profile from "./_components/profile";
import DetailInfo from "./_components/detail-info";
import Asset from "./_components/asset";
import Scenario from "./_components/scenario";
import Setting from "./_components/setting";
import CharacterPreview from "./_components/CharacterPreview";

const TABS = [
  { id: "profile", title: "프로필", component: Profile },
  { id: "details", title: "상세정보", component: DetailInfo },
  { id: "assets", title: "에셋", component: Asset },
  { id: "scenario", title: "시나리오", component: Scenario },
  { id: "settings", title: "설정", component: Setting },
] as const;

const CharacterCreatPage = () => {
  // 상태 및 초기값
  const methods = useForm<CharacterCreateFormValues>({
    defaultValues: {
      representativeImage: "",
      title: "",
      name: "",
      characterIntroduce: "",
      height: "",
      weight: "",
      characterDetailSetting: "",
      asset: [
        {
          assetFile: null,
          assetImage: "/images/sample.png",
          assetName: "행복",
          assetSituation: "캐릭터가 행복이라는 감정을 느낄 떄",
        },
      ],
      scenarios: [
        {
          name: "기본 시나리오",
          messages: [
            {
              id: "1",
              role: "assistant",
              characterName: "윤아",
              profileImage: "/images/sample.png",
              content: `"나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든."\n\n{{img:/images/sample.png}}\n\n*그녀는 환하게 웃으며\n내 소매를 살짝 잡아끌었다.*`,
            },
            {
              id: "2",
              role: "user",
              content: "나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든.",
            },
          ],
        },
      ],
      isPublic: true,
      characterDescription: "",
      tendency: "전체",
      category: "",
      tagList: [{ name: "취미" }, { name: "여행" }],
    },
  });

  const [currentTabId, setCurrentTabId] =
    useState<(typeof TABS)[number]["id"]>("profile");
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  // 파생 데이터
  const activeTab = TABS.find((tab) => tab.id === currentTabId);
  const ActiveComponent = activeTab?.component;

  return (
    <main
      id="character-create-main"
      className="flex flex-col flex-1 min-w-0 p-5 h-[calc(100vh-60px)]"
    >
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
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setCurrentTabId(tab.id)}
                  className={cn(
                    "text-sm text-font-2 p-2.5 cursor-pointer translate-y-0.5 outline-none",
                    currentTabId === tab.id &&
                      "text-font-1 font-semibold border-b-2 border-brand",
                  )}
                >
                  {tab.title}
                </button>
              ))}
            </nav>
            {ActiveComponent && (
              <ActiveComponent
                activeScenarioIndex={activeScenarioIndex}
                setActiveScenarioIndex={setActiveScenarioIndex}
              />
            )}
          </section>

          <CharacterPreview activeScenarioIndex={activeScenarioIndex} />
        </div>
      </FormProvider>
    </main>
  );
};

export default CharacterCreatPage;
