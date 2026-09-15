import { useCallback, useLayoutEffect, useRef } from "react";

interface UseAutoResizeTextareaOptions {
  enabled?: boolean;
  // 지정하면 이 줄 수까지만 커지고, 이후 내용은 textarea 내부 스크롤로 처리합니다.
  maxRows?: number;
  // controlled textarea 값이 바뀔 때마다 높이를 다시 계산하기 위한 의존값입니다.
  value: unknown;
}

const getNumericStyle = (
  styles: CSSStyleDeclaration,
  propertyName: keyof CSSStyleDeclaration,
) => {
  const value = styles[propertyName];

  return typeof value === "string" ? Number.parseFloat(value) || 0 : 0;
};

const getLineHeight = (styles: CSSStyleDeclaration) => {
  const lineHeight = Number.parseFloat(styles.lineHeight);

  if (Number.isFinite(lineHeight)) return lineHeight;

  // line-height: normal 처럼 px 값으로 계산되지 않는 경우 브라우저 기본값에 가까운 1.5배를 사용합니다.
  return getNumericStyle(styles, "fontSize") * 1.5;
};

const getMaxHeight = (textarea: HTMLTextAreaElement, maxRows: number) => {
  const styles = window.getComputedStyle(textarea);
  // scrollHeight에는 padding이 포함되므로, maxRows 기준 높이에도 상하 padding을 더합니다.
  const verticalPadding =
    getNumericStyle(styles, "paddingTop") +
    getNumericStyle(styles, "paddingBottom");

  return getLineHeight(styles) * maxRows + verticalPadding;
};

export const useAutoResizeTextarea = ({
  enabled = true,
  maxRows,
  value,
}: UseAutoResizeTextareaOptions) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea || !enabled) return;

    // 내용이 줄어든 경우에도 높이가 다시 작아질 수 있도록 먼저 auto로 초기화합니다.
    textarea.style.height = "auto";

    const maxHeight = maxRows ? getMaxHeight(textarea, maxRows) : undefined;
    const nextHeight = maxHeight
      ? Math.min(textarea.scrollHeight, maxHeight)
      : textarea.scrollHeight;

    textarea.style.height = `${nextHeight}px`;

    if (maxHeight) {
      // 최대 줄 수를 넘긴 뒤에는 form 전체가 계속 커지지 않도록 내부 스크롤로 전환합니다.
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  }, [enabled, maxRows]);

  useLayoutEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  return { textareaRef, resizeTextarea };
};
