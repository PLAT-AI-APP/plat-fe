"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DrawCheck from "./DrawCheck";

interface UploadStatusOverlayProps {
  isUploading: boolean;
  /** 화면 낭독기에 읽힐 "업로드 중" 문구 */
  label: string;
  /** 스피너 크기 클래스 */
  spinnerClassName?: string;
  /** 완료 체크 크기(px) */
  checkSize?: number;
}

/**
 * 이미지 위 업로드 상태. 부모가 relative 여야 한다.
 * 올리는 동안 이미지가 흐리게 비치고 스피너가 돌고, 끝나면 흐림이 걷히며 체크가 잠깐 그려졌다 사라진다.
 */
const UploadStatusOverlay = ({
  isUploading,
  label,
  spinnerClassName = "size-6",
  checkSize = 32,
}: UploadStatusOverlayProps) => {
  const [wasUploading, setWasUploading] = useState(isUploading);
  const [doneCount, setDoneCount] = useState(0);
  if (wasUploading !== isUploading) {
    setWasUploading(isUploading);
    if (!isUploading) setDoneCount((count) => count + 1);
  }
  const [shownDone, setShownDone] = useState(0);
  const showDone = doneCount > shownDone && !isUploading;

  return (
    <AnimatePresence>
      {isUploading && (
        <m.span
          key="uploading"
          role="status"
          aria-label={label}
          className="absolute inset-0 flex items-center justify-center bg-scrim/40 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <span
            aria-hidden="true"
            className={cn(
              "animate-spin rounded-full border-2 border-white/40 border-t-white",
              spinnerClassName,
            )}
          />
        </m.span>
      )}
      {showDone && (
        <m.span
          key={`done-${doneCount}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-scrim/30 text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          onAnimationComplete={() => setShownDone(doneCount)}
        >
          <DrawCheck bare size={checkSize} delay={0.15} />
        </m.span>
      )}
    </AnimatePresence>
  );
};

export default UploadStatusOverlay;
