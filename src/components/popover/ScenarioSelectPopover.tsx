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
                onClose();
                handleCurrentScenario(scenario);
              }}
              className={cn(
                "px-2.5 py-2 hover:bg-btn-hover rounded-lg flex justify-between items-center text-sm cursor-pointer",
                isActive ? "font-medium bg-btn-hover/50" : "font-normal",
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
