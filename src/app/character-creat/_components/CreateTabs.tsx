"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Asset from "./asset";
import DetailInfo from "./detail-info";
import Profile from "./profile";
import Scenario from "./scenario";
import Setting from "./setting";

export const TAB_IDS = [
  "profile",
  "details",
  "assets",
  "scenario",
  "settings",
] as const;

export type TabId = (typeof TAB_IDS)[number];

interface CreateTabsProps {
  currentTabId: TabId;
  setCurrentTabId: (id: TabId) => void;
  activeScenarioIndex: number;
  setActiveScenarioIndex: (index: number) => void;
}

const CreateTabs = ({
  currentTabId,
  setCurrentTabId,
  activeScenarioIndex,
  setActiveScenarioIndex,
}: CreateTabsProps) => {
  const t = useTranslations("characterCreate.tabs");

  const renderActiveTab = () => {
    switch (currentTabId) {
      case "profile":
        return <Profile />;
      case "details":
        return <DetailInfo />;
      case "assets":
        return <Asset />;
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
    <section className="h-full max-w-125 flex-1 rounded-3xl border border-border-main bg-bg-darker p-5">
      <nav className="mb-9 flex gap-1 border-b-2 border-font-disabled">
        {TAB_IDS.map((tabId) => (
          <button
            type="button"
            key={tabId}
            onClick={() => setCurrentTabId(tabId)}
            className={cn(
              "body-4 translate-y-0.5 cursor-pointer p-2.5 text-font-2 outline-none",
              currentTabId === tabId &&
                "title-5 border-b-2 border-brand text-font-1",
            )}
          >
            {t(tabId)}
          </button>
        ))}
      </nav>

      {renderActiveTab()}
    </section>
  );
};

export default CreateTabs;
