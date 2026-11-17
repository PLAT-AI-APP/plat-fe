"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { useHomeBannersQuery } from "@/api/home/getBanners";
import { ArrowLeft, ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";
import EventBanner from "./banner-templates/EventBanner";

const AUTOPLAY_MS = 5000;
/** 이만큼 밀면 넘긴다. 그보다 짧으면 누른 것으로 본다. */
const SWIPE_PX = 40;

/**
 * 칸. 0 이 가운데(펼침), ±1 이 양옆(접힘), ±2 는 화면 밖에서 대기하거나 빠져나가는 자리(투명)다.
 * 장마다 끝없이 늘어나는 순번 k 를 키로 쓰고 칸은 k - 현재 순번으로 정한다. 그래서 넘길 때 같은 요소가
 * 칸만 바꿔 left·width·opacity 전환으로 움직인다 — 왼쪽은 흐려지며 빠지고, 가운데는 접히며 왼쪽으로,
 * 오른쪽은 펴지며 가운데로, 오른쪽 밖에서 대기하던 다음 장이 접힌 채 나타난다.
 */
type Slot = -2 | -1 | 0 | 1 | 2;
const SLOTS: Slot[] = [-2, -1, 0, 1, 2];

const SLOT_STYLE: Record<Slot, CSSProperties> = {
  [-2]: {
    left: "calc(-1 * var(--side) - var(--gap))",
    width: "var(--side)",
    opacity: 0,
  },
  [-1]: { left: "0px", width: "var(--side)", opacity: 1 },
  0: {
    left: "calc(var(--side) + var(--gap))",
    width: "var(--center)",
    opacity: 1,
  },
  1: { left: "calc(100% - var(--side))", width: "var(--side)", opacity: 1 },
  2: { left: "calc(100% + var(--gap))", width: "var(--side)", opacity: 0 },
};

const mod = (value: number, size: number) => ((value % size) + size) % size;

/**
 * 메인 최상단 캐러셀. 가운데 한 장을 펼치고 앞뒤 장을 양옆에 접어(배경만 흐리게) 보여 준다.
 * 끝이 없다 — 5장 중 5번째가 가운데면 4·5·1 이 나온다.
 *
 * 배너는 템플릿으로 그린다 — 서버가 배경·전경 이미지와 문구를 따로 주고, 여기서는 틀(templateType)에 맞는
 * 컴포넌트를 고른다. 지금은 이벤트형 하나다. 문구가 들어가야 해서 좁은 화면에서도 높이를 220px 아래로 줄이지 않는다.
 */
export function MainBannerCarousel() {
  const t = useTranslations("home");
  const { data: banners = [], isLoading, isError } = useHomeBannersQuery();
  const fadeInClassName = useFadeInAfterLoading(isLoading);

  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  // 밀어서 넘긴 직후 따라오는 click 이 가운데 장 링크를 열지 않게 표시해 둔다.
  const didSwipe = useRef(false);
  const count = banners.length;
  const hasMultiple = count > 1;

  const move = useCallback(
    (step: 1 | -1) => setPosition((current) => current + step),
    [],
  );

  // 넘길 때마다 타이머를 새로 건다 — 손으로 넘긴 직후 곧바로 또 넘어가지 않게 position 을 의존성에 둔다.
  useEffect(() => {
    if (!hasMultiple || isPaused) return;
    const timer = window.setTimeout(() => move(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [hasMultiple, isPaused, move, position]);

  /*
   * 배너는 홍보용이고 여기에만 있는 정보가 없다. 그래서 못 불러왔을 때
   * 화면 최상단에 큰 에러 판을 세우는 것보다 조용히 내리는 편이 낫다.
   * 실패는 스켈레톤 없이 바로 내린다 — 스켈레톤을 보였다가 사라지면 레이아웃이 튄다.
   */
  if (isError) return null;

  if (isLoading) {
    return (
      <section className="aspect-[64/23] min-h-[220px] max-h-[437px] w-full max-w-full skeleton" />
    );
  }

  // 배너가 없으면 자리만 차지하는 빈 캐러셀 대신 섹션을 통째로 내린다.
  if (count === 0) return null;

  // 한 장이면 접을 옆 장이 없으니 가운데를 꽉 채운다.
  const layout = (
    hasMultiple
      ? {
          "--side": "8.7cqw",
          "--gap": "var(--banner-gap)",
          "--center": "calc(100cqw - 2 * var(--side) - 2 * var(--gap))",
        }
      : { "--side": "0px", "--gap": "0px", "--center": "100cqw" }
  ) as CSSProperties;

  const slots = hasMultiple ? SLOTS : ([0] as Slot[]);

  return (
    <section
      aria-roledescription="carousel"
      style={layout}
      className={cn(
        "@container relative aspect-[64/23] min-h-[220px] max-h-[437px] w-full max-w-full touch-pan-y overflow-hidden [--banner-gap:8px] md:[--banner-gap:16px]",
        fadeInClassName,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return;
        const deltaX = event.clientX - pointerStartX.current;
        pointerStartX.current = null;
        didSwipe.current = hasMultiple && Math.abs(deltaX) >= SWIPE_PX;
        if (didSwipe.current) move(deltaX < 0 ? 1 : -1);
      }}
      onClickCapture={(event) => {
        if (!didSwipe.current) return;
        didSwipe.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {slots.map((slot) => {
        const k = position + slot;
        const banner = banners[mod(k, count)];
        const isCenter = slot === 0;
        const isFolded = !isCenter;
        const isVisible = Math.abs(slot) < 2;

        const card = (
          <EventBanner
            banner={banner}
            priority={isCenter && position === 0}
            folded={isFolded}
          />
        );

        return (
          <div
            key={k}
            aria-hidden={!isCenter}
            aria-roledescription="slide"
            style={SLOT_STYLE[slot]}
            className={cn(
              "absolute top-0 h-full overflow-hidden bg-scrim transition-[left,width,opacity] duration-500 ease-in-out motion-reduce:transition-none",
              hasMultiple && "rounded-[20px] md:rounded-[28px]",
              !isVisible && "pointer-events-none",
            )}
          >
            {isCenter ? (
              banner.linkUrl ? (
                <Link
                  href={banner.linkUrl}
                  className="block h-full w-full"
                  aria-label={banner.title}
                  draggable={false}
                >
                  {card}
                </Link>
              ) : (
                card
              )
            ) : (
              // 접힌 장은 누르면 그쪽으로 넘긴다.
              <button
                type="button"
                tabIndex={-1}
                onClick={() => move(slot < 0 ? -1 : 1)}
                className="block h-full w-full cursor-pointer"
                aria-label={slot < 0 ? t("previousBanner") : t("nextBanner")}
              >
                {card}
              </button>
            )}
          </div>
        );
      })}

      {hasMultiple && (
        <>
          {/* 화살표는 접힌 장과 가운데 장 사이 틈에 걸친다. */}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={t("previousBanner")}
            className="absolute top-1/2 left-[calc(var(--side)+var(--gap)/2)] z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-overlay-font/30 text-overlay-font backdrop-blur-sm transition-colors hover:bg-overlay-font/45 md:size-11"
          >
            <ArrowLeft className="size-5 md:size-6" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={t("nextBanner")}
            className="absolute top-1/2 right-[calc(var(--side)+var(--gap)/2)] z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-overlay-font/30 text-overlay-font backdrop-blur-sm transition-colors hover:bg-overlay-font/45 md:size-11"
          >
            <ArrowRight className="size-5 md:size-6" />
          </button>
        </>
      )}
    </section>
  );
}
