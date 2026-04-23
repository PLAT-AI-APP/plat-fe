import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  onIntersect,
  rootMargin = "100px", // 바닥에 닿기 100px 전에 미리 불러오기 (자연스러운 사용자 경험)
  threshold = 0.1,
  enabled = true,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect(); // 바닥 감지 시 실행할 함수
          }
        });
      },
      { rootMargin, threshold },
    );

    const target = targetRef.current;
    observer.observe(target);

    return () => observer.unobserve(target);
  }, [onIntersect, rootMargin, threshold, enabled]);

  return { targetRef };
};
