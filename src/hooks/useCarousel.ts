"use client";

import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Embla Carousel을 프로젝트에서 쓰기 편한 형태로 감싼 공통 hook입니다.
 *
 * 컴포넌트에서는 `viewportRef`를 Embla viewport 요소에 연결하고,
 * 버튼이나 외부 UI에서는 `scrollPrev`, `scrollNext`, `scrollTo`를 사용하면 됩니다.
 */
interface UseCarouselOptions {
  /** Embla 기본 옵션입니다. 예: `{ loop: true }`, `{ align: "start" }` */
  options?: EmblaOptionsType;
  /** Autoplay, Fade처럼 Embla에 연결할 플러그인 목록입니다. */
  plugins?: EmblaPluginType[];
  /**
   * 선택된 슬라이드가 바뀔 때 호출됩니다.
   * 외부 탭/썸네일 상태를 캐러셀 선택 상태와 맞출 때 사용합니다.
   */
  onSelect?: (selectedIndex: number, emblaApi: EmblaCarouselType) => void;
}

/**
 * Embla API를 직접 반복해서 다루지 않도록 navigation과 선택 상태를 함께 제공합니다.
 */
export const useCarousel = ({
  options,
  plugins = [],
  onSelect,
}: UseCarouselOptions = {}) => {
  // `viewportRef`는 스크롤이 잘리는 viewport DOM에 연결해야 Embla가 초기화됩니다.
  const [viewportRef, emblaApi] = useEmblaCarousel(options, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Embla 내부 상태를 React 상태와 외부 콜백으로 동기화합니다.
  const syncCarouselState = useCallback(() => {
    if (!emblaApi) return;

    const nextSelectedIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(nextSelectedIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    onSelect?.(nextSelectedIndex, emblaApi);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    // React Compiler의 set-state-in-effect 규칙을 피하면서 초기 상태를 맞춥니다.
    const frameId = window.requestAnimationFrame(syncCarouselState);
    emblaApi.on("select", syncCarouselState);
    emblaApi.on("reInit", syncCarouselState);

    return () => {
      window.cancelAnimationFrame(frameId);
      emblaApi.off("select", syncCarouselState);
      emblaApi.off("reInit", syncCarouselState);
    };
  }, [emblaApi, syncCarouselState]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return {
    viewportRef,
    emblaApi,
    selectedIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
  };
};
