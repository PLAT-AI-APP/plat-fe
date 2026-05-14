"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import Image from "next/image";

const bannerData = [
  {
    id: 1,
    src: "/public/images/sample.png",
    alt: "이벤트 1",
  },
  {
    id: 2,
    src: "/public/images/sample.png",
    alt: "이벤트 2",
  },
  {
    id: 3,
    src: "/public/images/sample.png",
    alt: "이벤트 3",
  },
];

export function MainBannerCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    // 전체 컨테이너 높이를 366px로 고정
    <section
      className={cn(
        "relative w-full mx-auto overflow-hidden rounded-4xl",
        // 반응형 높이 설정
        "h-30", // 기본 (640px 미만)
        "sm:h-37.5", // 640px 이상
        "md:h-50", // 768px 이상
        "xl:h-62.5", // 1280px 이상
      )}
    >
      {/* --- 메인 슬라이드 영역 --- */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {bannerData.map((banner) => (
            <article
              key={banner.id}
              className={cn(
                "bg-amber-200 relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center",
              )}
            >
              {/* 이미지가 366px 높이를 꽉 채우되 비율을 유지하도록 설정 */}
              <Image
                src={banner.src}
                alt={banner.alt}
                width={100}
                height={100}
                className="w-full h-full object-cover object-center"
              />
            </article>
          ))}
        </div>
      </div>

      {/* --- 하단 인디케이터 (Dots) --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full cursor-pointer",
              index === selectedIndex
                ? "w-10 bg-[#FF7A00]" // 활성화: 주황색 긴 바
                : "w-2.5 bg-white/50 hover:bg-white/80", // 비활성화: 흰색 반투명 점
            )}
          />
        ))}
      </div>
    </section>
  );
}
