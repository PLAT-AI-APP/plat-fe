import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type CharacterDetailTab = "settings" | "scenario" | "comments";

interface DetailTabsProps {
  currentTab: CharacterDetailTab;
  onChange: (tab: CharacterDetailTab, targetId: string) => void;
}

const tabs: { id: CharacterDetailTab; labelKey: string; targetId: string }[] = [
  {
    id: "settings",
    labelKey: "tabs.settings",
    targetId: "character-detail-settings",
  },
  {
    id: "scenario",
    labelKey: "tabs.scenario",
    targetId: "character-detail-scenario",
  },
  {
    id: "comments",
    labelKey: "tabs.comments",
    targetId: "character-detail-comments",
  },
];

const DetailTabs = ({ currentTab, onChange }: DetailTabsProps) => {
  const t = useTranslations("characterDetail");

  return (
    <nav className="flex w-full gap-1 border-b border-border-main bg-bg-dark">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <a
            key={tab.id}
            href={`#${tab.targetId}`}
            onClick={(event) => {
              event.preventDefault();
              onChange(tab.id, tab.targetId);
            }}
            className={cn(
              "body-2 flex h-11 w-[84px] items-center justify-center border-b-2 border-transparent text-font-2 transition-none",
              isActive && "title-3 border-brand text-font-1",
            )}
          >
            {t(tab.labelKey)}
          </a>
        );
      })}
    </nav>
  );
};

export default DetailTabs;
