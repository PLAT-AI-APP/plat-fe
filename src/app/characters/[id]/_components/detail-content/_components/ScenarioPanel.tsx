"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ScenarioSelectPopover from "@/components/popover/ScenarioSelectPopover";
import { ArrowDown, Message } from "@/icons";
import { cn } from "@/lib/utils";
import { CharacterDetail, CharacterScenario } from "@/type/character";

interface ScenarioPanelProps {
  character: CharacterDetail;
}

const SCENARIO_CONTENT_MAX_HEIGHT = 1471;

const ScenarioPanel = ({ character }: ScenarioPanelProps) => {
  const t = useTranslations("characterDetail");
  // 시나리오 변경 버튼을 팝오버 위치 기준으로 사용하기 위해 ref로 보관합니다.
  const scenarioSelectTriggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    character.scenarios[0]?.scenarioId,
  );
  const [isScenarioPopoverOpen, setIsScenarioPopoverOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const selectedScenario = useMemo(
    () =>
      character.scenarios.find(
        (scenario) => scenario.scenarioId === selectedScenarioId,
      ) ?? character.scenarios[0],
    [character.scenarios, selectedScenarioId],
  );

  useEffect(() => {
    if (!contentRef.current) return;

    const contentElement = contentRef.current;

    // 시나리오 콘텐츠 실제 높이가 기준값 이상이면 하단에 더 보기 버튼을 노출합니다.
    // 펼침 애니메이션의 목표 높이로도 쓰이므로 실제 높이를 함께 보관합니다.
    const updateContentOverflowState = () => {
      setContentHeight(contentElement.scrollHeight);
      setShouldShowMoreButton(
        contentElement.scrollHeight >= SCENARIO_CONTENT_MAX_HEIGHT,
      );
    };

    updateContentOverflowState();

    const resizeObserver = new ResizeObserver(updateContentOverflowState);
    resizeObserver.observe(contentElement);

    return () => resizeObserver.disconnect();
  }, [selectedScenario?.contents]);

  const handleScenarioChange = (scenario: CharacterScenario) => {
    setSelectedScenarioId(scenario.scenarioId);
    setIsExpanded(false);
  };

  if (!selectedScenario) return null;

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h2 className="title-2 text-font-1">{selectedScenario.name}</h2>
        {selectedScenario.description && (
          <p className="body-2 whitespace-pre-wrap text-font-2">
            {selectedScenario.description}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-5 rounded-2xl bg-darkest px-5 py-7">
        <div className="relative">
          <button
            ref={scenarioSelectTriggerRef}
            type="button"
            onClick={() => setIsScenarioPopoverOpen((prev) => !prev)}
            className="title-5 flex h-11 w-full items-center justify-between rounded-xl border border-main bg-card px-4 py-2.5 text-font-1"
          >
            {selectedScenario.name}
            <ArrowDown
              className={cn(
                "size-5 text-font-2",
                isScenarioPopoverOpen && "rotate-180",
              )}
            />
          </button>

          {isScenarioPopoverOpen && (
            <ScenarioSelectPopover
              currentScenario={selectedScenario}
              handleCurrentScenario={handleScenarioChange}
              onClose={() => setIsScenarioPopoverOpen(false)}
              scenarioList={character.scenarios}
              triggerRef={scenarioSelectTriggerRef}
            />
          )}
        </div>

        <motion.div
          initial={false}
          animate={{
            height: shouldShowMoreButton
              ? isExpanded
                ? contentHeight
                : SCENARIO_CONTENT_MAX_HEIGHT
              : "auto",
          }}
          transition={{ duration: 0.24, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {/* 높이 측정은 애니메이션 대상 바깥에서 해야 실제 콘텐츠 높이를 얻을 수 있습니다. */}
          <div ref={contentRef} className="flex flex-col items-center gap-5">
            {selectedScenario.contents?.map((content) => {
              if (content.type === "asset") {
                return (
                  <Image
                    key={content.id}
                    src={content.value}
                    alt={t("assetAlt", { name: selectedScenario.name })}
                    width={482}
                    height={289}
                    className="h-[289px] w-[482px] rounded-2xl object-cover"
                  />
                );
              }

              if (content.type === "chat") {
                return (
                  <div key={content.id} className="flex w-full gap-2">
                    <Image
                      src={character.profileImage}
                      alt={character.title}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                      <p className="body-4 text-font-1">{character.title}</p>
                      <p className="body-4 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl bg-card px-3 py-2 text-font-1">
                        {content.value}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={content.id} className="flex w-full gap-5">
                  <Message className="size-7 shrink-0 text-font-2" />
                  <p className="body-4 min-w-0 flex-1 whitespace-pre-wrap text-font-2">
                    {content.value}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {shouldShowMoreButton && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="body-4 flex w-full items-center justify-center gap-1 rounded-xl border border-main bg-darkest py-3 text-font-2 transition-colors hover:bg-dark hover:text-font-1"
          >
            {isExpanded ? t("collapse") : t("expand")}
            <ArrowDown
              className={cn(
                "size-[18px] transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default ScenarioPanel;
