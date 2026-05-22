"use client"; // 상태와 useEffect를 사용하므로 클라이언트 컴포넌트로 명시해야 합니다.
import React, { useState, useEffect } from "react";
import CharacterCard from "../../CharacterCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CharacterCardSkeleton } from "../../CharacterCardSkeleton";

interface CharacterShowcaseProps {
  title: string;
  charArray: {
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string[] | string;
    creatorName?: string; // 옵셔널 처리
  }[];
  cardSize?: "S" | "M" | "L" | "XL";
  limit?: number;
  allViewLink?: string;
  TitleLogo?: React.ReactNode;
  columnGap?: number;
  rowGap?: number;
}

const CharacterShowcase = ({
  title,
  charArray = [],
  cardSize = "M",
  limit,
  allViewLink,
  TitleLogo,
  columnGap,
  rowGap,
}: CharacterShowcaseProps) => {
  // 인위적인 로딩 상태 관리 (초기값: true)
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 지정된 시간 후 로딩 상태 해제
  useEffect(() => {
    // 2초(2000ms) 동안 스켈레톤을 보여줍니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // 메모리 누수 방지를 위한 클린업
  }, []);

  const displayChars = limit ? charArray.slice(0, limit) : charArray;

  // 스켈레톤을 보여줄 개수 (limit가 있으면 limit만큼, 없으면 기본값 4개 혹은 배열 길이)
  const skeletonCount =
    limit || (displayChars.length > 0 ? displayChars.length : 4);

  // 실제 데이터가 없고 로딩도 끝났을 때 방어
  if (!isLoading && displayChars.length === 0) return null;

  return (
    <section className="w-full h-auto max-w-300 flex flex-col gap-4 justify-center mx-auto">
      <header className="flex justify-between items-center pl-2">
        <h2 className="flex items-center gap-2 heading-3">
          {title} {TitleLogo && TitleLogo}
        </h2>

        {allViewLink && (
          <Link
            href={{
              query: { tab: allViewLink },
            }}
            className="title-3 text-white underline"
          >
            전체보기
          </Link>
        )}
      </header>

      <div
        className={cn(
          "flex gap-4 flex-wrap",
          cardSize === "XL" && "justify-between",
        )}
        style={{
          gap: `${rowGap}px ${columnGap}px`, // rowGap과 columnGap을 한 번에 설정
        }}
      >
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <CharacterCardSkeleton
                key={`skeleton-${index}`}
                size={cardSize}
              />
            ))
          : displayChars.map((char, index) => (
              <CharacterCard
                key={`card-${index}`}
                size={cardSize}
                title={char.name} // 더미가 아닌 실제 데이터로 수정
                description={char.dec}
                creatorName={char.creatorName || "Unknown"}
                chatCount={char.chatCount}
                images={"/images/sample.png"}
              />
            ))}
      </div>
    </section>
  );
};

export default CharacterShowcase;
