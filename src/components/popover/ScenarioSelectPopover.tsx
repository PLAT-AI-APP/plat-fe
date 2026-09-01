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
}
const ScenarioSelectPopover = ({
  onClose,
  handleCurrentScenario,
  triggerRef,
  scenarioList,
  currentScenario,
}: ScenarioSelectPopoverProps) => {
  return (
    <PopoverLayout triggerRef={triggerRef} onClose={onClose} className="w-full">
      <ul className="flex flex-col gap-1">
        {scenarioList.map((scenario) => {
          const isActive = currentScenario?.scenarioId === scenario.scenarioId;

          return (
            <li
              key={scenario.scenarioId}
              onClick={(e) => {
                e.stopPropagation();
                handleCurrentScenario(scenario);
                onClose();
              }}
              className={cn(
                "body-4 flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1",
                isActive && "bg-btn-hover/50 text-font-1",
              )}
            >
              {scenario.name}
              {isActive && <Check className="w-4 h-4 text-brand" />}
            </li>
          );
        })}
      </ul>
    </PopoverLayout>
  );
};

export default ScenarioSelectPopover;
