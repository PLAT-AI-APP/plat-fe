"use client";

import { type ImgHTMLAttributes, type SyntheticEvent, useState } from "react";
import ImageFallback from "./ImageFallback";

type FallbackImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

/**
 * next/image 를 탈 수 없는 자리(관리자가 올린 외부 주소 등)의 img 에 마스코트 대체를 붙인다.
 * 받지 못하면 같은 className 으로 ImageFallback 을 그린다 — 크기는 className 이 정해야 한다.
 */
const FallbackImg = ({ src, alt, className, style, onError, ...props }: FallbackImgProps) => {
  // 실패한 src 를 기억해 두면 src 가 바뀌었을 때 따로 되돌리지 않아도 된다.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return <ImageFallback alt={alt} className={className} style={style} />;
  }

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setFailedSrc(src);
    onError?.(event);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={src} alt={alt} className={className} style={style} onError={handleError} />
  );
};

export default FallbackImg;
