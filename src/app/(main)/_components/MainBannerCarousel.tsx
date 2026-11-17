"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { useHomeBannersQuery } from "@/api/home/getBanners";
import { ArrowLeft, ArrowRight } from "@/icons";
import { cn } from "@/lib/utils";
import EventBanner from "./banner-templates/EventBanner";

const AUTOPLAY_MS = 7000;
/** 이만큼 밀면 넘긴다. */
const SWIPE_PX = 60;
/** 짧게 튕겨도 이 속도(px/ms)를 넘으면 넘긴다. */
const FLICK_SPEED = 0.4;
/** 이만큼 움직이기 전까지는 누른 것으로 본다. */
const DRAG_START_PX = 6;

/**
 * 칸. 0 이 가운데(펼침), ±1 이 양옆(접힘), ±2 는 화면 밖에서 대기하거나 빠져나가는 자리다.
 *
 * 장은 늘 펼친 폭(--center)으로 그려 두고 **위치(translate)와 잘라 보이는 폭(clip-path)만** 바꾼다. 폭을
 * 바꾸면 매 프레임 레이아웃을 다시 계산해 끊기지만, 둘 다 합성 단계에서 끝나 부드럽다. 접힌 장은 왼쪽 끝
 * --side 만큼만 보이고, 펼쳐질 때 그 창이 오른쪽으로 열린다.
 *
 * 장마다 끝없이 늘어나는 순번 k 를 키로 쓰고 칸은 k - 현재 순번으로 정한다. 그래서 넘길 때 같은 요소가 칸만
 * 바꿔 움직인다 — 왼쪽은 흐려지며 빠지고, 가운데는 접히며 왼쪽으로, 오른쪽은 펴지며 가운데로, 오른쪽 밖에서
 * 대기하던 다음 장이 접힌 채 들어온다.
 */
type Slot = -2 | -1 | 0 | 1 | 2;
const SLOTS: Slot[] = [-2, -1, 0, 1, 2];

const FOLDED_CLIP =
  "inset(0 calc(var(--center) - var(--side)) 0 0 round var(--radius))";
const OPEN_CLIP = "inset(0 0px 0 0 round var(--radius))";

const SLOT_STYLE: Record<Slot, CSSProperties> = {
  [-2]: {
    transform: "translateX(calc(-1 * var(--side) - var(--gap)))",
    clipPath: FOLDED_CLIP,
    opacity: 0,
  },
  [-1]: { transform: "translateX(0px)", clipPath: FOLDED_CLIP, opacity: 1 },
  0: {
    transform: "translateX(calc(var(--side) + var(--gap)))",
    clipPath: OPEN_CLIP,
    opacity: 1,
  },
  1: {
    transform: "translateX(calc(100cqw - var(--side)))",
    clipPath: FOLDED_CLIP,
    opacity: 1,
  },
  2: {
    transform: "translateX(calc(100cqw + var(--gap)))",
    clipPath: FOLDED_CLIP,
    opacity: 0,
  },
};

const mod = (value: number, size: number) => ((value % size) + size) % size;

interface Drag {
  startX: number;
  startTime: number;
  /** DRAG_START_PX 를 넘어 실제로 끌기 시작했는가. */
  active: boolean;
}

