import { ModalLayout } from "@/components/ModalLayout";
import ScenarioSelectPopover from "@/components/popover/ScenarioSelectPopover";
import { ArrowDown, ArrowUp } from "@/icons";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { ScenarioData } from "@/type/scenario";

interface ScenarioSelectProps {
  isScenario: boolean;
  toggleIsScenario: () => void;
  currentScenario: ScenarioData;
  scenarioList: ScenarioData[];
  handleCurrentScenario: (scenario: ScenarioData) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const ScenarioSelect = ({
  isScenario,
  toggleIsScenario,
  currentScenario,
  scenarioList,
  handleCurrentScenario,
  triggerRef,
}: ScenarioSelectProps) => (
  <button
    ref={triggerRef}
    type="button"
    onClick={toggleIsScenario}
    className="relative flex justify-between px-4 py-2.5 bg-card hover:bg-card-hover border border-border-main rounded-xl w-full text-left"
  >
    <span className="text-sm text-font-1">{currentScenario.title}</span>

    {isScenario ? (
      <ArrowUp className="w-5 h-5 text-font-2" />
    ) : (
      <ArrowDown className="w-5 h-5 text-font-2" />
    )}

    {isScenario && (
      <ScenarioSelectPopover
        currentScenario={currentScenario}
        handleCurrentScenario={handleCurrentScenario}
        onClose={toggleIsScenario}
        scenarioList={scenarioList}
        triggerRef={triggerRef}
      />
    )}
  </button>
);
