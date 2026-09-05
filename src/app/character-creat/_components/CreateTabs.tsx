"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { UseFieldArrayReturn } from "react-hook-form";
import { useTabUnderline } from "@/hooks/useTabUnderline";
import { cn } from "@/lib/utils";
import Asset from "./asset";
import DetailInfo from "./detail-info";
import Profile from "./profile";
import Scenario from "./scenario";
import Setting from "./setting";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { SPRING_SNAPPY } from "@/constants/motion";

export const TAB_IDS = [
  "profile",
  "details",
  "assets",
  "scenario",
  "settings",
] as const;

export type TabId = (typeof TAB_IDS)[number];

const TAB_WIDTH_CLASS_BY_ID: Record<TabId, string> = {
  profile: "w-[83px]",
  details: "w-[84px]",
  assets: "w-[84px]",
  scenario: "w-[84px]",
  settings: "w-[83px]",
};

interface CreateTabsProps {
  currentTabId: TabId;
  setCurrentTabId: (id: TabId) => void;
  activeScenarioIndex: number;
  setActiveScenarioIndex: (index: number) => void;
  assetFieldArray: UseFieldArrayReturn<
    CharacterCreateFormValues,
    "asset",
    "id"
  >;
}

const CreateTabs = ({
  currentTabId,
  setCurrentTabId,
  activeScenarioIndex,
  setActiveScenarioIndex,
  assetFieldArray,
}: CreateTabsProps) => {
  const t = useTranslations("characterCreate.tabs");
  const {
    containerRef: tabNavRef,
    setTabRef,
    rect: underlineRect,
  } = useTabUnderline(currentTabId);

  const renderActiveTab = () => {
    switch (currentTabId) {
      case "profile":
        return <Profile />;
      case "details":
        return <DetailInfo />;
      case "assets":
        return <Asset assetFieldArray={assetFieldArray} />;
      case "scenario":
        return (
          <Scenario
            activeScenarioIndex={activeScenarioIndex}
            setActiveScenarioIndex={setActiveScenarioIndex}
          />
        );
      case "settings":
        return <Setting />;
      default:
        return null;
    }
  };

  return (
    <section className="flex h-full max-h-[calc(100dvh-var(--header-height)-5.5rem)] w-full max-w-[491px] min-w-0 shrink-0 flex-col gap-9 overflow-hidden lg:w-[491px]">
      {/* Tabs are unframed in the Figma design; the border belongs only to the tab row. */}
      <nav
        ref={tabNavRef as React.RefObject<HTMLElement>}
        className="relative flex h-10 shrink-0 gap-1"
      >
        {TAB_IDS.map((tabId) => {
          const isActive = currentTabId === tabId;

          return (
            <button
              type="button"
              key={tabId}
              ref={(el) => setTabRef(tabId, el)}
              onClick={() => setCurrentTabId(tabId)}
              className={cn(
                "body-5 flex h-10 cursor-pointer items-center justify-center whitespace-nowrap p-2.5 text-center text-font-2 outline-none transition-colors",
                TAB_WIDTH_CLASS_BY_ID[tabId],
                isActive ? "text-font-1" : "hover:text-font-1",
              )}
            >
              {t(tabId)}
            </button>
          );
        })}

        {/* 활성 표시(motion.span)와 같은 bottom-0/h-0.5 박스를 써서, 서로 다른 두께의
            border가 겹쳐 어긋나 보이지 않게 기준선도 같은 방식으로 그립니다. */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-card-selected" />

        <motion.span
          className="absolute bottom-0 h-0.5 bg-brand"
          initial={false}
          animate={{ x: underlineRect.left, width: underlineRect.width }}
          transition={SPRING_SNAPPY}
        />
      </nav>

      {/* 탭 내용이 뷰포트를 넘으면 nav는 고정한 채 내부만 스크롤 */}
      <div className="min-h-0 flex-1 overflow-y-auto">{renderActiveTab()}</div>
    </section>
  );
};

export default CreateTabs;
