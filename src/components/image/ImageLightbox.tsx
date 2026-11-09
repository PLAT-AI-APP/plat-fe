"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Close } from "@/icons";
import ResourceImage from "@/components/ResourceImage";

export interface LightboxImage {
  id: string;
  url: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  /** 이미지 대체 텍스트를 만든다. 몇 번째 이미지인지(1부터)를 받는다. */
  getAlt: (position: number) => string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  /** 서명 URL 처럼 이미지 최적화를 거치면 안 되는 주소일 때 켠다. */
  unoptimized?: boolean;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

/**
 * 이미지를 화면 가득 크게 보여 주는 오버레이.
 * ESC · 바깥 클릭 · 닫기 버튼으로 닫고, 좌우 방향키·화살표 버튼으로 앞뒤 이미지를 넘긴다.
 * 닫으면 연 버튼으로 초점을 돌려주고, 열려 있는 동안 뒤 화면은 스크롤되지 않게 막는다.
 */
const ImageLightbox = ({
  images,
  index,
  getAlt,
  closeLabel,
  previousLabel,
  nextLabel,
  unoptimized = false,
  onChangeIndex,
  onClose,
}: ImageLightboxProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];
  const hasPrevious = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "ArrowLeft" && hasPrevious) {
        onChangeIndex(index - 1);
      } else if (event.key === "ArrowRight" && hasNext) {
        onChangeIndex(index + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasNext, hasPrevious, index, onChangeIndex, onClose]);

  if (!image) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={getAlt(index + 1)}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 p-4 backdrop-blur-sm sm:p-10"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full border border-main bg-card text-font-1 shadow-popover hover:bg-btn-hover sm:top-5 sm:right-5"
      >
        <Close size={20} aria-hidden="true" />
      </button>

      {hasPrevious && (
        <button
          type="button"
          aria-label={previousLabel}
          onClick={() => onChangeIndex(index - 1)}
          className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-main bg-card text-font-1 hover:bg-btn-hover sm:left-5"
        >
          <span
            aria-hidden="true"
            className="ml-1 size-3 rotate-45 border-b-2 border-l-2 border-current"
          />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => onChangeIndex(index + 1)}
          className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-main bg-card text-font-1 hover:bg-btn-hover sm:right-5"
        >
          <span
            aria-hidden="true"
            className="mr-1 size-3 rotate-45 border-r-2 border-t-2 border-current"
          />
        </button>
      )}

      {/* 이미지 틀이 클릭을 가로채면 이미지 주변 빈 곳을 눌러도 닫히지 않아, 클릭은 뒤 오버레이가 받게 한다. */}
      <div className="pointer-events-none relative h-full w-full max-w-5xl">
        <ResourceImage
          key={image.id}
          src={image.url}
          alt={getAlt(index + 1)}
          fill
          unoptimized={unoptimized}
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="rounded-xl object-contain"
        />
      </div>
    </div>,
    document.body,
  );
};

export default ImageLightbox;
