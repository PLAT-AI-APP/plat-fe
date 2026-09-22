import { useCallback, useEffect, useRef, type UIEvent } from "react";

const SCROLLING_CLASS = "is-scrolling";
const IDLE_DELAY_MS = 1000;

/**
 * 스크롤하는 동안 요소에 `is-scrolling` 클래스를 붙이고, 멈추고 1초 뒤에 뗀다.
 * (`hide-scrollbar-on-idle` 과 짝을 이뤄 스크롤할 때만 스크롤바를 보인다.)
 *
 * 예전에는 state 로 들고 있어서 스크롤이 시작·끝날 때마다 채팅방·미리보기 같은 큰 화면 전체가
 * 다시 그려졌다. 화면에 필요한 건 클래스 하나라 DOM 에 직접 붙인다.
 */
export const useScrollTimeout = () => {
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    },
    [],
  );

  const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.classList.add(SCROLLING_CLASS);

    // 스크롤 중에는 계속 미뤄지다가, 멈추면 그때부터 1초 뒤에 뗀다.
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      element.classList.remove(SCROLLING_CLASS);
    }, IDLE_DELAY_MS);
  }, []);

  return { onScroll };
};
