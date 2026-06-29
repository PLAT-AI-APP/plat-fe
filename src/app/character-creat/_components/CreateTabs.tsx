"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UseFieldArrayReturn } from "react-hook-form";
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
    <section className="flex h-full w-[491px] min-w-0 shrink-0 flex-col gap-9 overflow-hidden">
      {/* Tabs are unframed in the Figma design; the border belongs only to the tab row. */}
      <nav className="flex h-10 shrink-0 gap-1 border-b-2 border-card-selected">
        {TAB_IDS.map((tabId) => {
          const isActive = currentTabId === tabId;

          return (
            <button
              type="button"
              key={tabId}
              onClick={() => setCurrentTabId(tabId)}
              style={{ transition: "none", animation: "none" }}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center whitespace-nowrap border-b-2 border-transparent p-2.5 text-center text-[16px] font-normal leading-[1.5] text-font-2 outline-none transition-none duration-0",
                TAB_WIDTH_CLASS_BY_ID[tabId],
                isActive && "border-brand font-semibold text-font-1",
              )}
            >
              {/* Required markers are visual tab affordances, not part of the locale key. */}
              {t(tabId)}
              {REQUIRED_TAB_IDS.has(tabId) && "*"}
            </button>
          );
        })}
      </nav>

      {renderActiveTab()}
    </section>
  );
};

export default CreateTabs;
