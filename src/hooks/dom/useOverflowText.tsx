import { useState, useEffect, RefObject } from "react";

/**
 * 특정 줄 수(Line)를 초과하는지 감지하는 훅
 * @param ref - 검사할 HTML 엘리먼트
 * @param lineLimit - 기준이 되는 줄 수 (예: 4를 넣으면 4줄 초과 시 true)
 * @param dependency - 재측정을 유도할 의존성 (텍스트 내용 등)
 */
export const useLineOverflow = (
  ref: RefObject<HTMLElement | null>,
  lineLimit: number,
  dependency: string,
) => {
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkOverflow = () => {
      // 엘리먼트의 실제 스타일 정보(line-height) 가져오기
      const style = window.getComputedStyle(element);
      let lineHeight = parseFloat(style.lineHeight);

      // line-height가 'normal'인 경우 font-size의 약 1.2배로 계산 (브라우저 표준 대비)
      if (isNaN(lineHeight)) {
        const fontSize = parseFloat(style.fontSize);
        lineHeight = fontSize * 1.2;
      }

      // 임계값 계산 (한 줄 높이 * 제한 줄 수)
      // 소수점 오차를 방지하기 위해 1px 정도 여유를 둡니다.
      const threshold = lineHeight * lineLimit;

      // 현재 전체 높이(scrollHeight)가 임계값보다 큰지 확인
      setIsOverflow(element.scrollHeight > threshold + 1);
    };

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(checkOverflow);
    });

    observer.observe(element);
    checkOverflow();

    return () => observer.disconnect();
  }, [ref, lineLimit, dependency]);

  return isOverflow;
};
