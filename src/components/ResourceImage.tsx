"use client";

import Image, { type ImageProps } from "next/image";
import { type SyntheticEvent, useState } from "react";
import { toImageVariantUrl } from "@/lib/file";

/**
 * 백엔드 이미지의 작은 변형본(sq140 등)을 그리다가 받지 못하면 표시용 큰 이미지(lg)로 한 번 다시 받는 next/image.
 *
 * 변형본은 업로드할 때 만들어지므로, 변형본 정책이 생기기 전에 올린 파일이나 시드 데이터에는 없을 수 있다.
 * 그때 깨진 이미지 대신 lg 를 보여 준다(원본 origin 은 공개로 열리지 않는다). lg 까지 실패하면 호출부의 onError 에 맡긴다.
 */
const ResourceImage = ({ src, alt, onError, ...props }: ImageProps) => {
  // 실패한 src 를 기억해 두면, src 가 다른 이미지로 바뀌었을 때 따로 되돌리지 않아도 된다.
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const fallbackSrc = typeof src === "string" ? toImageVariantUrl(src, "lg") : src;
  const currentSrc = failedSrc === src ? fallbackSrc : src;

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (failedSrc !== src && fallbackSrc !== src) {
      setFailedSrc(src);
      return;
    }

    onError?.(event);
  };

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
};

export default ResourceImage;
