import React from "react";
import CharacterCard from "./CharacterCard";

interface CharacterGridProps {
  lineCount: number;
  cardHeight: number;
  isNew?: boolean;
  isOfficial?: boolean;
  char: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  }[];
}

const CharacterGrid = ({
  char,
  lineCount,
  cardHeight,
  isNew = false,
  isOfficial = false,
}: CharacterGridProps) => {
  const gap = 20;
  // 공식: (줄 수 * 카드 높이) + ((줄 수 - 1) * 간격)
  const totalHeight = lineCount * cardHeight + (lineCount - 1) * gap;

  return (
    <div
      style={{ maxHeight: `${totalHeight}px` }}
      className="grid grid-cols-[repeat(auto-fill,178px)] gap-5 justify-start overflow-hidden"
    >
      {char.map((character, index) => (
        <CharacterCard
          key={`${character.name}-${index}`}
          char={character}
          cardHeight={cardHeight}
          isNew={isNew}
          isOfficial={isOfficial}
        />
      ))}
    </div>
  );
};

export default CharacterGrid;
