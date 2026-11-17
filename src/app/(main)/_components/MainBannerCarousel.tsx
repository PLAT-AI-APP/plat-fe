"use client";

import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { useCarousel } from "@/hooks/dom/useCarousel";
import { useHomeBannersQuery } from "@/api/home/getBanners";
import { ArrowLeft, ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";
import EventBanner from "./banner-templates/EventBanner";

/**
 * 메인 최상단 캐러셀.
 *
 * 배너는 템플릿으로 그린다 — 서버가 배경 이미지와 문구(뱃지·제목·설명·태그)를 따로 주고,
 * 여기서는 틀(templateType)에 맞는 컴포넌트를 고른다. 지금은 이벤트형 하나다.
 * 문구가 들어가야 해서 좁은 화면에서도 높이를 220px 아래로 줄이지 않는다.
 */
export function MainBannerCarousel() {
  const t = useTranslations("home");
  const { data: banners = [], isLoading, isError } = useHomeBannersQuery();

  const fadeInClassName = useFadeInAfterLoading(isLoading);
  const { viewportRef, scrollPrev, scrollNext } = useCarousel({
    options: { loop: true },
    plugins: [Autoplay({ delay: 5000, stopOnInteraction: false })],
  });

  /*
   * 배너는 홍보용이고 여기에만 있는 정보가 없다. 그래서 못 불러왔을 때
   * 화면 최상단에 큰 에러 판을 세우는 것보다 조용히 내리는 편이 낫다.
   *
   * 다만 순서는 고친다. 예전에는 실패해도 isLoading 분기를 지나 스켈레톤을
   * 한 번 보여준 뒤 length === 0 으로 사라져서, 배너가 있다가 없어진 것처럼
   * 보이고 그만큼 레이아웃이 튀었다. 실패는 스켈레톤 없이 바로 내린다.
   */
  if (isError) return null;

  // 배너가 없으면 자리만 차지하는 빈 캐러셀 대신 섹션을 통째로 내린다.
  if (isLoading) {
    return (
      <section className="aspect-[64/23] min-h-[220px] max-h-[437px] w-full max-w-full skeleton" />
    );
  }

  if (banners.length === 0) return null;

  const hasMultiple = banners.length > 1;

  return (
    <section
      className={cn(
        "relative aspect-[64/23] min-h-[220px] max-h-[437px] w-full max-w-full overflow-hidden bg-scrim",
        fadeInClassName,
      )}
    >
      <div
        id="carousel-viewport"
        className="h-full w-full overflow-hidden"
        ref={viewportRef}
      >
        <div id="carousel-container" className="flex h-full">
          {banners.map((banner, index) => {
            const image = (
              <EventBanner banner={banner} priority={index === 0} />
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
                    aria-label={banner.title}
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
          "absolute left-4 top-1/2 z-10 md:left-10 size-8 -translate-y-1/2 overflow-hidden text-overlay-font opacity-80 transition-opacity hover:opacity-100",
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
          "absolute right-4 top-1/2 z-10 md:right-10 size-8 -translate-y-1/2 overflow-hidden text-overlay-font opacity-80 transition-opacity hover:opacity-100",
          !hasMultiple && "hidden",
        )}
      >
        <ArrowRight className="size-8" />
      </button>
    </section>
  );
}
