import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

/**
 * 관찰 기준이 될 스크롤 조상을 찾는다.
 *
 * root 를 주지 않으면 기준이 브라우저 창이 된다. 목록이 창이 아니라 안쪽 컨테이너(모달 본문,
 * 채팅 목록 등)에서 스크롤하면, 대상은 그 컨테이너에 먼저 잘린 뒤 교차 판정을 받기 때문에
 * 창 기준 rootMargin 은 아무 효과가 없다 — 미리 불러오기가 0px 로 동작해 바닥에 닿아야 다음
 * 쪽을 받기 시작했다. 가장 가까운 스크롤 조상을 기준으로 삼고, 문서가 스크롤하면 창을 쓴다.
 */
const findScrollRoot = (target: Element): Element | null => {
  let node = target.parentElement;

  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }

  // 문서 스크롤이면 root 는 null(= 창)이 맞다.
  return null;
};

export const useIntersectionObserver = ({
  onIntersect,
  // 아래쪽으로만 넉넉히 둔다. 바닥에 닿기 한 화면쯤 전에 다음 쪽을 받기 시작해야 기다림이 없다.
  rootMargin = "0px 0px 800px 0px",
  threshold = 0,
  enabled = true,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect(); // 바닥 감지 시 실행할 함수
          }
        });
      },
      { root: findScrollRoot(target), rootMargin, threshold },
    );

    observer.observe(target);

    return () => observer.unobserve(target);
  }, [onIntersect, rootMargin, threshold, enabled]);

  return { targetRef };
};
