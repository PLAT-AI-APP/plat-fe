import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface UnderlineRect {
  left: number;
  width: number;
}

/**
 * 탭 전환 시 밑줄이 "멀리서 날아오는" 것처럼 보이지 않도록,
 * layoutId 기반 자동 추적 대신 활성 탭 버튼의 실제 위치/너비를 직접 측정해 애니메이션합니다.
 */
export function useTabUnderline<T extends string>(activeKey: T) {
  const containerRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<T, HTMLElement | null>>>({});
  const [rect, setRect] = useState<UnderlineRect>({ left: 0, width: 0 });

  const measure = useCallback(() => {
    const el = tabRefs.current[activeKey];
    if (el) {
      setRect({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeKey]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const setTabRef = (key: T, el: HTMLElement | null) => {
    tabRefs.current[key] = el;
  };

  return { containerRef, setTabRef, rect };
}
