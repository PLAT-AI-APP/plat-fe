import React from "react";
import { PopoverLayout } from "./layout";
import { ScenarioData } from "@/type/scenario";
import { cn } from "@/lib/utils";
import Check from "@/icons/Check";

interface ScenarioSelectPopoverProps {
  onClose: () => void;
  handleCurrentScenario: (scenario: ScenarioData) => void;

  triggerRef: React.RefObject<HTMLElement | null>;
  scenarioList: ScenarioData[];
  currentScenario: ScenarioData;
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
          const isActive = currentScenario.id === scenario.id;

          return (
            <li
              key={scenario.id}
              onClick={(e) => {
                e.stopPropagation();
                handleCurrentScenario(scenario);
              }}
              className={cn(
                "px-2.5 py-2 rounded-lg flex justify-between items-center text-sm cursor-pointer",
                isActive
                  ? "font-medium text-brand bg-btn-hover/50"
                  : "text-font-2 hover:bg-btn-hover",
              )}
            >
              {scenario.title}
              {isActive && <Check className="w-4 h-4 text-brand" />}
            </li>
          );
        })}
      </ul>
    </PopoverLayout>
  );
};

export default ScenarioSelectPopover;
