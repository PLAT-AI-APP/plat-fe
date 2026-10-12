"use client";

import Image, { type ImageProps } from "next/image";
import { type SyntheticEvent, useState } from "react";
import ImageFallback from "@/components/image/ImageFallback";
import { toImageVariantUrl } from "@/lib/file";

type ResourceImageProps = ImageProps & {
  /**
   * 끝내 받지 못했을 때 마스코트 기본 이미지(ImageFallback)를 그릴지. 기본은 켜짐.
   * 호출부가 실패 시 자기만의 대체(이니셜 아바타 등)를 그린다면 끈다.
   */
  showFallback?: boolean;
};

type LoadStage = "variant" | "failed";

/**
 * 백엔드 이미지를 그리는 next/image.
 *
 * 1. 작은 변형본(sq140 등)을 받지 못하면 표시용 큰 이미지(lg)로 한 번 다시 받는다.
 *    변형본은 업로드할 때 만들어지므로, 변형본 정책이 생기기 전에 올린 파일이나 시드 데이터에는 없을 수 있다
 *    (원본 origin 은 공개로 열리지 않는다).
 * 2. lg 까지 실패하면 같은 자리에 마스코트 기본 이미지를 그린다 — fill 이면 부모를 채우고,
 *    width/height 면 그 크기, className 의 크기·둥글기는 그대로 따른다. 호출부의 onError 는 그대로 불린다.
 */
const ResourceImage = ({
  src,
  alt,
  onError,
  showFallback = true,
  ...props
}: ResourceImageProps) => {
  // 실패한 src 와 단계를 같이 기억해 두면, src 가 다른 이미지로 바뀌었을 때 따로 되돌리지 않아도 된다.
  const [failure, setFailure] = useState<{
    src: ImageProps["src"];
    stage: LoadStage;
  } | null>(null);
  const stage = failure?.src === src ? failure.stage : null;
  const fallbackSrc = typeof src === "string" ? toImageVariantUrl(src, "lg") : src;
  const currentSrc = stage === null ? src : fallbackSrc;

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (stage === null && fallbackSrc !== src) {
      setFailure({ src, stage: "variant" });
      return;
    }

    setFailure({ src, stage: "failed" });
    onError?.(event);
  };

  // 빈 src 는 next/image 가 그리지 못하므로 받지 못한 것과 똑같이 다룬다.
  if (showFallback && (stage === "failed" || src === "")) {
    return (
      <ImageFallback
        alt={alt}
        className={props.className}
        style={props.style}
        fill={props.fill}
        width={props.width}
        height={props.height}
      />
    );
  }

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
};

export default ResourceImage;
