"use client";
import React, { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";
import SkeletonCharacterCard from "../skeleton/SkeletonCard";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import ArrowLineRight from "@/icons/ArrowLineRight";
import Link from "next/link";

interface CharacterGridProps {
  cardHeight?: number;
  // 가로, 세로 간격을 위한 props 추가
  columnGap?: number;
  rowGap?: number;
  // isNew?: boolean;
  // isOfficial?: boolean;
  char: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
  }[];
  gridClassName?: ClassValue;
  cardClassName?: ClassValue;

  title?: string;
  TitleLogo?: React.ReactNode;
  moreLink?: string;
}

const CharacterGrid = ({
  char,
  columnGap = 20, // 기본 가로 간격 20px
  rowGap = 20, // 기본 세로 간격 20px
  // isNew = false,
  // isOfficial = false,
  gridClassName,
  cardClassName,
  TitleLogo,
  title,
  moreLink = "",
}: CharacterGridProps) => {
  // const gap = 20; // 기존 고정 변수 대신 props 사용
  // 공식: (줄 수 * 카드 높이) + ((줄 수 - 1) * 간격)
  // const totalHeight = lineCount * cardHeight + (lineCount - 1) * gap;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      {title && (
        <header className="flex justify-between">
          <h2 className="flex items-center gap-2.5 col-span-full pl-2 font-medium text-[20px]">
            {title} {TitleLogo && TitleLogo}
          </h2>

          {moreLink && (
            <Link
              // href={`/${moreLink}`}
              href={{
                query: {
                  tab: moreLink,
                },
              }}
              className="py-1.5 pr-2.5 pl-3.5 rounded-[100px] hover:bg-btn-hover flex gap-1 items-center text-sm text-font-2"
            >
              더보기 <ArrowLineRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </header>
      )}

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
          gridClassName,
        )}
        style={{
          columnGap: `${columnGap}px`,
          rowGap: `${rowGap}px`,
        }}
      >
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
                // isNew={isNew}
                // isOfficial={isOfficial}
                className={cardClassName}
              />
            ))}
      </div>
    </section>
  );
};

export default CharacterGrid;
