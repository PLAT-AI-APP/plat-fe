import React from "react";
import PeriodTab from "./PeriodTab";
import CharacterShowcase from "../CharacterShowcase";
import { DUMMY_CHARACTERS } from "@/app/studio/[id]/_components/dummyData";

const RankingTabContents = () => {
  return (
    <section className="flex flex-col gap-4">
      <PeriodTab />

      <CharacterShowcase
        charArray={DUMMY_CHARACTERS}
        cardSize="S"
        rowGap={12}
        columnGap={12}
      />
    </section>
  );
};

export default RankingTabContents;
