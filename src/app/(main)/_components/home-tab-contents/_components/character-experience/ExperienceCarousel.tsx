"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { ArrowLeft, ArrowRight } from "@/icons";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
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

  return (
    <article
      // md(768px) 미만: 프로필 카드(최대 380px) + 채팅 미리보기(380px, 반응형 수정 전과
      // 동일한 높이)가 위아래로 쌓이므로 두 높이를 합친 760px로 늘린다.
      // md 이상: 원래처럼 좌우 배치라 380px 고정 높이로 충분하다.
      className="relative max-w-full w-full overflow-visible rounded-2xl bg-scrim min-h-[760px] max-h-[760px] md:min-h-95 md:max-h-95"
    >
      <div
        className="h-full w-full overflow-hidden rounded-2xl bg-scrim"
        ref={viewportRef}
      >
        <div className="flex w-full h-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <ExperienceSlide key={index} index={index} />
          ))}
        </div>
      </div>

      {/* embla-carousel-fade는 이전/다음 슬라이드가 서로 겹쳐 보이는 단순 크로스페이드다.
          "확실히 한 번 어두워졌다가 바뀌는" 느낌을 위해, 인덱스가 바뀔 때마다 새로 마운트되는
          검은 오버레이를 덮어 크로스페이드 구간을 가린다. 처음엔 완전히 불투명(검게 덮은 상태)으로
          시작해 짧게 유지한 뒤(delay) 옅어지며 다음 슬라이드를 드러낸다. */}
      <motion.div
        key={selectedIndex}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.1 }}
      />

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
