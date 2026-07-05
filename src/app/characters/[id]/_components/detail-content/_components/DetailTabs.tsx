import { cn } from "@/lib/utils";

export type CharacterDetailTab = "settings" | "scenario" | "comments";

interface DetailTabsProps {
  currentTab: CharacterDetailTab;
  onChange: (tab: CharacterDetailTab, targetId: string) => void;
}

const tabs: { id: CharacterDetailTab; label: string; targetId: string }[] = [
  { id: "settings", label: "설정", targetId: "character-detail-settings" },
  { id: "scenario", label: "시나리오", targetId: "character-detail-scenario" },
  { id: "comments", label: "댓글", targetId: "character-detail-comments" },
];

const DetailTabs = ({ currentTab, onChange }: DetailTabsProps) => {
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
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
};

export default DetailTabs;
