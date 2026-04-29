import React from "react";
import { cn } from "@/lib/utils";
import Profile from "./profile";
import DetailInfo from "./detail-info";
import Asset from "./asset";
import Scenario from "./scenario";
import Setting from "./setting";

export const TABS = [
  { id: "profile", title: "프로필", component: Profile },
  { id: "details", title: "상세정보", component: DetailInfo },
  { id: "assets", title: "에셋", component: Asset },
  { id: "scenario", title: "시나리오", component: Scenario },
  { id: "settings", title: "설정", component: Setting },
] as const;

export type TabId = (typeof TABS)[number]["id"];

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
  const activeTab = TABS.find((tab) => tab.id === currentTabId);
  const ActiveComponent = activeTab?.component;

  return (
    <section className="max-w-125 flex-1 h-full p-5 rounded-3xl bg-bg-darker border border-border-main">
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
  );
};

export default CreateTabs;
