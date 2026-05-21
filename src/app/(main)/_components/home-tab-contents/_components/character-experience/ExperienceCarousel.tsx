"use client";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "@/icons";
import ExperienceSlide from "./ExperienceSlide";

const ExperienceCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <article className="relative max-w-full w-full min-h-[522px] max-h-[522px] bg-neutral-900 rounded-2xl">
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
