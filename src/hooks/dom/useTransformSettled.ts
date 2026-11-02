"use client";

import { type RefObject, useEffect, useState } from "react";

/** 등장 애니메이션이 끝나지 않더라도 이 시간이 지나면 더 기다리지 않는다. */
const MAX_WAIT_MS = 1000;

/**
 * 요소와 조상의 transform(scale 등) 애니메이션이 끝나 원래 크기가 됐는지.
 *
 * getBoundingClientRect 는 transform 이 반영된 크기를, offsetWidth 는 반영되지 않은 크기를 준다.
 * 둘이 같아지면 애니메이션이 끝난 것이다. 모달처럼 축소된 채 나타나는 곳에서 크기를 재는 라이브러리
 * (react-easy-crop 등)는 이 시점 뒤에 올려야 축소된 크기를 기준으로 굳지 않는다.
 */
export const useTransformSettled = (ref: RefObject<HTMLElement | null>) => {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;

    const check = () => {
      const element = ref.current;
      const isTimedOut = performance.now() - startedAt > MAX_WAIT_MS;
      const isFullSize =
        element !== null &&
        Math.abs(element.getBoundingClientRect().width - element.offsetWidth) < 0.5;

      if (isFullSize || isTimedOut) {
        setIsSettled(true);
        return;
      }
      frameId = requestAnimationFrame(check);
    };

    frameId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frameId);
  }, [ref]);

  return isSettled;
};
