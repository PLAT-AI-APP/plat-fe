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
    <nav className="flex w-full gap-1 border-b border-main bg-dark">
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
              "flex h-11 items-center justify-center border-b-2 border-transparent text-font-2 transition-none",
              isCommentsTab ? "w-[104px]" : "w-[88px]",
              isActive && "border-brand text-font-1",
            )}
          >
            {isCommentsTab ? (
              <>
                <span className={isActive ? "title-3" : "body-2"}>
                  {t(tab.labelKey)}
                </span>
                <span className={isActive ? "title-6" : "body-5"}>
                  {t("tabs.commentsCount", { count: commentsCount })}
                </span>
              </>
            ) : (
              <span className={isActive ? "title-3" : "body-2"}>
                {t(tab.labelKey)}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
};

export default DetailTabs;
