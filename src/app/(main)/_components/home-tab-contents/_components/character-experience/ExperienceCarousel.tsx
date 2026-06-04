import { useCarousel } from "@/hooks/useCarousel";
import { ArrowLeft, ArrowRight } from "@/icons";
import Fade from "embla-carousel-fade";
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
    <article className="relative max-w-full w-full min-h-95 max-h-95 overflow-visible rounded-2xl bg-neutral-900">
      <div
        className="h-full w-full overflow-hidden rounded-2xl bg-neutral-900"
        ref={viewportRef}
      >
        <div className="flex w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <ExperienceSlide key={index} index={index} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous items"
        className="absolute left-0 top-1/2 z-30 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] bg-white/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition-colors hover:bg-white/20 hover:opacity-100"
      >
        <ArrowLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next items"
        className="absolute right-0 top-1/2 z-30 flex size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] bg-white/12 p-2 text-font-0 opacity-25 backdrop-blur-[1.54px] transition-colors hover:bg-white/20 hover:opacity-100"
      >
        <ArrowRight className="size-6" />
      </button>
    </article>
  );
};

export default ExperienceCarousel;
