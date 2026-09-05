"use client";

import React, { useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { useTranslations } from "next-intl";
import { Close } from "@/icons";
import { ModalLayout } from "@/components/ModalLayout";
import { createCroppedImageDataUrl } from "@/lib/cropImage";
import { cn } from "@/lib/utils";

interface RepresentativeImageCropModalProps {
  imageSrc: string;
  imageType: string;
  onApply: (croppedImage: string) => void | Promise<void>;
  onClose: () => void;
}

// 대표 이미지는 항상 정사각형 썸네일로 사용되므로 크롭 비율을 1:1로 고정합니다.
const FIXED_CROP_ASPECT = 1;

const RepresentativeImageCropModal = ({
  imageSrc,
  imageType,
  onApply,
  onClose,
}: RepresentativeImageCropModalProps) => {
  const t = useTranslations("modalUi.imageCrop");
  const commonT = useTranslations("modalUi.common");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropSize, setCropSize] = useState<{ width: number; height: number }>();
  const [isApplying, setIsApplying] = useState(false);

  const handleCropComplete = (
    _croppedArea: Area,
    nextCroppedAreaPixels: Area,
  ) => {
    // 라이브러리가 계산한 실제 픽셀 좌표를 저장해 확인 버튼에서 그대로 사용합니다.
    setCroppedAreaPixels(nextCroppedAreaPixels);
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;

    setIsApplying(true);

    try {
      const croppedImage = await createCroppedImageDataUrl({
        imageSrc,
        cropArea: croppedAreaPixels,
        outputType: imageType === "image/png" ? "image/png" : "image/jpeg",
      });

      await onApply(croppedImage);
    } finally {
      setIsApplying(false);
    }
  };

  const handleMediaLoaded = (mediaSize: { width: number; height: number }) => {
    // 보이는 이미지 영역 안에 크롭 박스가 딱 맞도록, 짧은 변을 기준으로 1:1 크롭 크기를 계산합니다.
    const visibleImageSize = Math.min(mediaSize.width, mediaSize.height);

    setCropSize({
      width: visibleImageSize,
      height: visibleImageSize,
    });
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-[513px] rounded-3xl border border-main bg-dark px-6 pb-6 pt-8"
    >
      <div className="flex flex-col gap-8">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="title-1 text-font-1">{t("title")}</h2>
            <p className="body-5 pt-3 text-font-2">{t("description")}</p>
          </div>

          <button
            type="button"
            aria-label={commonT("close")}
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-font-disabled hover:bg-btn-hover"
          >
            <Close className="size-5" />
          </button>
        </header>

        <div className="flex flex-col gap-4">
          <section className="relative aspect-square w-full overflow-hidden bg-scrim">
            <Cropper
              image={imageSrc}
              crop={crop}
              cropSize={cropSize}
              zoom={1}
              aspect={FIXED_CROP_ASPECT}
              cropShape="rect"
              showGrid={false}
              objectFit="contain"
              minZoom={1}
              maxZoom={1}
              zoomWithScroll={false}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onMediaLoaded={handleMediaLoaded}
              style={{
                containerStyle: {
                  backgroundColor: "#000000",
                },
                cropAreaStyle: {
                  // 크롭 영역 경계는 스크림 위에 얹히므로 얇은 반투명 흰 선이면 충분하다.
                  border: "1px solid rgba(255, 255, 255, 0.72)",
                },
              }}
            />
          </section>
        </div>

        <footer className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="title-5 h-11 flex-1 rounded-2xl bg-card-selected px-5 text-font-1 transition-colors hover:bg-main"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !croppedAreaPixels}
            className={cn(
              "title-5 h-11 flex-1 rounded-2xl px-5 transition-colors",
              isApplying || !croppedAreaPixels
                ? "cursor-not-allowed bg-card text-font-disabled"
                : "bg-brand text-on-brand hover:bg-brand-dark",
            )}
          >
            {t("apply")}
          </button>
        </footer>
      </div>
    </ModalLayout>
  );
};

export default RepresentativeImageCropModal;
