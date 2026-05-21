import React from "react";
import ExperienceHeader from "./ExperienceHeader";
import ExperienceCarousel from "./ExperienceCarousel";

const CharacterExperience = () => {
  return (
    <section className="flex flex-col gap-4.5">
      <ExperienceHeader />
      <ExperienceCarousel />
    </section>
  );
};

export default CharacterExperience;
