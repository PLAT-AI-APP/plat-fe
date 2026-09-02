"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TABLET_MAX_WIDTH_QUERY } from "@/constants/layout";
import { ArrowLeft, ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";
import Fade from "embla-carousel-fade";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo } from "react";
import ExperienceSlide from "./ExperienceSlide";

interface ExperienceCarouselProps {
  selectedIndex: number;
  handleSelectedIndex: (index: number) => void;
}

const ExperienceCarousel = ({
  selectedIndex,
  handleSelectedIndex,
}: ExperienceCarouselProps) => {
  const t = useTranslations("characterShowcase");
  // 태블릿 폭 이하에서는 프로필 카드 + 채팅 미리보기를 좌우 대신 위아래로 쌓는다.
  // 좌우일 때는 채팅 영역이 계속 눌려 글자가 읽기 힘들어지기 때문.
  const isTablet = useMediaQuery(TABLET_MAX_WIDTH_QUERY);
  const plugins = useMemo(() => [Fade()], []);
  const handleCarouselSelect = useCallback(
    (index: number) => {
      handleSelectedIndex(index);
    },
    [handleSelectedIndex],
  );
  const { viewportRef, emblaApi, scrollPrev, scrollNext, scrollTo } =
    useCarousel({
      options: { loop: true },
      plugins,
      onSelect: handleCarouselSelect,
    });

  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== selectedIndex) {
      scrollTo(selectedIndex);
    }
  }, [selectedIndex, emblaApi, scrollTo]);

  return (
    <article
      className={cn(
        "relative max-w-full w-full overflow-visible rounded-2xl bg-scrim",
        isTablet ? "min-h-[600px] max-h-[600px]" : "min-h-95 max-h-95",
      )}
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl bg-scrim"
        ref={viewportRef}
      >
        <div className="flex w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <ExperienceSlide key={index} index={index} isStacked={isTablet} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label={t("previousItems")}
        className="absolute left-0 top-1/2 z-30 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100"
      >
        <ArrowLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label={t("nextItems")}
        className="absolute right-0 top-1/2 z-30 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100"
      >
        <ArrowRight className="size-6" />
      </button>
    </article>
  );
};

export default ExperienceCarousel;
