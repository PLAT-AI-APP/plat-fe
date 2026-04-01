import React, { ReactElement } from "react";
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
  title?: string;
  TitleLogo?: React.ReactNode;
}

const CharacterGrid = ({
  char,
  lineCount,
  cardHeight,
  isNew = false,
  isOfficial = false,
  title,
  TitleLogo,
}: CharacterGridProps) => {
  const gap = 20;
  // 공식: (줄 수 * 카드 높이) + ((줄 수 - 1) * 간격)
  const totalHeight = lineCount * cardHeight + (lineCount - 1) * gap;

  return (
    <div
      style={{ maxHeight: `${totalHeight + 60}px` }} // 제목 높이만큼 여유 공간 추가
      // justify-center로 카드 덩어리를 중앙으로 보냅니다.
      className="grid grid-cols-[repeat(auto-fill,178px)] gap-5 justify-center overflow-hidden w-full"
    >
      {title && (
        <h2
          id="today-pick-title"
          className="flex items-center gap-2.5 col-span-full pl-2 font-medium text-[21px]"
        >
          {title} {TitleLogo && TitleLogo}
        </h2>
      )}

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
