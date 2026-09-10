import type { RefObject } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTabUnderline } from "@/hooks/dom/useTabUnderline";
import { SPRING_SNAPPY } from "@/constants/motion";
import { cn } from "@/lib/utils";

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
  const {
    containerRef: tabNavRef,
    setTabRef,
    rect: underlineRect,
  } = useTabUnderline(currentTab);

  return (
    <nav
      ref={tabNavRef as RefObject<HTMLElement>}
      className="relative flex w-full gap-1 bg-dark"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        const isCommentsTab = tab.id === "comments";

        return (
          <a
            key={tab.id}
            ref={(el) => setTabRef(tab.id, el)}
            href={`#${tab.targetId}`}
            onClick={(event) => {
              event.preventDefault();
              onChange(tab.id, tab.targetId);
            }}
            className={cn(
              "body-5 flex h-11 items-center gap-1 justify-center text-font-2 transition-colors",
              isCommentsTab ? "w-[104px]" : "w-[88px]",
              isActive ? "text-font-1" : "hover:text-font-1",
            )}
          >
            <span>{t(tab.labelKey)}</span>
            {isCommentsTab && (
              <span className="body-7 text-font-2">
                {t("tabs.commentsCount", { count: commentsCount })}
              </span>
            )}
          </a>
        );
      })}

      {/* 활성 표시(motion.span)와 같은 bottom-0/h-0.5 박스를 써서, 탭 사이 gap이나
          마지막 탭 뒤 여백에서 기준선이 끊겨 보이지 않게 전체 폭에 한 번만 그립니다. */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-main" />

      <motion.span
        className="absolute bottom-0 h-0.5 bg-brand"
        initial={false}
        animate={{ x: underlineRect.left, width: underlineRect.width }}
        transition={SPRING_SNAPPY}
      />
    </nav>
  );
};

export default DetailTabs;
