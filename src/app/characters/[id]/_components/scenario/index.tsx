"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useCharacterScenarioListQuery } from "@/api/character/getCharacterScenarioList";
import { CharacterScenario } from "@/type/character";
import { ScenarioPreview } from "./ScenarioPreview";
import { ScenarioSelect } from "./ScenarioSelect";

interface ScenarioSectionProps {
  characterId: string;
}

export const ScenarioSection = ({ characterId }: ScenarioSectionProps) => {
  const t = useTranslations();
  const { data: scenarios } = useCharacterScenarioListQuery(characterId);
  const [currentScenario, setCurrentScenario] = useState<
    CharacterScenario | undefined
  >(scenarios?.[0]);

  if (!currentScenario && scenarios && scenarios.length > 0) {
    setCurrentScenario(scenarios[0]);
  }

  if (!scenarios || scenarios.length === 0) {
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
