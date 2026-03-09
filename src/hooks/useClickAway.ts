import { useEffect, RefObject } from "react";

// ref를 인자로 받도록 수정
export const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  ignoreRef?: RefObject<HTMLElement | null>, // 제외할 요소(버튼)의 ref 추가
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      const target = event.target as Node;

      // 1. 모달 자체가 없거나 모달 안을 클릭한 경우 무시
      if (!el || el.contains(target)) return;

      // 2. 트리거 버튼(ignoreRef)을 클릭한 경우도 무시
      if (ignoreRef?.current && ignoreRef.current.contains(target)) return;

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, ignoreRef]);
};
