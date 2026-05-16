import React, { useEffect, useRef, useState } from "react";

/**
 * 텍스트 내용에 맞춰 textarea의 높이를 자동으로 조절해주는 훅(Hook)
 */
export const useAutoResize = (value: any, enabled: boolean) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea || !enabled) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    if (enabled) {
      adjustHeight();
    }
  }, [value, enabled]);

  return { textareaRef, adjustHeight };
};

/**
 * 왼쪽 요소의 너비(width)를 계산하여 그에 맞는 padding-left 값을 자동으로 설정해주는 훅(Hook)
 */
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
