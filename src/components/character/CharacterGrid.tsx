"use client";
import React, { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";
import SkeletonCharacterCard from "../skeleton/SkeletonCard";
import { cn } from "@/lib/utils";

interface CharacterGridProps {
  // lineCount: number;
  cardHeight: number;
  // 가로, 세로 간격을 위한 props 추가
  columnGap?: number;
  rowGap?: number;
  isNew?: boolean;
  isOfficial?: boolean;
  char: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  }[];
  // title?: string;
  // TitleLogo?: React.ReactNode;
}

const CharacterGrid = ({
  char,
  // lineCount,
  columnGap = 20, // 기본 가로 간격 20px
  rowGap = 20, // 기본 세로 간격 20px
  isNew = false,
  isOfficial = false,
  // title,
  // TitleLogo,
}: CharacterGridProps) => {
  // const gap = 20; // 기존 고정 변수 대신 props 사용
  // 공식: (줄 수 * 카드 높이) + ((줄 수 - 1) * 간격)
  // const totalHeight = lineCount * cardHeight + (lineCount - 1) * gap;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. 여기서는 데이터를 가져오는 로직만 수행하고, 완료되면 false로만 바꿉니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "grid w-full justify-center",
        // 362px 미만일 때 기본 1열 (또는 필요에 따라 2열)
        "grid-cols-1",
        "@[362px]:grid-cols-2",
        "@[549px]:grid-cols-3",
        "@[736px]:grid-cols-4",
        "@[923px]:grid-cols-5",
        "@[1110px]:grid-cols-6",
      )}
      style={{
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
      }}
    >
      {/* {title && (
        <h2
          id="today-pick-title"
          className="flex items-center gap-2.5 col-span-full pl-2 font-medium text-[21px]"
        >
          {title} {TitleLogo && TitleLogo}
        </h2>
      )} */}

      {isLoading
        ? // 로딩 중일 때: 실제 데이터 개수만큼 스켈레톤을 그리드 안에 배치
          char.map((_, index) => (
            <SkeletonCharacterCard key={`skeleton-${index}`} />
          ))
        : // 로딩 완료 시: 실제 카드 배치
          char.map((character, index) => (
            <CharacterCard
              key={`${character.name}-${index}`}
              char={character}
              isNew={isNew}
              isOfficial={isOfficial}
            />
          ))}
    </div>
  );
};

export default CharacterGrid;
