"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CharacterScenario } from "@/type/character";
import { getMockCharacterScenarios } from "../../_data/mockCharacterData";
import { ScenarioPreview } from "./ScenarioPreview";
import { ScenarioSelect } from "./ScenarioSelect";

interface ScenarioSectionProps {
  characterId: string;
}

export const ScenarioSection = ({ characterId }: ScenarioSectionProps) => {
  const t = useTranslations();
  const scenarios = useMemo(
    () => getMockCharacterScenarios(characterId),
    [characterId],
  );
  const [currentScenario, setCurrentScenario] = useState<
    CharacterScenario | undefined
  >(scenarios[0]);

  if (scenarios.length === 0) {
    return <div>{t("characterDetail.noScenario")}</div>;
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="title-3">{t("characterDetail.scenarioTitle")}</p>
      <div className="flex flex-col gap-6.5">
        <ScenarioSelect
          currentScenario={currentScenario}
          setCurrentScenario={setCurrentScenario}
          scenarioList={scenarios}
        />
        <ScenarioPreview currentScenario={currentScenario} />
      </div>
    </section>
  );
};
