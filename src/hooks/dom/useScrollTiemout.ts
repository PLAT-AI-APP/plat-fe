import { useState, useRef, useCallback } from "react";

export const useScrollTimeout = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  const onScroll = useCallback(() => {
    // 스크롤이 시작되면 true
    setIsScrolling(true);

    // 이전 타이머가 있다면 초기화 (스크롤 중에는 계속 초기화됨)
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    // 스크롤을 멈추고 1초(timeout) 뒤에 false로 변경
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  return { isScrolling, onScroll };
};
