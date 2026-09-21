"use client";

import { useState } from "react";

/**
 * 로딩이 끝난 순간부터 붙일 fade-in 클래스를 돌려줍니다.
 *
 * 캐시가 있어 처음부터 로딩이 아니었던 화면에는 붙이지 않습니다 — 스켈레톤이 없었는데
 * 콘텐츠만 슬며시 나타나면 오히려 깜빡이는 것처럼 보입니다.
 * 한 번이라도 로딩을 거친 뒤 로딩이 끝나면 붙고, 이후 데이터가 갱신돼도 다시 재생되지 않습니다.
 */
export const useFadeInAfterLoading = (isLoading: boolean) => {
  const [hasBeenLoading, setHasBeenLoading] = useState(isLoading);

  // effect 가 아니라 렌더 중에 반영해야 로딩이 끝나는 바로 그 렌더에 클래스가 붙는다.
  if (isLoading && !hasBeenLoading) setHasBeenLoading(true);

  return hasBeenLoading && !isLoading ? "fade-in" : "";
};
