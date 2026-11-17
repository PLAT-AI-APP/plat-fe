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
 * 칸. 0 이 가운데(펼침), ±1 이 양옆(접힘)이고, 그 바깥(±2 …)은 접힌 장이 화면 밖으로 이어지는 줄이다.
 * 평소에는 바깥 칸을 투명하게 두고, 끄는 동안에만 드러내서 손가락을 따라 다음 장들이 줄지어 들어오게 한다.
 *
 * 장은 늘 펼친 폭(--center)으로 그려 두고 **위치(translate)와 잘라 보이는 폭(clip-path)만** 바꾼다. 폭을
 * 바꾸면 매 프레임 레이아웃을 다시 계산해 끊기지만, 둘 다 합성 단계에서 끝나 부드럽다. 접힌 장은 왼쪽 끝
 * --side 만큼만 보이고, 펼쳐질 때 그 창이 오른쪽으로 열린다.
 *
 * 장마다 끝없이 늘어나는 순번 k 를 키로 쓰고 칸은 k - 현재 순번으로 정한다. 그래서 넘길 때 같은 요소가 칸만
 * 바꿔 움직인다 — 왼쪽은 흐려지며 빠지고, 가운데는 접히며 왼쪽으로, 오른쪽은 펴지며 가운데로 온다.
 */
const FOLDED_CLIP =
  "inset(0 calc(var(--center) - var(--side)) 0 0 round var(--radius))";
const OPEN_CLIP = "inset(0 0px 0 0 round var(--radius))";
/** 접힌 장 하나가 차지하는 간격(접힌 폭 + 틈). */
const STEP = "(var(--side) + var(--gap))";

const slotStyle = (slot: number): CSSProperties => {
  if (slot === 0) {
    return {
      transform: "translateX(calc(var(--side) + var(--gap)))",
      clipPath: OPEN_CLIP,
      opacity: 1,
    };
  }
  const x =
    slot > 0
      ? `calc(100cqw - var(--side) + ${slot - 1} * ${STEP})`
      : `calc(${slot + 1} * ${STEP})`;
  return {
    transform: `translateX(${x})`,
    clipPath: FOLDED_CLIP,
    opacity: Math.abs(slot) >= 2 ? 0 : 1,
  };
};

/** 끌기를 시작할 때 잰 칸 치수(px). */
interface Geometry {
  width: number;
  side: number;
  gap: number;
}

/** 칸 slot 에 놓인 장이 dragX 만큼 끌렸을 때 화면에 보이는 가운데 x. */
const visibleCenter = (slot: number, dragX: number, g: Geometry) => {
  const step = g.side + g.gap;
  if (slot === 0) return g.width / 2 + dragX;
  const left =
    slot > 0 ? g.width - g.side + (slot - 1) * step : (slot + 1) * step;
  return left + g.side / 2 + dragX;
};

/** 끝 칸을 넘어 끌면 이만큼만 따라온다(iOS 처럼 고무줄 저항). */
const RUBBER = 0.2;

const mod = (value: number, size: number) => ((value % size) + size) % size;

interface Drag {
  startX: number;
  startTime: number;
  /** DRAG_START_PX 를 넘어 실제로 끌기 시작했는가. */
  active: boolean;
  geometry: Geometry;
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
  // 누른 순간부터 놓을 때까지. 이 동안은 자동 넘김을 멈춘다.
  const [isHolding, setIsHolding] = useState(false);
  // 실제로 끌기 시작한 뒤. dragX 가 0 으로 돌아와도(제자리까지 끌어 와도) 끄는 중이다.
  const [isDragging, setIsDragging] = useState(false);
  // 지금 놓으면 펼쳐질 칸. 끄는 동안 그 장만 밝히고 나머지는 살짝 어둡게 해 어디로 갈지 알린다.
  const [targetSlot, setTargetSlot] = useState(0);
  const drag = useRef<Drag | null>(null);
  // 끌어서 넘긴 직후 따라오는 click 이 가운데 장 링크를 열지 않게 표시해 둔다.
  const didDrag = useRef(false);
  const count = banners.length;
  const hasMultiple = count > 1;

  const sectionRef = useRef<HTMLElement>(null);
  const sideProbeRef = useRef<HTMLDivElement>(null);
  const stepProbeRef = useRef<HTMLDivElement>(null);
  const move = useCallback(
    (step: number) => setPosition((current) => current + step),
    [],
  );

