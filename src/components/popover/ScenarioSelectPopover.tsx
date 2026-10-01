import React from "react";
import { PopoverLayout } from "./layout";
import { cn } from "@/lib/utils";
import Check from "@/icons/Check";
import { CharacterScenario } from "@/type/character";

interface ScenarioSelectPopoverProps {
  onClose: () => void;
  handleCurrentScenario: (scenario: CharacterScenario) => void;

  triggerRef: React.RefObject<HTMLElement | null>;
  scenarioList: CharacterScenario[];
  currentScenario: CharacterScenario | undefined;
  /**
   * 트리거가 스크롤되는 모달 안에 있을 때만 켠다. 화면 기준(fixed)으로 그려 모달의 스크롤 영역에서 빠지지만,
   * 자리를 열릴 때 한 번만 재므로 트리거가 움직이면 따라가지 못한다.
   */
  matchTriggerWidth?: boolean;
}
const ScenarioSelectPopover = ({
  onClose,
  handleCurrentScenario,
  triggerRef,
  scenarioList,
  currentScenario,
  matchTriggerWidth = false,
}: ScenarioSelectPopoverProps) => {
  return (
    <PopoverLayout
      triggerRef={triggerRef}
      onClose={onClose}
      matchTriggerWidth={matchTriggerWidth}
      // 기본은 트리거를 감싼 relative 상자 기준이라, 스크롤해도 트리거를 그대로 따라다닌다.
      className={matchTriggerWidth ? undefined : "left-0 max-w-none"}
    >
      <ul className="flex flex-col gap-1">
        {scenarioList.map((scenario) => {
          const isActive = currentScenario?.scenarioId === scenario.scenarioId;

          return (
            <li key={scenario.scenarioId}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCurrentScenario(scenario);
                  onClose();
                }}
                className={cn(
                  "menu-item body-5 w-full cursor-pointer justify-between text-left text-font-2 hover:text-font-1",
                  isActive && "bg-btn-hover/50 text-font-1",
                )}
              >
                {scenario.name}
                {isActive && <Check className="h-4 w-4 text-brand" />}
              </button>
            </li>
          );
        })}
      </ul>
    </PopoverLayout>
  );
};

export default ScenarioSelectPopover;
