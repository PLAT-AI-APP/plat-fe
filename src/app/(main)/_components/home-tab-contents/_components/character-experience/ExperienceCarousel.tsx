import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "@/icons";
import ExperienceSlide from "./ExperienceSlide";
import Fade from "embla-carousel-fade";

interface ExperienceCarouselProps {
  selectedIndex: number;
  handleSelectedIndex: (index: number) => void;
}

const ExperienceCarousel = ({
  selectedIndex,
  handleSelectedIndex,
}: ExperienceCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // 1. [상단 이미지 클릭] -> [슬라이드 이동]
  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== selectedIndex) {
      emblaApi.scrollTo(selectedIndex);
    }
  }, [selectedIndex, emblaApi]);

  // 2. [화살표 클릭/스와이프] -> [상단 이미지 업데이트]
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      handleSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, handleSelectedIndex]);

  return (
    <article className="relative max-w-full w-full min-h-130.5 max-h-130.5 bg-neutral-900 rounded-2xl">
      <div className="w-full h-full overflow-hidden" ref={emblaRef}>
        <div className="flex w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <ExperienceSlide key={index} index={index} />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
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
