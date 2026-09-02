"use client";

import { ArrowLeft, ArrowRight } from "@/icons";
import { useCarousel } from "@/hooks/useCarousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterCard from "./character-card";
import { getCardGridTemplateColumns } from "./character-card/constants";
import { CharacterCardSkeleton } from "./character-card/CharacterCardSkeleton";

interface CharacterShowcaseProps {
  title?: string;
  charArray: {
    name: string;
    chatCount?: number;
    dec: string;
    tag?: string[];
    img: string[] | string;
    creatorName?: string;
    isNew?: boolean;
    isOfficial?: boolean;
  }[];
  cardSize?: "S" | "M" | "L" | "XL";
  limit?: number;
  allViewLink?: string;
  TitleLogo?: React.ReactNode;
  columnGap?: number;
  rowGap?: number;
  currentTag?: string;
  layout?: "grid" | "carousel";
  selectedTags?: string | string[];
  /**
   * 목록을 아직 불러오는 중인지. 데이터는 부모가 가져오므로 로딩 여부도
   * 부모만 정확히 안다. 예전에는 이 컴포넌트가 setTimeout(2000) 으로
   * 로딩을 흉내 내, 데이터가 이미 있어도 2초간 스켈레톤이 떠 있었다.
   */
  isLoading?: boolean;
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
  selectedTags,
  isLoading = false,
}: CharacterShowcaseProps) => {
  const t = useTranslations("characterShowcase");
  const { viewportRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel({
      options: {
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
        slidesToScroll: "auto",
      },
    });
  const isCarousel = layout === "carousel";

  const displayChars = limit ? charArray.slice(0, limit) : charArray;
  const skeletonCount =
    limit || (displayChars.length > 0 ? displayChars.length : 4);

  // 캐러셀은 카드 자체의 고정폭에 기대는 가로 스크롤이라 fluid를 켜지 않고,
  // grid 레이아웃에서만 카드가 열 폭을 그대로 채우도록 합니다.
  const isFluid = !isCarousel;

  const cardItems = isLoading
    ? Array.from({ length: skeletonCount }).map((_, index) => (
        <CharacterCardSkeleton
          key={`skeleton-${index}`}
          size={cardSize}
          fluid={isFluid}
        />
      ))
    : displayChars.map((char, index) => (
        <CharacterCard
          key={`card-${index}`}
          size={cardSize}
          title={char.name}
          description={char.dec}
          creatorName={char.creatorName || t("unknownCreator")}
          chatCount={char.chatCount}
          images={char.img}
          tagList={char.tag}
          currentTag={currentTag}
          isNew={char.isNew}
          isOfficial={char.isOfficial}
          selectedTags={selectedTags}
          fluid={isFluid}
        />
      ));

  if (!isLoading && displayChars.length === 0) return null;

  return (
    <section className="mx-auto flex h-auto w-full max-w-full flex-col justify-center gap-4">
      {title && (
        <header className="flex items-center justify-between">
          <h2 className="title-2 flex items-center gap-2">
            {title} {TitleLogo && TitleLogo}
          </h2>

          {allViewLink && (
            <Link
              href={{
                query: { tab: allViewLink },
              }}
              className="body-4 text-font-2 underline"
            >
              {t("allView")}
            </Link>
          )}
        </header>
      )}

      {isCarousel ? (
        <div className="relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex" style={{ gap: columnGap }}>
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
            disabled={!canScrollPrev}
            aria-label={t("previousItems")}
            className="absolute left-[-18px] top-[122.5px] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={t("nextItems")}
            className="absolute right-[-18px] top-[122.5px] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      ) : (
        // flex-wrap은 폭이 줄어들 때 카드가 그냥 다음 줄로 밀리며 마지막 줄 오른쪽에
        // 빈 여백을 남긴다. grid auto-fill + minmax는 컨테이너 폭에 맞춰 열 개수를
        // 다시 계산하고, 남는 폭을 카드들이 고르게 나눠 가져 태블릿 폭에서도
        // 자연스럽게 줄어든다.
        <div
          className="grid gap-4"
          style={{
            columnGap,
            rowGap,
            gridTemplateColumns: getCardGridTemplateColumns(cardSize),
          }}
        >
          {cardItems}
        </div>
      )}
    </section>
  );
};

export default CharacterShowcase;
