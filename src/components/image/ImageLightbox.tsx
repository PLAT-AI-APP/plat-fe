"use client";

import { useEffect, useRef, useState } from "react";
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
 * 배경 없이 이미지만(높이 70vh 이내) 띄우고, 닫기·이전·다음 버튼은 이미지 위에 붙인다.
 * ESC · 이미지 밖 누르기 · 닫기 버튼으로 닫고, 밖을 누른 동작은 막지 않아 그대로 실행된다.
 * 좌우 방향키·화살표 버튼으로 앞뒤 이미지를 넘기고, 닫으면 연 버튼으로 초점을 돌려준다.
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
  const frameRef = useRef<HTMLDivElement>(null);
  // 이미지별로 받은 가로세로 비율. 다른 이미지로 넘기면 id 가 달라 이전 비율을 쓰지 않는다.
  const [ratio, setRatio] = useState<{ id: string; value: number } | null>(
    null,
  );
  const image = images[index];
  const hasPrevious = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();

    return () => {
      opener?.focus();
    };
  }, []);

  // 이미지·버튼 밖을 누르면 닫는다. 캡처 단계에서 듣기만 하고 막지 않아, 누른 버튼의 동작은 그대로 실행된다.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !frameRef.current?.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [onClose]);

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
    // 배경 없이 이미지만 띄운다. 바깥 영역은 클릭을 막지 않아(pointer-events-none) 누른 대상이 그대로 동작한다.
    <div
      role="dialog"
      aria-label={getAlt(index + 1)}
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        ref={frameRef}
        className="pointer-events-auto flex flex-col items-end gap-2"
      >
        {/* 버튼은 이미지 가장자리에 붙이되 이미지를 가리지 않게 바깥에 둔다. */}
        <button
          ref={closeRef}
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full border border-main bg-card text-font-1 hover:bg-btn-hover"
        >
          <Close size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {/* 이미지가 한 장이어도 좌우 자리를 같게 잡아 이미지가 가운데에 놓이게 한다. */}
          <div className="size-9 shrink-0">
            {hasPrevious && (
              <button
                type="button"
                aria-label={previousLabel}
                onClick={() => onChangeIndex(index - 1)}
                className="flex size-9 items-center justify-center rounded-full border border-main bg-card text-font-1 hover:bg-btn-hover"
              >
                <span
                  aria-hidden="true"
                  className="ml-1 size-2.5 rotate-45 border-b-2 border-l-2 border-current"
                />
              </button>
            )}
          </div>

          {/* 높이를 70vh 로 못 박고 가로는 원본 비율로 잡는다. 내용 크기에 맡기면(w-auto) 칸이 0 으로 접혀 이미지가 안 보였다.
              비율은 받은 뒤에야 알 수 있어, 그 전엔 정사각형 자리로 둔다. */}
          <div
            className="relative h-[70vh] max-w-[calc(100vw-9rem)]"
            style={{
              aspectRatio: ratio?.id === image.id ? ratio.value : 1,
            }}
          >
            <ResourceImage
              key={image.id}
              src={image.url}
              alt={getAlt(index + 1)}
              fill
              unoptimized={unoptimized}
              sizes="(min-width: 1024px) 1024px, 100vw"
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                if (naturalWidth && naturalHeight) {
                  setRatio({
                    id: image.id,
                    value: naturalWidth / naturalHeight,
                  });
                }
              }}
              className="rounded-xl object-contain"
            />
          </div>

          <div className="size-9 shrink-0">
            {hasNext && (
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => onChangeIndex(index + 1)}
                className="flex size-9 items-center justify-center rounded-full border border-main bg-card text-font-1 hover:bg-btn-hover"
              >
                <span
                  aria-hidden="true"
                  className="mr-1 size-2.5 rotate-45 border-r-2 border-t-2 border-current"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ImageLightbox;
