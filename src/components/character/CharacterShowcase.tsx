"use client";

import { ArrowLeft, ArrowRight } from "@/icons";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";
import CharacterCard from "./character-card";
import {
  CARD_COLUMNS_CLASS,
  getCardGridTemplateColumns,
  type CardColumnCount,
} from "./character-card/constants";
import { QueryStateBoundary } from "@/components/state";
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
  /**
   * grid 레이아웃의 열 채움 방식. limit으로 항상 한 줄이 꽉 차는 미리보기는
   * "auto-fit"(기본값)으로 빈 트랙을 접어 카드가 남는 폭을 나눠 갖게 하고,
   * 아이템 수가 들쭉날쭉한 목록은 "auto-fill"로 빈 트랙을 남겨 카드가
   * 늘어나지 않고 왼쪽 정렬되게 한다.
   */
  gridFillMode?: "auto-fit" | "auto-fill";
  /**
   * grid 레이아웃 컨테이너에 그대로 전달되는 className. 이 화면만 카드가 한 줄에서
   * 여러 줄로 바뀌는 폭 기준을 다르게 주고 싶을 때, 공용 CARD_MIN_WIDTH를 건드리지
   * 않고 CSS 변수 --card-min-width만 오버라이드하는 용도로 쓴다
   * (예: className="[--card-min-width:194.335px]"). carousel 레이아웃에는 적용되지 않는다.
   */
  className?: string;
  selectedTags?: string | string[];
  /**
   * 목록을 아직 불러오는 중인지. 데이터는 부모가 가져오므로 로딩 여부도
   * 부모만 정확히 안다. 예전에는 이 컴포넌트가 setTimeout(2000) 으로
   * 로딩을 흉내 내, 데이터가 이미 있어도 2초간 스켈레톤이 떠 있었다.
   */
  isLoading?: boolean;
  /**
   * 한 줄에 보여줄 카드 수. 지정하면 컨테이너 폭에 따라 정해진 단계로만 줄어든다
   * (CARD_COLUMNS_CLASS 참고). 지정하지 않으면 기존 auto-fit + minmax 동작을 그대로 쓴다 —
   * 아이템 수가 들쭉날쭉한 목록 화면은 그쪽이 더 자연스럽다.
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
  gridFillMode = "auto-fit",
  className,
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
    <section className="@container mx-auto flex h-auto w-full max-w-full flex-col justify-center gap-4">
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
              className="body-4 shrink-0 text-font-2 transition-colors hover:text-font-1"
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
            className="carousel-nav-btn absolute left-[-18px] top-[122.5px] z-10 size-9 -translate-y-1/2"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={t("nextItems")}
            className="carousel-nav-btn absolute right-[-18px] top-[122.5px] z-10 size-9 -translate-y-1/2"
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
          className={cn(
            "grid gap-4",
            // columns 를 준 섹션은 열 수가 계약으로 고정된다. 안 준 곳은 기존 auto-fit 동작.
            columns && CARD_COLUMNS_CLASS[columns],
            className,
          )}
          style={{
            columnGap,
            rowGap,
            ...(columns
              ? {}
              : {
                  gridTemplateColumns: getCardGridTemplateColumns(
                    cardSize,
                    gridFillMode,
                  ),
                }),
          }}
        >
          {cardItems}
        </div>
      )}
      </QueryStateBoundary>
    </section>
  );
};

export default CharacterShowcase;
