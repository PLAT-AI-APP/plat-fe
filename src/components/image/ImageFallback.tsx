"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import EmptyMascot from "@/components/state/EmptyMascot";
import { cn } from "@/lib/utils";

export interface ImageFallbackProps {
  /** 원래 이미지의 alt. 대체 영역의 aria-label 이 된다(비어 있으면 장식으로 숨긴다). */
  alt?: string;
  /** 자리의 크기·둥글기·위치. 원래 이미지에 주던 className 을 그대로 넘기면 된다. */
  className?: string;
  style?: CSSProperties;
  /** next/image 의 width/height 처럼 자리 크기를 px 로 줄 때. className 의 크기 지정이 이긴다. */
  width?: number | `${number}`;
  height?: number | `${number}`;
  /** next/image 의 fill 처럼 부모를 가득 채울 때(absolute inset-0). */
  fill?: boolean;
}

/**
 * 백엔드 이미지를 받지 못했을 때 깨진 이미지 대신 그리는 기본 이미지.
 *
 * "에셋을 찾을 수 없어요" 빈 화면과 같은 그림체로, 카드 면 바닥에서 '찾을 수 없음'(ghost, 점선)
 * 마스코트가 몸을 반쯤 내밀고 폭의 대부분을 채운다. 문구는 위쪽 가운데. 자리 크기는 컨테이너 쿼리로 읽는다
 * (styles/mascot.css 의 .image-fallback).
 *  - 가로·세로 모두 100px 이상: 마스코트 + "이미지를 찾을 수 없어요"
 *  - 그보다 작으면(아바타·작은 썸네일): 문구 없이 같은 마스코트를 폭에 꽉 차게
 * 움직임은 넣지 않는다 — 목록에서 여러 장이 한꺼번에 실패하면 화면이 어지러워진다.
 */
const ImageFallback = ({
  alt,
  className,
  style,
  width,
  height,
  fill,
}: ImageFallbackProps) => {
  const t = useTranslations("state");
  const label = alt?.trim();
  const sized = !fill && width != null && height != null;

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      data-sized={sized ? "" : undefined}
      className={cn("image-fallback", fill && "absolute inset-0", className)}
      style={{
        ...(sized && {
          "--image-fallback-w": `${width}px`,
          "--image-fallback-h": `${height}px`,
          "--image-fallback-ratio": `${width} / ${height}`,
        }),
        ...style,
      } as CSSProperties}
    >
      <p className="image-fallback-label text-center text-font-2 break-keep">
        {t("imageNotFound")}
      </p>
      <div className="image-fallback-mascot">
        <EmptyMascot mood="ghost" />
      </div>
    </div>
  );
};

export default ImageFallback;
