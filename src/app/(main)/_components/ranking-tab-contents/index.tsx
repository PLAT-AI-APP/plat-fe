import React from "react";
import PeriodTab from "./PeriodTab";
import CharacterGrid from "@/components/character/CharacterGrid";
import { DUMMY_CHARACTERS } from "@/app/studio/[id]/_components/dummyData";

const RankingTabContents = () => {
  return (
    <section className="flex flex-col gap-4">
      <PeriodTab />

      <CharacterGrid char={DUMMY_CHARACTERS} />
    </section>
  );
};

export default RankingTabContents;
