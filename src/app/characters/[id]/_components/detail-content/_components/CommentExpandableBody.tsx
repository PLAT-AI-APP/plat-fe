"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface CommentExpandableBodyProps {
  content: string;
}

const COMMENT_BODY_MAX_HEIGHT = 120;

const CommentExpandableBody = ({ content }: CommentExpandableBodyProps) => {
  const t = useTranslations("characterDetail");
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const contentElement = contentRef.current;

    // 댓글 본문의 실제 높이가 기준값을 넘는 경우에만 더보기 시스템을 노출합니다.
    const updateCommentOverflowState = () => {
      setContentHeight(contentElement.scrollHeight);
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
      <motion.div
        initial={false}
        animate={{
          height: shouldShowMoreButton
            ? isExpanded
              ? contentHeight
              : COMMENT_BODY_MAX_HEIGHT
            : "auto",
        }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="relative w-full overflow-hidden"
      >
        <p ref={contentRef} className="body-4 whitespace-pre-wrap text-font-1">
          {content}
        </p>

        <AnimatePresence>
          {shouldShowMoreButton && !isExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-linear-to-t from-dark to-dark/0"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {shouldShowMoreButton && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="body-6 w-fit text-font-2 transition-colors hover:text-font-1"
        >
          {isExpanded ? t("collapse") : t("expandCompact")}
        </button>
      )}
    </div>
  );
};

export default CommentExpandableBody;
