"use client";

import React, { createContext, useContext } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import ImageReviewNotice from "@/components/review/ImageReviewNotice";
import StatusError from "@/icons/StatusError";
import { getImageReasonKey, isBlockingImage } from "@/lib/imageReview";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import type { ReviewImage } from "@/type/card";
import type { TabId } from "./CreateTabs";

interface ImageReviewContextValue {
  /** 수정 중인 세계관에서 공개를 막고 있는 이미지 */
  images: ReviewImage[];
  openSettings: () => void;
}

export const ImageReviewContext = createContext<ImageReviewContextValue>({
  images: [],
  openSettings: () => {},
});

export const useReviewImages = () => useContext(ImageReviewContext).images;

/** 칸을 직접 고르는 대표 이미지·캐릭터 프로필. 새로 올렸거나(파일 ID 가 생김) 지웠으면 표시하지 않는다. */
export const useSlotReviewImage = (
  usage: "UNIVERSE_PROFILE" | "CHARACTER_PROFILE",
  preview: string,
  replacedFileId: string | number | null | undefined,
) => {
  const image = useReviewImages().find((item) => item.usage === usage);
  return image && preview && !replacedFileId ? image : undefined;
};

/** 아직 폼에 남아 있는(바꾸지 않은) 이미지만. 탭 표시·상단 안내가 쓴다. */
const useActiveReviewImages = () => {
  const images = useReviewImages();
  const { control } = useFormContext<CharacterCreateFormValues>();
  const [representativeImage, representativeImageId, characterProfileImage, characterProfileImageId, assets] =
    useWatch({
      control,
      name: [
        "representativeImage",
        "representativeImageId",
        "characterProfileImage",
        "characterProfileImageId",
        "asset",
      ],
    });

  return images.filter((image) => {
    if (image.usage === "UNIVERSE_PROFILE") return Boolean(representativeImage) && !representativeImageId;
    if (image.usage === "CHARACTER_PROFILE") return Boolean(characterProfileImage) && !characterProfileImageId;
    return (assets ?? []).some((asset) => String(asset.assetImageFileId) === image.fileId);
  });
};

const TAB_BY_USAGE: Record<ReviewImage["usage"], TabId> = {
  UNIVERSE_PROFILE: "profile",
  CHARACTER_PROFILE: "details",
  UNIVERSE_ASSET: "assets",
};

/** 반려·성인 설정 필요 이미지가 있는 탭 옆의 점 */
export const ReviewTabDot = ({ tabId }: { tabId: TabId }) => {
  const t = useTranslations("imageReview");
  const hasIssue = useActiveReviewImages().some(
    (image) => isBlockingImage(image) && TAB_BY_USAGE[image.usage] === tabId,
  );
  if (!hasIssue) return null;

  return <span role="img" aria-label={t("tabDot")} className="ml-1 size-1.5 shrink-0 rounded-full bg-danger" />;
};

export const ImageReviewBanner = () => {
  const t = useTranslations("imageReview");
  const count = useActiveReviewImages().filter(isBlockingImage).length;
  if (count === 0) return null;

  return (
    <div className="body-6 flex items-center gap-2 rounded-xl bg-danger-bg px-4 py-3 text-danger">
      <StatusError className="size-4 shrink-0" aria-hidden="true" />
      <p className="break-keep">{t("banner", { count })}</p>
    </div>
  );
};

/** 이미지 칸의 테두리 */
export const REVIEW_RING_CLASS: Record<ReviewImage["status"], string> = {
  REJECTED: "ring-2 ring-danger",
  ADULT_SETTING_REQUIRED: "ring-2 ring-warning",
  PENDING: "",
};

const MARK_TONE_CLASS: Record<ReviewImage["status"], string> = {
  REJECTED: "bg-danger text-overlay-font",
  ADULT_SETTING_REQUIRED: "bg-warning text-overlay-font",
  PENDING: "bg-scrim/80 text-overlay-font backdrop-blur-sm",
};

/** 이미지 위의 상태 라벨. 에셋 썸네일은 아래 띠(strip), 큰 칸은 왼쪽 위 알약(pill). */
export const ImageReviewMark = ({
  image,
  variant,
}: {
  image: ReviewImage;
  variant: "strip" | "pill";
}) => {
  const t = useTranslations("imageReview");

  return (
    <span
      className={cn(
        "title-7 pointer-events-none absolute z-10 whitespace-nowrap",
        variant === "strip"
          ? "inset-x-0 bottom-0 py-0.5 text-center"
          : "left-2 top-2 rounded-full px-2 py-0.5",
        MARK_TONE_CLASS[image.status],
      )}
    >
      {t(`badge.${image.status}`)}
    </span>
  );
};

/** 칸 아래의 사유와 버튼. 검수 중이면 기다리면 되므로 그리지 않는다. */
export const SlotReviewNotice = ({
  image,
  onReplace,
  className,
}: {
  image: ReviewImage;
  onReplace: () => void;
  className?: string;
}) => {
  const t = useTranslations("imageReview");
  const { openSettings } = useContext(ImageReviewContext);
  if (!isBlockingImage(image)) return null;
  const isAdult = image.status === "ADULT_SETTING_REQUIRED";

  return (
    <ImageReviewNotice
      tone={isAdult ? "warning" : "danger"}
      message={t(`reasons.${getImageReasonKey(image)}`)}
      action={
        isAdult
          ? { label: t("adultSetting"), onClick: openSettings }
          : { label: t("replace"), onClick: onReplace }
      }
      appealFileId={image.appealable && !image.appealed ? image.fileId : null}
      className={className}
    />
  );
};
