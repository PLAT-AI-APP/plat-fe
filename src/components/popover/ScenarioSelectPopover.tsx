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
