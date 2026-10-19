import React, { useEffect, useRef, useState } from "react";

export const useLeftPadding = (leftElement: React.ReactNode) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(16);

  useEffect(() => {
    if (leftElement && iconRef.current) {
      const iconWidth = iconRef.current.offsetWidth;
      setPaddingLeft(16 + iconWidth + 12);
    } else {
      setPaddingLeft(16);
    }
  }, [leftElement]);

  return { iconRef, paddingLeft };
};

/**
 * 입력 칸 오른쪽에 겹쳐 놓은 묶음(지우기 버튼·글자 수·rightElement)의 폭만큼
 * 오른쪽 여백을 잡는다. 묶음이 비면 undefined 를 돌려 className 의 여백을 그대로 쓴다.
 */
export const useRightPadding = () => {
  const clusterRef = useRef<HTMLDivElement>(null);
  const [paddingRight, setPaddingRight] = useState<number>();

  useEffect(() => {
    const node = clusterRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.offsetWidth;
      setPaddingRight(width > 0 ? 16 + width + 8 : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { clusterRef, paddingRight };
};
