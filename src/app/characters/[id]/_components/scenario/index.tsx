"use client";
import React, { useState } from "react";
import { ScenarioPreview } from "./ScenarioPreview";
import { ScenarioSelect } from "./ScenarioSelect";
import { useCharacterScenarioListQuery } from "@/api/character/getCharacterScenarioList";
import { CharacterScenario } from "@/type/character";

interface ScenarioSectionProps {
  characterId: string;
}

export const ScenarioSection = ({ characterId }: ScenarioSectionProps) => {
  // useSuspenseQuery 대신 일반 useQuery를 사용하더라도 HydrationBoundary가 있으면
  // 초기 렌더링 시 데이터를 즉시 사용
  const { data: scenarios } = useCharacterScenarioListQuery(characterId);

  // 초기 상태를 scenarios?[0]으로 설정 (옵셔널 체이닝 활용)
  // 타입은 CharacterScenario | undefined 가 됩니다.
  const [currentScenario, setCurrentScenario] = useState<
    CharacterScenario | undefined
  >(scenarios?.[0]);

  // 만약 scenarios가 처음에 undefined였다가 들어왔을 때를 대비한 동기화
  // (Hydration 시에는 즉시 들어오지만, 클라이언트에서 업데이트 시 필요할 수 있음)
  if (!currentScenario && scenarios && scenarios.length > 0) {
    setCurrentScenario(scenarios[0]);
  }

  // 데이터가 아예 없을 때의 방어 로직
  if (!scenarios || scenarios.length === 0) {
    return <div>등록된 시나리오가 없습니다.</div>;
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="title-3">시나리오</p>
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
