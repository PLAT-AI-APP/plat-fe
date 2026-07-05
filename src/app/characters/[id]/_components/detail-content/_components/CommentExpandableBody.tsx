"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CommentExpandableBodyProps {
  content: string;
}

const COMMENT_BODY_MAX_HEIGHT = 120;

const CommentExpandableBody = ({ content }: CommentExpandableBodyProps) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const contentElement = contentRef.current;

    // 댓글 본문의 실제 높이가 기준값을 넘는 경우에만 더보기 시스템을 노출합니다.
    const updateCommentOverflowState = () => {
      setShouldShowMoreButton(
        contentElement.scrollHeight > COMMENT_BODY_MAX_HEIGHT,
      );
    };

    updateCommentOverflowState();

    const resizeObserver = new ResizeObserver(updateCommentOverflowState);
    resizeObserver.observe(contentElement);

    return () => resizeObserver.disconnect();
  }, [content]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          shouldShowMoreButton && !isExpanded && "max-h-[120px]",
        )}
      >
        <p
          ref={contentRef}
          className="body-4 whitespace-pre-wrap text-font-1"
        >
          {content}
        </p>

        {shouldShowMoreButton && !isExpanded && (
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-linear-to-t from-bg-dark to-bg-dark/0"
            aria-hidden="true"
          />
        )}
      </div>

      {shouldShowMoreButton && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="body-6 w-fit text-font-2"
        >
          {isExpanded ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
};

export default CommentExpandableBody;
