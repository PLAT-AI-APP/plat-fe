"use client";
import React, { useState } from "react";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceCarousel from "./ExperienceCarousel";

const CharacterExperience = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleSelectedIndex = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <section className="flex flex-col gap-4.5">
      <ExperienceHeader
        handleSelectedIndex={handleSelectedIndex}
        selectedIndex={selectedIndex}
      />
      <ExperienceCarousel
        selectedIndex={selectedIndex}
        handleSelectedIndex={handleSelectedIndex}
      />
    </section>
  );
};

export default CharacterExperience;
