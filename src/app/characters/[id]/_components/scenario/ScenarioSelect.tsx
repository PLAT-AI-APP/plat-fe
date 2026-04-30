"use client";
import React, { useRef } from "react";
import ScenarioSelectPopover from "@/components/popover/ScenarioSelectPopover";
import { ArrowDown, ArrowUp } from "@/icons";
import useToggle from "@/hooks/useToggle";
import { CharacterScenario } from "@/type/character";

interface ScenarioSelectProps {
  setCurrentScenario: (scenario: CharacterScenario) => void;
  scenarioList: CharacterScenario[];
  currentScenario: CharacterScenario | undefined;
}
export const ScenarioSelect = ({
  currentScenario,
  setCurrentScenario,
  scenarioList,
}: ScenarioSelectProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { isOpen, toggle, close } = useToggle();

  if (!currentScenario) return null;
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={toggle}
      className="relative flex justify-between px-4 py-2.5 bg-card hover:bg-card-hover border border-border-main rounded-xl w-full text-left"
    >
      <span className="text-sm text-font-1">{currentScenario.name}</span>
      {isOpen ? (
        <ArrowUp className="w-5 h-5 text-font-2" />
      ) : (
        <ArrowDown className="w-5 h-5 text-font-2" />
      )}
      {isOpen && (
        <ScenarioSelectPopover
          currentScenario={currentScenario}
          handleCurrentScenario={setCurrentScenario}
          onClose={close}
          scenarioList={scenarioList}
          triggerRef={triggerRef}
        />
      )}
    </button>
  );
};
