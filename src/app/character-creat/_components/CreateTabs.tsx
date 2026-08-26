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

export const TAB_IDS = [
  "profile",
  "details",
  "assets",
  "scenario",
  "settings",
] as const;

export type TabId = (typeof TAB_IDS)[number];

const REQUIRED_TAB_IDS = new Set<TabId>([
  "profile",
  "details",
  "scenario",
  "settings",
]);

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
  assetFieldArray: UseFieldArrayReturn<CharacterCreateFormValues, "asset", "id">;
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
    <section className="flex h-full max-h-[calc(100vh-145px)] w-[491px] min-w-0 shrink-0 flex-col gap-9 overflow-hidden">
      {/* Tabs are unframed in the Figma design; the border belongs only to the tab row. */}
      <nav
        ref={tabNavRef as React.RefObject<HTMLElement>}
        className="relative flex h-10 shrink-0 gap-1 border-b-2 border-card-selected"
      >
        {TAB_IDS.map((tabId) => {
          const isActive = currentTabId === tabId;

          return (
            <button
              type="button"
              key={tabId}
              ref={(el) => setTabRef(tabId, el)}
              onClick={() => setCurrentTabId(tabId)}
              style={{ transition: "none", animation: "none" }}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center whitespace-nowrap p-2.5 text-center text-[16px] font-normal leading-[1.5] text-font-2 outline-none transition-none duration-0",
                TAB_WIDTH_CLASS_BY_ID[tabId],
                isActive && "font-semibold text-font-1",
              )}
            >
              {/* Required markers are visual tab affordances, not part of the locale key. */}
              {t(tabId)}
              {REQUIRED_TAB_IDS.has(tabId) && "*"}
            </button>
          );
        })}

        <motion.span
          className="absolute bottom-0 h-0.5 bg-brand"
          initial={false}
          animate={{ x: underlineRect.left, width: underlineRect.width }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      </nav>

      {/* 탭 내용이 뷰포트를 넘으면 nav는 고정한 채 내부만 스크롤 */}
      <div className="min-h-0 flex-1 overflow-y-auto">{renderActiveTab()}</div>
    </section>
  );
};

export default CreateTabs;
