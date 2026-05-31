"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface UseVisibleItemCountOptions<T> {
  items: T[];
  maxLines?: number;
}

export const useVisibleItemCount = <T>({
  items,
  maxLines = 1,
}: UseVisibleItemCountOptions<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [visibleCount, setVisibleCount] = useState(items.length);

  const measure = useCallback(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);

    const elements = itemRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!elements.length) {
      setVisibleCount((prev) => (prev === items.length ? prev : items.length));
      return;
    }

    /**
     * 줄별 offsetTop 수집
     */
    const lineTops = Array.from(new Set(elements.map((el) => el.offsetTop)));

    /**
     * 허용 라인만 추출
     */
    const allowedTops = lineTops.slice(0, maxLines);

    /**
     * 허용 라인에 포함되는 요소 개수 계산
     */
    const nextVisibleCount = elements.filter((el) =>
      allowedTops.includes(el.offsetTop),
    ).length;

    setVisibleCount((prev) =>
      prev === nextVisibleCount ? prev : nextVisibleCount,
    );
  }, [items.length, maxLines]);

  useLayoutEffect(() => {
    let animationFrameId: number | null = null;
    const scheduleMeasure = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(measure);
    };

    scheduleMeasure();

    const observer = new ResizeObserver(scheduleMeasure);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      observer.disconnect();
    };
  }, [measure]);

  return {
    containerRef,
    itemRefs,
    visibleCount,
    hiddenCount: Math.max(items.length - visibleCount, 0),
  };
};
