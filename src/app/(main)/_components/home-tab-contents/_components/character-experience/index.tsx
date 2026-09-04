"use client";

import React, { useState } from "react";
import { useOfficialPreviewQuery } from "@/api/home/getOfficialPreview";
import { ErrorState } from "@/components/state";
import SkeletonCharacterExperience from "@/components/skeleton/SkeletonCharacterExperience";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceCarousel from "./ExperienceCarousel";

/** 캐러셀에 올릴 최대 장수. 헤더 썸네일 개수와 함께 움직입니다. */
const MAX_SLIDES = 3;

const CharacterExperience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, error, isError, isLoading, refetch } =
    useOfficialPreviewQuery();

  const items = (data ?? []).slice(0, MAX_SLIDES);

  const handleSelectedIndex = (index: number) => {
    setSelectedIndex(index);
  };

  const header = (
    <ExperienceHeader
      items={isLoading || isError ? [] : items}
      handleSelectedIndex={handleSelectedIndex}
      selectedIndex={selectedIndex}
    />
  );

  // 예전에는 setTimeout(2000) 으로 로딩을 흉내 냈다. 데이터와 무관한 지연이라
  // 홈에 들어올 때마다 이유 없이 2초를 기다려야 했다.
  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        {header}
        <SkeletonCharacterExperience />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col gap-4">
        {header}
        <ErrorState error={error} onRetry={refetch} />
      </section>
    );
  }

  // 보여줄 공식 캐릭터가 없으면 섹션을 통째로 내린다.
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      {header}

      <ExperienceCarousel
        items={items}
        selectedIndex={selectedIndex}
        handleSelectedIndex={handleSelectedIndex}
      />
    </section>
  );
};

export default CharacterExperience;
