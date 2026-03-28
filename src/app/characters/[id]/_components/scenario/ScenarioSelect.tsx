import { ModalLayout } from "@/components/ModalLayout";
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
    className="relative flex justify-between px-4 py-2.5 bg-card border border-border-main rounded-xl w-full text-left"
  >
    <span className="text-sm font-medium text-font-1">
      {currentScenario.title}
    </span>

    {isScenario ? (
      <ArrowUp className="w-5 h-5 text-font-2" />
    ) : (
      <ArrowDown className="w-5 h-5 text-font-2" />
    )}

    {isScenario && (
      <ModalLayout
        triggerRef={triggerRef}
        onClose={toggleIsScenario}
        className="w-full"
      >
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
                {isActive && <Check className="w-4.5 h-4.5 text-brand" />}
              </li>
            );
          })}
        </ul>
      </ModalLayout>
    )}
  </button>
);
