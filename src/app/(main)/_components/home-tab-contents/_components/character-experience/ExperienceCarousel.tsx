"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { ArrowLeft, ArrowRight } from "@/icons";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo } from "react";
import type { OfficialPreviewItem } from "@/api/home/getOfficialPreview";
import ExperienceSlide from "./ExperienceSlide";

interface ExperienceCarouselProps {
  items: OfficialPreviewItem[];
  selectedIndex: number;
  handleSelectedIndex: (index: number) => void;
}

const ExperienceCarousel = ({
  items,
  selectedIndex,
  handleSelectedIndex,
}: ExperienceCarouselProps) => {
  const t = useTranslations("characterShowcase");
  const plugins = useMemo(() => [Fade()], []);
  const handleCarouselSelect = useCallback(
    (index: number) => {
      handleSelectedIndex(index);
    },
    [handleSelectedIndex],
  );
  const { viewportRef, emblaApi, scrollPrev, scrollNext, scrollTo } =
    useCarousel({
      // Embla 기본 duration(25)이 fade 전환에도 그대로 쓰여 느리게 느껴져 낮췄다.
      options: { loop: true, duration: 4 },
      plugins,
      onSelect: handleCarouselSelect,
    });

  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== selectedIndex) {
      scrollTo(selectedIndex);
    }
  }, [selectedIndex, emblaApi, scrollTo]);

  const hasMultipleSlides = items.length > 1;

  return (
    <article
      // 좁은 화면: 캐릭터 카드(정사각)와 대화 미리보기(380px)가 위아래로 쌓이므로 높이를 자동으로 둔다.
      // md 이상: 좌우 배치라 380px 고정 높이로 충분하다.
      className="relative max-h-none min-h-0 w-full max-w-full overflow-visible rounded-2xl bg-scrim md:h-95"
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl bg-scrim"
        ref={viewportRef}
      >
        <div className="flex h-full w-full">
          {items.map((item, index) => (
            <ExperienceSlide
              key={item.universeId}
              item={item}
              priority={index === 0}
            />
          ))}
        </div>
      </div>

      {/* embla-carousel-fade는 이전/다음 슬라이드가 서로 겹쳐 보이는 단순 크로스페이드다.
          "확실히 한 번 어두워졌다가 바뀌는" 느낌을 위해, 인덱스가 바뀔 때마다 새로 마운트되는
          검은 오버레이를 덮어 크로스페이드 구간을 가린다. */}
      {hasMultipleSlides && (
        <motion.div
          key={selectedIndex}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.1 }}
        />
      )}

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t("previousItems")}
            className="absolute left-0 top-1/2 z-30 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-overlay-font opacity-40 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100"
          >
            <ArrowLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={t("nextItems")}
            className="absolute right-0 top-1/2 z-30 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-overlay-font/12 p-2 text-overlay-font opacity-40 backdrop-blur-[1.54px] transition hover:bg-overlay-font/20 hover:opacity-100"
          >
            <ArrowRight className="size-6" />
          </button>
        </>
      )}
    </article>
  );
};

export default ExperienceCarousel;
