import React from "react";
import CharacterProfileCard from "./CharacterProfileCard";
import ChatPreview from "./ChatPreview";

interface ExperienceSlideProps {
  index: number;
}

const ExperienceSlide = ({ index }: ExperienceSlideProps) => {
  return (
    <div className="flex min-w-full h-full">
      <CharacterProfileCard index={index} />
      <ChatPreview />
    </div>
  );
};

export default ExperienceSlide;