/**
 * 메인 최상단 캐러셀. 가운데 한 장을 펼치고 앞뒤 장을 양옆에 접어(배경만 흐리게) 보여 준다.
 * 끝이 없다 — 5장 중 5번째가 가운데면 4·5·1 이 나온다. 움직임은 iOS 시트처럼 부드럽게 출발해 길게 감속하는
 * 곡선(--ease-banner)이고, 밀면 손가락을 따라오다 놓는 순간 넘어가거나 제자리로 돌아간다.
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
  const [dragX, setDragX] = useState(0);
  const drag = useRef<Drag | null>(null);
  // 끌어서 넘긴 직후 따라오는 click 이 가운데 장 링크를 열지 않게 표시해 둔다.
  const didDrag = useRef(false);
  const count = banners.length;
  const hasMultiple = count > 1;
  const isDragging = dragX !== 0;

  const move = useCallback(
    (step: 1 | -1) => setPosition((current) => current + step),
    [],
  );

  // 넘길 때마다 타이머를 새로 건다 — 손으로 넘긴 직후 곧바로 또 넘어가지 않게 position 을 의존성에 둔다.
  useEffect(() => {
    if (!hasMultiple || isPaused || isDragging) return;
    const timer = window.setTimeout(() => move(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [hasMultiple, isPaused, isDragging, move, position]);

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

  const onPointerDown = (event: PointerEvent) => {
    if (!hasMultiple || event.button !== 0) return;
    drag.current = {
      startX: event.clientX,
      startTime: event.timeStamp,
      active: false,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const deltaX = event.clientX - current.startX;
    if (!current.active && Math.abs(deltaX) < DRAG_START_PX) return;
    current.active = true;
    setDragX(deltaX);
  };

  const endDrag = (event: PointerEvent) => {
    const current = drag.current;
    drag.current = null;
    if (!current?.active) return;
    const deltaX = event.clientX - current.startX;
    const speed =
      Math.abs(deltaX) / Math.max(event.timeStamp - current.startTime, 1);
    didDrag.current = true;
    if (Math.abs(deltaX) >= SWIPE_PX || speed >= FLICK_SPEED) {
      move(deltaX < 0 ? 1 : -1);
    }
    // 놓은 자리에서 새 칸(또는 제자리)으로 이어서 미끄러진다.
    setDragX(0);
  };

  // 한 장이면 접을 옆 장이 없으니 가운데를 꽉 채운다.
  const layout = (
    hasMultiple
      ? {
          "--side": "var(--banner-side)",
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
        "@container relative aspect-[64/23] min-h-[220px] max-h-[437px] w-full max-w-full touch-pan-y overflow-hidden select-none",
        "[--banner-side:8.7cqw] [--banner-gap:8px] [--radius:20px] [--ease-banner:cubic-bezier(0.45,0.05,0.15,1)] md:[--banner-side:110px] md:[--banner-gap:16px] md:[--radius:28px]",
        "[&_img]:pointer-events-none",
        !hasMultiple && "[--radius:0px] md:[--radius:0px]",
        fadeInClassName,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={(event) => {
        if (!didDrag.current) return;
        didDrag.current = false;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {/* 끄는 동안은 손가락에 붙고(전환 없음), 놓으면 같은 곡선으로 돌아간다. */}
      <div
        style={{ transform: `translateX(${dragX}px)` }}
        className={cn(
          "absolute inset-0",
          !isDragging &&
            "transition-transform duration-850 ease-(--ease-banner) motion-reduce:transition-none",
        )}
      >
        {slots.map((slot) => {
          const k = position + slot;
          const banner = banners[mod(k, count)];
          const isCenter = slot === 0;

          const card = (
            <EventBanner
              banner={banner}
              priority={isCenter && position === 0}
              folded={!isCenter}
            />
          );

          return (
            <div
              key={k}
              aria-hidden={!isCenter}
              aria-roledescription="slide"
              // 끄는 동안에는 대기 칸의 장도 보여야 빈 자리가 드러나지 않는다.
              style={{
                ...SLOT_STYLE[slot],
                ...(isDragging ? { opacity: 1 } : null),
              }}
              className={cn(
                "absolute top-0 left-0 h-full w-(--center) overflow-hidden bg-scrim will-change-transform",
                "transition-[transform,clip-path,opacity] duration-850 ease-(--ease-banner) motion-reduce:transition-none",
                Math.abs(slot) === 2 && "pointer-events-none",
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
      </div>

      {hasMultiple && (
        <>
          {/* 화살표는 접힌 장과 가운데 장 사이 틈에 걸친다. */}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={t("previousBanner")}
            className="absolute top-1/2 left-[calc(var(--side)+var(--gap)/2)] z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-overlay-font/30 text-overlay-font backdrop-blur-sm transition-[background-color,scale] duration-200 hover:bg-overlay-font/45 active:scale-90 md:size-11"
          >
            <ArrowLeft className="size-5 md:size-6" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={t("nextBanner")}
            className="absolute top-1/2 right-[calc(var(--side)+var(--gap)/2)] z-10 flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-overlay-font/30 text-overlay-font backdrop-blur-sm transition-[background-color,scale] duration-200 hover:bg-overlay-font/45 active:scale-90 md:size-11"
          >
            <ArrowRight className="size-5 md:size-6" />
          </button>
        </>
      )}
    </section>
  );
}
