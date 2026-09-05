"use client";

import { ArrowLeft, ArrowRight } from "@/icons";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterCard from "./character-card";
import CardGrid from "./character-card/CardGrid";
import {
  CARD_BASE_WIDTH,
  type CardColumnCount,
} from "./character-card/constants";
import { QueryStateBoundary } from "@/components/state";
import { CharacterCardSkeleton } from "./character-card/CharacterCardSkeleton";

interface CharacterShowcaseProps {
  title?: string;
  charArray: {
    /**
     * 목록에서의 신원. CharacterCard 가 현재 이미지 인덱스 등을 자체 state 로
     * 들고 있어서, 정렬이나 필터가 바뀔 때 배열 위치로 키를 잡으면 React 가
     * 다른 카드의 인스턴스를 재사용해 이미지가 뒤섞인다.
     */
    id?: string;
    name: string;
    chatCount?: number;
    dec: string;
    tag?: string[];
    img: string[] | string;
    creatorName?: string;
    isNew?: boolean;
    isOfficial?: boolean;
    rank?: number;
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
  /**
   * 한 줄에 보여줄 카드 수. 지정하지 않으면 카드 크기에 맞는 기본값을 쓴다
   * (DEFAULT_CARD_COLUMNS). 섹션 하나만 다르게 보여야 할 때만 넘긴다.
   */
  columns?: CardColumnCount;
  /** 목록을 불러오지 못했는지. 실패를 "결과 없음"으로 뭉개지 않기 위해 따로 받는다. */
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  /**
   * 섹션의 시각적 무게. 한 페이지의 섹션이 전부 같은 크기의 제목을 달면
   * 무엇을 먼저 봐야 하는지 알 수 없다. 주력 섹션 하나만 primary 로 올린다.
   */
  emphasis?: "primary" | "default";
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
  columns,
  isError = false,
  error,
  onRetry,
  emphasis = "default",
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

  // 격자는 열이, 캐러셀은 슬라이드가 폭을 정한다. 어느 쪽이든 폭은 바깥이 정하고
  // 카드는 그 폭을 채우기만 한다 — 그래야 카드가 어느 배치에서든 같은 비율로 그려진다.
  const isFluid = true;

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
          key={char.id ?? `card-${index}`}
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
          rank={char.rank}
          selectedTags={selectedTags}
          fluid={isFluid}
        />
      ));

  const isEmpty = !isLoading && !isError && displayChars.length === 0;

  // 불러오지 못한 것과 진짜로 비어 있는 것은 다르다. 실패는 자리에 남겨 사용자가
  // "왜 이 섹션이 없는지" 알 수 있게 하고, 빈 결과일 때만 섹션을 접는다.
  if (isEmpty) return null;


  return (
    <section className="mx-auto flex h-auto w-full max-w-full flex-col justify-center gap-4">
      {title && (
        <header className="flex items-end justify-between gap-4">
          <h2
            className={cn(
              "flex items-center gap-2 text-font-0",
              emphasis === "primary" ? "heading-3" : "title-1",
            )}
          >
            {title} {TitleLogo && TitleLogo}
          </h2>

          {allViewLink && (
            <Link
              href={{
                query: { tab: allViewLink },
              }}
              className="body-5 shrink-0 text-font-2 transition-colors hover:text-font-1"
            >
              {t("allView")}
            </Link>
          )}
        </header>
      )}

      <QueryStateBoundary
        isPending={false}
        isError={isError}
        error={error}
        onRetry={onRetry}
      >
      {isCarousel ? (
        // 줄바꿈 없이 한 줄만 쓰고, 넘치는 카드는 좌우 버튼과 드래그로 밀어서 본다.
        <div className="relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex" style={{ gap: columnGap ?? 16 }}>
              {cardItems.map((item) => (
                <div
                  key={item.key}
                  className="min-w-0 shrink-0"
                  // 카드보다 좁은 화면에서는 카드가 화면을 넘지 않게 100%로 잘린다.
                  style={{
                    width: `min(${CARD_BASE_WIDTH[cardSize]}px, 100%)`,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* 예전에는 top-[122.5px](S 카드 이미지의 절반) 이 박혀 있어 L 카드 캐러셀에서는
              화살표가 이미지 위쪽에 떠 있었다. 슬라이드 높이의 절반이면 어느 크기에서나 맞는다. */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label={t("previousItems")}
            className="carousel-nav-btn absolute left-0 top-1/2 z-10 size-9 -translate-y-1/2 sm:left-[-18px]"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={t("nextItems")}
            className="carousel-nav-btn absolute right-0 top-1/2 z-10 size-9 -translate-y-1/2 sm:right-[-18px]"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      ) : (
        <CardGrid
          size={cardSize}
          columns={columns}
          style={{ columnGap, rowGap }}
        >
          {cardItems}
        </CardGrid>
      )}
      </QueryStateBoundary>
    </section>
  );
};

export default CharacterShowcase;
