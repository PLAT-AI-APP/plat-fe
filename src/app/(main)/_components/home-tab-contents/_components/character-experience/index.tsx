"use client";
import React, { useState } from "react";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceCarousel from "./ExperienceCarousel";
import SkeletonCharacterExperience from "@/components/skeleton/SkeletonCharacterExperience";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";

const CharacterExperience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: officialPreviewList, isPending } = useOfficialPreviewQuery();
  const items = officialPreviewList ?? [];

  const handleSelectedIndex = (index: number) => {
    setSelectedIndex(index);
  };

  if (!isPending && items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <ExperienceHeader
        items={items}
        handleSelectedIndex={handleSelectedIndex}
        selectedIndex={selectedIndex}
      />

      {/* 로딩 상태에 따른 조건부 렌더링 */}
      {isPending ? (
        <SkeletonCharacterExperience />
      ) : (
        <ExperienceCarousel
          items={items}
          selectedIndex={selectedIndex}
          handleSelectedIndex={handleSelectedIndex}
        />
      )}
    </section>
  );
};

export default CharacterExperience;
