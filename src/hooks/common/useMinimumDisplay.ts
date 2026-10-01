import { useEffect, useState } from "react";

/**
 * 기다리는 화면을 최소 `minMs` 만큼은 보여 주었는지.
 *
 * 결과가 너무 빨리 오면 대기 연출이 번쩍이고 바로 넘어가 어색하다. 화면을 대기 상태로 열었다면
 * 결과가 먼저 와도 이 값이 true 가 될 때까지 대기 화면을 유지한다.
 * 처음부터 대기할 일이 없는 화면(`startsWaiting` false)은 붙잡지 않는다.
 */
export const useMinimumDisplay = (startsWaiting: boolean, minMs: number) => {
  const [elapsed, setElapsed] = useState(!startsWaiting);

  useEffect(() => {
    if (elapsed) return;
    const timer = window.setTimeout(() => setElapsed(true), minMs);
    return () => window.clearTimeout(timer);
  }, [elapsed, minMs]);

  return elapsed;
};
