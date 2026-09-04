"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCarousel } from "@/hooks/useCarousel";
import { useHomeBannersQuery } from "@/api/home/getBanners";
import { ArrowLeft, ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";

/**
 * 메인 최상단 캐러셀.
 *
 * 백엔드 HomeBannerResponse 는 이미지 URL 과 이동 링크만 준다 — 배너는 이미지가 전부라는
 * 설계라 제목·설명·태그 필드가 아예 없다. 그래서 여기서도 문구를 얹지 않는다.
 * (예전에는 i18n 에 하드코딩한 문구 3벌을 이미지 위에 그려 실제 배너와 무관한 화면이었다.)
 */
export function MainBannerCarousel() {
  const t = useTranslations("home");
  const { data: banners = [], isLoading } = useHomeBannersQuery();

  const { viewportRef, scrollPrev, scrollNext } = useCarousel({
    options: { loop: true },
    plugins: [Autoplay({ delay: 5000, stopOnInteraction: false })],
  });

  // 배너가 없으면 자리만 차지하는 빈 캐러셀 대신 섹션을 통째로 내린다.
  if (isLoading) {
    return (
      <section className="aspect-[64/23] max-h-[437px] w-full max-w-full animate-pulse bg-card" />
    );
  }

  if (banners.length === 0) return null;

  const hasMultiple = banners.length > 1;

  return (
    <section className="relative aspect-[64/23] max-h-[437px] w-full max-w-full overflow-hidden bg-scrim">
      <div
        id="carousel-viewport"
        className="h-full w-full overflow-hidden"
        ref={viewportRef}
      >
        <div id="carousel-container" className="flex h-full">
          {banners.map((banner, index) => {
            const image = (
              <>
                {/* 배경을 채워줄 흐린 블러 이미지 */}
                <div className="absolute inset-0 z-0 scale-110 opacity-40 blur-[50px]">
                  <Image
                    alt=""
                    aria-hidden
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                    src={banner.imageUrl}
                  />
                </div>

                <div className="relative z-10 mx-auto h-full w-full max-w-(--content-max-width)">
                  <Image
                    alt={t("bannerAlt", { index: index + 1 })}
                    fill
                    priority={index === 0}
                    // 배너는 콘텐츠 최대 폭까지만 커진다.
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-contain"
                    src={banner.imageUrl}
                  />
                </div>
              </>
            );

            return (
              <div
                key={banner.mainBannerId}
                className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
              >
                {banner.linkUrl ? (
                  <Link
                    href={banner.linkUrl}
                    className="block h-full w-full"
                    aria-label={t("bannerAlt", { index: index + 1 })}
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label={t("previousBanner")}
        className={cn(
          "absolute left-4 top-1/2 z-20 md:left-10 size-8 -translate-y-1/2 overflow-hidden text-overlay-font opacity-25 transition-opacity hover:opacity-100",
          !hasMultiple && "hidden",
        )}
      >
        <ArrowLeft className="size-8" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label={t("nextBanner")}
        className={cn(
          "absolute right-4 top-1/2 z-20 md:right-10 size-8 -translate-y-1/2 overflow-hidden text-overlay-font opacity-25 transition-opacity hover:opacity-100",
          !hasMultiple && "hidden",
        )}
      >
        <ArrowRight className="size-8" />
      </button>
    </section>
  );
}