  // 넘길 때마다 타이머를 새로 건다 — 손으로 넘긴 직후 곧바로 또 넘어가지 않게 position 을 의존성에 둔다.
  useEffect(() => {
    if (!hasMultiple || isPaused || isHolding) return;
    const timer = window.setTimeout(() => move(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [hasMultiple, isPaused, isHolding, move, position]);

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

  /*
   * 끌 수 있는 거리는 배너 수만큼이다. 왼쪽으로 끝까지 끌면 마지막(count - 1 번째 뒤) 장의 오른쪽 끝이 화면
   * 오른쪽 끝에 닿는 데서 멈추고(오른쪽으로는 첫 장이 왼쪽 끝에 닿는 데서), 그 너머는 고무줄처럼 조금만
   * 따라온다. 그래서 줄 끝 너머의 빈 자리가 드러나지 않는다.
   */
  const clampDrag = (deltaX: number, g: Geometry) => {
    const step = g.side + g.gap;
    // 두 장이어도 한 칸은 끌 수 있어야 넘길 수 있다.
    const reachPx = Math.max(count - 2, 1) * step;
    const min = -reachPx;
    const max = reachPx;
    if (deltaX < min) return min + (deltaX - min) * RUBBER;
    if (deltaX > max) return max + (deltaX - max) * RUBBER;
    return deltaX;
  };

  /*
   * 칸 치수는 CSS 가 정한다(화면 폭에 따라 다름). 넘어가는 도중의 장 위치로 재면 값이 틀어지므로,
   * 접힌 폭·한 칸 간격을 그대로 폭으로 가진 보이지 않는 막대 두 개를 재서 얻는다.
   */
  const measure = (): Geometry | null => {
    const section = sectionRef.current;
    const sideProbe = sideProbeRef.current;
    const stepProbe = stepProbeRef.current;
    if (!section || !sideProbe || !stepProbe) return null;
    const side = sideProbe.offsetWidth;
    return {
      width: section.clientWidth,
      side,
      gap: stepProbe.offsetWidth - side,
    };
  };

  /*
   * 지금 끈 거리에서 놓으면 펼쳐질 칸. 그때 가운데에 가장 가까운 장이고, 짧게 밀어 가운데 장이 그대로면
   * (또는 튕기면) 한 장만 넘긴다. 끄는 동안의 안내와 놓을 때의 판정이 같은 규칙을 쓴다.
   */
  const pickTarget = (deltaX: number, g: Geometry, speed = 0) => {
    let target = 0;
    let nearest = Number.POSITIVE_INFINITY;
    for (let slot = -(count - 1); slot <= count - 1; slot++) {
      const distance = Math.abs(visibleCenter(slot, deltaX, g) - g.width / 2);
      if (distance < nearest) {
        nearest = distance;
        target = slot;
      }
    }
    if (
      target === 0 &&
      (Math.abs(deltaX) >= SWIPE_PX || speed >= FLICK_SPEED)
    ) {
      target = deltaX < 0 ? 1 : -1;
    }
    return target;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!hasMultiple || event.button !== 0) return;
    const geometry = measure();
    if (!geometry) return;
    drag.current = {
      startX: event.clientX,
      startTime: event.timeStamp,
      active: false,
      geometry,
    };
    setIsHolding(true);
  };

  const onPointerMove = (event: PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const deltaX = event.clientX - current.startX;
    if (!current.active && Math.abs(deltaX) < DRAG_START_PX) return;
    if (!current.active) setIsDragging(true);
    current.active = true;
    const clamped = clampDrag(deltaX, current.geometry);
    setDragX(clamped);
    setTargetSlot(pickTarget(clamped, current.geometry));
  };

  /*
   * 놓으면 그때 가운데에 가장 가까운 장을 펼친다. 몇 장을 건너뛰었든 그 장으로 한 번에 간다.
   * 짧게 밀거나 튕겼는데 가운데 장이 그대로면 한 장만 넘긴다.
   */
  const endDrag = (event: PointerEvent) => {
    const current = drag.current;
    drag.current = null;
    setIsHolding(false);
    if (!current?.active) return;
    setIsDragging(false);
    const g = current.geometry;
    const deltaX = clampDrag(event.clientX - current.startX, g);
    const speed =
      Math.abs(deltaX) / Math.max(event.timeStamp - current.startTime, 1);
    didDrag.current = true;

    const target = pickTarget(deltaX, g, speed);
    setTargetSlot(0);
    if (target !== 0) move(target);
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

  // 끌면 앞뒤로 배너 수만큼 줄지어 나오니 그만큼 그려 둔다. 바깥 칸은 평소 투명하다.
  const reach = hasMultiple ? count : 0;
  const slots = Array.from(
    { length: reach * 2 + 1 },
    (_, index) => index - reach,
  );

  return (
    <section
      ref={sectionRef}
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
      <div
        ref={sideProbeRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute h-0 w-(--side)"
      />
      <div
        ref={stepProbeRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute h-0 w-[calc(var(--side)+var(--gap))]"
      />
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
              data-slot={slot}
              aria-hidden={Math.abs(slot) >= 2}
              aria-roledescription="slide"
              // 끄는 동안에는 대기 칸의 장도 보여야 빈 자리가 드러나지 않는다.
              style={{
                ...slotStyle(slot),
                ...(isDragging ? { opacity: 1 } : null),
              }}
              className={cn(
                "absolute top-0 left-0 h-full w-(--center) overflow-hidden bg-scrim will-change-transform",
                // 끄는 동안에는 장이 움직이지 않으니 전환을 끈다 — 대기 장이 서서히가 아니라 곧바로 보인다.
                isDragging
                  ? "transition-[filter] duration-200"
                  : "transition-[transform,clip-path,opacity,filter] duration-850 ease-(--ease-banner) motion-reduce:transition-none",
                // 끄는 동안 놓으면 펼쳐질 장만 밝게, 나머지는 한 톤 어둡게.
                isDragging &&
                  (slot === targetSlot
                    ? "brightness-110"
                    : "brightness-[0.65]"),
                Math.abs(slot) >= 2 && !isDragging && "pointer-events-none",
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
                // 화살표 대신 접힌 장 자체가 넘기는 버튼이다. 올리면 살짝 밝아져 누를 수 있다는 걸 알린다.
                <button
                  type="button"
                  tabIndex={Math.abs(slot) >= 2 ? -1 : undefined}
                  onClick={() => move(slot)}
                  className="block h-full w-full cursor-pointer transition-[filter] duration-300 hover:brightness-125 focus-visible:brightness-125 focus-visible:outline-none"
                  aria-label={slot < 0 ? t("previousBanner") : t("nextBanner")}
                >
                  {card}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
