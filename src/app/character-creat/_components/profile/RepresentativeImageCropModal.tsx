"use client";

import React, { useMemo, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { useTranslations } from "next-intl";
import { Close } from "@/icons";
import { ModalLayout } from "@/components/ModalLayout";
import { createCroppedImageDataUrl } from "@/lib/cropImage";
import { cn } from "@/lib/utils";

type CropRatioKey =
  | "original"
  | "square"
  | "landscape"
  | "portrait"
  | "widescreen";

interface RepresentativeImageCropModalProps {
  imageSrc: string;
  imageType: string;
  onApply: (croppedImage: string) => void;
  onClose: () => void;
}

const CROP_RATIO_VALUES: Record<CropRatioKey, number | null> = {
  original: null,
  square: 1,
  landscape: 4 / 3,
  portrait: 3 / 4,
  widescreen: 16 / 9,
};

const RepresentativeImageCropModal = ({
  imageSrc,
  imageType,
  onApply,
  onClose,
}: RepresentativeImageCropModalProps) => {
  const t = useTranslations("modalUi.imageCrop");
  const commonT = useTranslations("modalUi.common");
  const [selectedRatio, setSelectedRatio] = useState<CropRatioKey>("portrait");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageAspect, setImageAspect] = useState(1);
  const [isApplying, setIsApplying] = useState(false);

  const aspect = useMemo(() => {
    if (selectedRatio === "original") {
      return imageAspect;
    }

    return CROP_RATIO_VALUES[selectedRatio] ?? 1;
  }, [imageAspect, selectedRatio]);

  const handleCropComplete = (_croppedArea: Area, nextCroppedAreaPixels: Area) => {
    // 라이브러리가 계산한 실제 픽셀 영역만 저장해 두고, 적용 시 canvas 유틸에 넘깁니다.
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

      onApply(croppedImage);
    } finally {
      setIsApplying(false);
    }
  };

  const ratioOptions: CropRatioKey[] = [
    "original",
    "square",
    "landscape",
    "portrait",
    "widescreen",
  ];

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-[860px] rounded-3xl border border-border-main bg-bg-dark p-5"
    >
      <div className="flex flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="title-1 text-font-1">{t("title")}</h2>
            <p className="body-4 pt-2 text-font-2">{t("description")}</p>
          </div>

          <button
            type="button"
            aria-label={commonT("close")}
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-btn-hover"
          >
            <Close className="size-4" />
          </button>
        </header>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-card p-4">
            <p className="body-5 pb-3 text-font-2">{t("dragGuide")}</p>

            <div className="grid grid-cols-2 gap-2">
              {ratioOptions.map((ratioKey) => (
                <button
                  key={ratioKey}
                  type="button"
                  onClick={() => setSelectedRatio(ratioKey)}
                  className={cn(
                    "body-5 rounded-xl border px-3 py-3 text-left transition-colors",
                    selectedRatio === ratioKey
                      ? "border-brand-dark bg-brand/10 text-brand-dark"
                      : "border-border-main bg-bg-darkest text-font-1 hover:bg-btn-hover",
                  )}
                >
                  {t(`ratios.${ratioKey}`)}
                </button>
              ))}
            </div>

            <div className="pt-5">
              <label className="body-5 flex items-center justify-between pb-2 text-font-2">
                <span>{t("zoom")}</span>
                <span>{zoom.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-brand"
              />
            </div>
          </aside>

          <section className="relative h-[420px] overflow-hidden rounded-2xl bg-bg-darkest">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape="rect"
              showGrid
              objectFit="contain"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={({ naturalWidth, naturalHeight }) => {
                setImageAspect(naturalWidth / naturalHeight);
              }}
            />
          </section>
        </div>

        <footer className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="title-5 rounded-xl border border-border-main px-5 py-3 text-font-1 transition-colors hover:bg-btn-hover"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !croppedAreaPixels}
            className={cn(
              "title-5 rounded-xl px-5 py-3 transition-colors",
              isApplying || !croppedAreaPixels
                ? "cursor-not-allowed bg-card text-font-disabled"
                : "bg-brand/10 text-brand-dark hover:bg-brand/20",
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
