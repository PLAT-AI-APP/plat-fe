import { ScenarioData } from "@/type/scenario";
import { ScenarioPreview } from "./ScenarioPreview";
import { ScenarioSelect } from "./ScenarioSelect";
import { RefObject } from "react";

interface ScenarioSectionProps {
  currentScenario: ScenarioData;
  handleCurrentScenario: (scenario: ScenarioData) => void;
  isScenario: boolean;
  scenarioList: ScenarioData[];
  toggleIsScenario: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}
export const ScenarioSection = ({
  currentScenario,
  handleCurrentScenario,
  isScenario,
  scenarioList,
  toggleIsScenario,
  triggerRef,
}: ScenarioSectionProps) => {
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
