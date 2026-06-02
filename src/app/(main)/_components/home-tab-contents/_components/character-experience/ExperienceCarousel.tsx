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
    <article className="relative max-w-full w-full min-h-130.5 max-h-130.5 bg-neutral-900 rounded-2xl">
      <div className="w-full h-full overflow-hidden" ref={viewportRef}>
        <div className="flex w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <ExperienceSlide key={index} index={index} />
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="size-10 p-2 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white/40 rounded-[20px] backdrop-blur-[1.54px] flex justify-center items-center gap-2 cursor-pointer z-10 border-none outline-none"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="size-10 p-2 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 absolute bg-white/40 rounded-[20px] backdrop-blur-[1.54px] flex justify-center items-center gap-2 cursor-pointer z-10 border-none outline-none"
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </article>
  );
};

export default ExperienceCarousel;
