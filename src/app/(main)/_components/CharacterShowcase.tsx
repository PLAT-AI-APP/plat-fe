"use client";

import { ArrowLeft, ArrowRight } from "@/icons";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CharacterCard from "./CharacterCard";
import { CharacterCardSkeleton } from "./CharacterCardSkeleton";

interface CharacterShowcaseProps {
  title?: string;
  charArray: {
    name: string;
    chatCount?: number;
    dec: string;
    tag?: string[];
    img: string[] | string;
    creatorName?: string;
  }[];
  cardSize?: "S" | "M" | "L" | "XL";
  limit?: number;
  allViewLink?: string;
  TitleLogo?: React.ReactNode;
  columnGap?: number;
  rowGap?: number;
  currentTag?: string;
  layout?: "grid" | "carousel";
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
  currentTag,
  layout = "grid",
}: CharacterShowcaseProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { viewportRef, scrollPrev, scrollNext } = useCarousel({
    options: {
      align: "start",
      containScroll: "trimSnaps",
      dragFree: true,
    },
  });
  const isCarousel = layout === "carousel";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const displayChars = limit ? charArray.slice(0, limit) : charArray;
  const skeletonCount =
    limit || (displayChars.length > 0 ? displayChars.length : 4);

  if (!isLoading && displayChars.length === 0) return null;

  const cardItems = isLoading
    ? Array.from({ length: skeletonCount }).map((_, index) => (
        <CharacterCardSkeleton key={`skeleton-${index}`} size={cardSize} />
      ))
    : displayChars.map((char, index) => (
        <CharacterCard
          key={`card-${index}`}
          size={cardSize}
          title={char.name}
          description={char.dec}
          creatorName={char.creatorName || "Unknown"}
          chatCount={char.chatCount}
          images={char.img}
          tagList={char.tag}
          currentTag={currentTag}
        />
      ));

  return (
    <section className="mx-auto flex h-auto w-full max-w-300 flex-col justify-center gap-4">
      {title && (
        <header className="flex items-center justify-between pl-2">
          <h2 className="heading-3 flex items-center gap-2">
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
      )}

      {isCarousel ? (
        <div className="relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex" style={{ gap: columnGap ?? 16 }}>
              {cardItems.map((item) => (
                <div key={item.key} className="min-w-0 shrink-0">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous items"
            className="absolute left-[-18px] top-[122.5px] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-[20px] bg-white/12 p-2 text-font-0 backdrop-blur-[1.54px] transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next items"
            className="absolute right-[-18px] top-[122.5px] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-[20px] bg-white/12 p-2 text-font-0 backdrop-blur-[1.54px] transition-colors hover:bg-white/20"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-wrap gap-4",
            cardSize === "XL" && "justify-between",
          )}
          style={{
            columnGap,
            rowGap,
          }}
        >
          {cardItems}
        </div>
      )}
    </section>
  );
};

export default CharacterShowcase;
