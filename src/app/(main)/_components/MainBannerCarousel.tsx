"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { ArrowLeft, ArrowRight } from "@/icons";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function MainBannerCarousel() {
  const t = useTranslations("home");
  const bannerData = [
    {
      id: 1,
      src: "/images/sample.png",
      alt: t("bannerAlt", { index: 1 }),
      title: t("banner1Title"),
      desc: t("banner1Desc"),
      tags: [t("eventTag"), t("benefitTag"), t("startTag")],
    },
    {
      id: 2,
      src: "/images/sample.png",
      alt: t("bannerAlt", { index: 2 }),
      title: t("banner2Title"),
      desc: t("banner2Desc"),
      tags: [t("promotionTag"), t("discountTag"), t("hotTag")],
    },
    {
      id: 3,
      src: "/images/sample.png",
      alt: t("bannerAlt", { index: 3 }),
      title: t("banner3Title"),
      desc: t("banner3Desc"),
      tags: [t("specialTag"), t("couponTag"), t("deadlineTag")],
    },
  ];

  const { viewportRef, scrollPrev, scrollNext } = useCarousel({
    options: { loop: true },
    plugins: [Autoplay({ delay: 5000, stopOnInteraction: false })],
  });

  return (
    <section className="relative max-w-full w-full min-h-[437.08px] bg-scrim overflow-hidden">
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
                <div className="flex flex-col gap-4 text-overlay-font max-w-lg z-20">
                  <h2 className="heading-2 text-overlay-font">
                    {banner.title}
                  </h2>
                  <p className="body-3 whitespace-pre-line text-overlay-font/70">
                    {banner.desc}
                  </p>

                  {/* 해시태그 */}
                  <ul className="flex gap-2 mt-2">
                    {banner.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 bg-scrim/50 rounded-md backdrop-blur-[2px]"
                      >
                        <span className="body-4 text-brand">{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 하단 그라데이션 어둡게 처리 */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-scrim to-transparent z-10" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        data-icon="arrow-right"
        className="opacity-25 hover:opacity-100 size-8 absolute left-10 top-1/2 -translate-y-1/2 overflow-hidden"
      >
        <ArrowLeft className="size-8" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        data-icon="arrow-right"
        className="opacity-25 hover:opacity-100 size-8 absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden"
      >
        <ArrowRight className="size-8" />
      </button>
    </section>
  );
}
