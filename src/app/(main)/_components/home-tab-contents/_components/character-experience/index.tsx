"use client";
import React, { useState, useEffect } from "react";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceCarousel from "./ExperienceCarousel";
import SkeletonCharacterExperience from "@/components/skeleton/SkeletonCharacterExperience";

const CharacterExperience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const handleSelectedIndex = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    // 2초(2000ms) 뒤에 로딩 상태를 false로 변경하여 실제 캐러셀 렌더링
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <ExperienceHeader
        handleSelectedIndex={handleSelectedIndex}
        selectedIndex={selectedIndex}
      />

      {/* 로딩 상태에 따른 조건부 렌더링 */}
      {isLoading ? (
        <SkeletonCharacterExperience />
      ) : (
        <ExperienceCarousel
          selectedIndex={selectedIndex}
          handleSelectedIndex={handleSelectedIndex}
        />
      )}
    </section>
  );
};

export default CharacterExperience;
