import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type CharacterDetailTab = "settings" | "scenario" | "comments";

interface DetailTabsProps {
  commentsCount: number;
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

const DetailTabs = ({
  commentsCount,
  currentTab,
  onChange,
}: DetailTabsProps) => {
  const t = useTranslations("characterDetail");

  return (
    <nav className="flex w-full gap-1 bg-dark">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        const isCommentsTab = tab.id === "comments";

        return (
          <a
            key={tab.id}
            href={`#${tab.targetId}`}
            onClick={(event) => {
              event.preventDefault();
              onChange(tab.id, tab.targetId);
            }}
            className={cn(
              "body-4 flex h-11 items-center gap-1 justify-center border-b-2 text-font-2 transition-colors",
              isCommentsTab ? "w-[104px]" : "w-[88px]",
              isActive
                ? "border-brand text-font-1"
                : "border-main hover:text-font-1",
            )}
          >
            <span>{t(tab.labelKey)}</span>
            {isCommentsTab && (
              <span className="body-6 text-font-2">
                {t("tabs.commentsCount", { count: commentsCount })}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
};

export default DetailTabs;
