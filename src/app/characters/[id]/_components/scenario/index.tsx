"use client";
import React, { useState, useRef } from "react";
import { ScenarioData } from "@/type/scenario";
import { ScenarioPreview } from "./ScenarioPreview";
import { ScenarioSelect } from "./ScenarioSelect";

interface ScenarioSectionProps {
  scenarioList: ScenarioData[];
}

export const ScenarioSection = ({ scenarioList }: ScenarioSectionProps) => {
  const [isScenario, setIsScenario] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ScenarioData>(
    scenarioList[0],
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleIsScenario = () => {
    setIsScenario(!isScenario);
  };

  const handleCurrentScenario = (scenario: ScenarioData) => {
    setCurrentScenario(scenario);
    setIsScenario(false);
  };

  return (
    <section className="flex flex-col gap-3">
      <p className="text-font-1 font-medium">시나리오</p>
      <div className="flex flex-col gap-6.5">
        <ScenarioSelect
          isScenario={isScenario}
          toggleIsScenario={toggleIsScenario}
          currentScenario={currentScenario}
          scenarioList={scenarioList}
          handleCurrentScenario={handleCurrentScenario}
          triggerRef={triggerRef}
        />
        <ScenarioPreview {...currentScenario} />
      </div>
    </section>
  );
};
