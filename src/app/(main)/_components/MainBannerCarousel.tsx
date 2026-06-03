"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { ArrowLeft, ArrowRight } from "@/icons";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const bannerData = [
  {
    id: 1,
    src: "/images/sample.png",
    alt: "이벤트 1",
    title: "첫 번째 이벤트 제목",
    desc: "첫 번째 배너의 상세 내용입니다. 여기에 원하는 설명을 적으세요.",
    tags: ["#이벤트", "#혜택", "#시작"],
  },
  {
    id: 2,
    src: "/images/sample.png",
    alt: "이벤트 2",
    title: "두 번째 프로모션 제목",
    desc: "두 번째 배너의 상세 내용입니다. 가볍고 빠른 캐러셀 라이브러리!",
    tags: ["#프로모션", "#할인", "#핫템"],
  },
  {
    id: 3,
    src: "/images/sample.png",
    alt: "이벤트 3",
    title: "세 번째 기획전 제목",
    desc: "세 번째 배너의 상세 내용입니다. 놓치면 후회하는 마지막 기회.",
    tags: ["#기획전", "#쿠폰", "#마감임박"],
  },
];

export function MainBannerCarousel() {
  const { viewportRef, scrollPrev, scrollNext } = useCarousel({
    options: { loop: true },
    plugins: [Autoplay({ delay: 5000, stopOnInteraction: false })],
  });

  return (
    <section className="relative max-w-full w-full min-h-[437.08px] bg-neutral-900 overflow-hidden">
      {/* --- Embla Viewport (여기서 영역 밖으로 나가는 슬라이드를 숨깁니다) --- */}
      <div
        id="carousel-viewport"
        className="w-full h-full overflow-hidden"
        ref={viewportRef}
      >
        {/* --- Embla Container --- */}
        <div id="carousel-container" className="flex h-full">
          {/* --- 개별 슬라이드 루프 --- */}
          {bannerData.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden"
            >
              {/* 배경을 채워줄 흐린 블러 이미지 */}
              <div className="absolute inset-0 z-0 opacity-40 blur-[50px] scale-110">
                <Image
                  alt="blur-bg"
                  fill
                  priority={index === 0}
                  className="object-cover"
                  src={banner.src}
                />
              </div>

              {/* 메인 콘텐츠 영역: 내부 여백(px)을 주어 화살표 버튼 공간 확보 */}
              <div className="relative z-10 w-full h-full flex items-center px-16 md:px-20">
                {/* 텍스트 정보 콘텐츠 */}
                <div className="flex flex-col gap-4 text-white max-w-lg z-20">
                  <h2 className="text-3xl md:text-4xl font-bold font-['Pretendard'] leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-zinc-400 text-base md:text-lg font-normal font-['Pretendard'] leading-relaxed whitespace-pre-line">
                    {banner.desc}
                  </p>

                  {/* 해시태그 */}
                  <ul className="flex gap-2 mt-2">
                    {banner.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 bg-black/50 rounded-[5px] backdrop-blur-[2px]"
                      >
                        <span className="text-orange-500 text-sm md:text-base font-normal font-['Pretendard']">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 하단 그라데이션 어둡게 처리 */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-neutral-900 to-transparent z-10" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        data-icon="arrow-right"
        className="opacity-25 hover:opacity-100 size-8 absolute left-10 top-1/2 -translate-y-1/2 overflow-hidden"
      >
        <ArrowLeft className="size-8" />
      </button>
      <button
        onClick={scrollNext}
        data-icon="arrow-right"
        className="opacity-25 hover:opacity-100 size-8 absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden"
      >
        <ArrowRight className="size-8" />
      </button>
    </section>
  );
}
