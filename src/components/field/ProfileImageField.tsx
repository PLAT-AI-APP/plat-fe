"use client";

import React, { ChangeEvent } from "react";
import ResourceImage from "@/components/ResourceImage";
import { useFormContext, useWatch } from "react-hook-form";
import { CameraFill } from "@/icons";
import { useTranslations } from "next-intl";
import { showAppToast } from "@/lib/toast";
import { ProfileEditFormType } from "@/schema/profile.schema";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import { getImageReasonKey } from "@/lib/imageReview";
import ImageReviewNotice, {
  type ImageReviewTone,
} from "@/components/review/ImageReviewNotice";

const REVIEW_TONE = {
  PENDING: "neutral",
  REJECTED: "danger",
  PROFILE_NOT_ALLOWED: "warning",
} as const satisfies Record<string, ImageReviewTone>;

const REVIEW_RING_CLASS: Record<ImageReviewTone, string> = {
  neutral: "",
  danger: "ring-2 ring-danger",
  warning: "ring-2 ring-warning",
};

// 제네릭 관련 타입 충돌을 방지하기 위해 이 컴포넌트가 제어할 대상 타입을 명시합니다.
interface ProfileImageFieldProps {
  name?: "profileImg"; // 혹은 keyof ProfileEditFormType
}

const ProfileImageField = ({ name = "profileImg" }: ProfileImageFieldProps) => {
  // useFormContext에 프로필 폼 타입을 주입하여 내부 setValue들의 타입 안정성을 확보합니다.
  const t = useTranslations();
  const { setValue, control } = useFormContext<ProfileEditFormType>();
  const profileImg = useWatch({ control, name });
  const profileImgFile = useWatch({ control, name: "profileImgFile" });
  const review = useUserStore((state) => state.user?.profileImageReview);
  // 새 이미지를 고르면 지금 이미지의 검수 결과는 더 이상 상관없다.
  const reviewStatus =
    review && review.status !== "APPROVED" && !profileImgFile
      ? review.status
      : null;
  const reviewTone = reviewStatus ? REVIEW_TONE[reviewStatus] : null;
  const reviewT = useTranslations("imageReview");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      return showAppToast("warning", t("toast.imageTypeInvalid"));
    }
    if (file.size > 5 * 1024 * 1024) {
      return showAppToast("warning", t("toast.imageSizeExceeded"));
    }

    // 파일 객체 저장 (ProfileEditFormType에 선언된 키값에 맞게 매핑)
    setValue("profileImgFile", file, { shouldValidate: true });

    // FileReader의 결과(string)를 타입 단언(as string)을 통해
    // ProfileEditFormType["profileImg"] 구조(string)와 일치시켜 할당합니다.
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValue(name, reader.result, {
          shouldValidate: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const renderReviewNotice = () => {
    if (!review || !reviewStatus || !reviewTone) return null;
    const replaceAction = {
      label: reviewT("replace"),
      onClick: () => document.getElementById("profile-image-select")?.click(),
    };
    if (reviewStatus === "PENDING") {
      return (
        <ImageReviewNotice
          tone="neutral"
          title={reviewT("profile.pendingTitle")}
          message={reviewT("profile.pendingDescription")}
          className="mt-3 mb-6"
        />
      );
    }

    return (
      <ImageReviewNotice
        tone={reviewTone}
        title={reviewT(
          reviewStatus === "REJECTED"
            ? "profile.rejectedTitle"
            : "profile.notAllowedTitle",
        )}
        message={
          reviewStatus === "REJECTED"
            ? reviewT(
                `reasons.${getImageReasonKey({ status: "REJECTED", reasonCode: review.reasonCode })}`,
              )
            : reviewT("profile.notAllowedDescription")
        }
        action={replaceAction}
        // 서버가 파일 ID 를 함께 줄 때만 이의 신청할 수 있다.
        appealFileId={review.appealable ? review.fileId : null}
        className="mt-3 mb-6"
      />
    );
  };

  return (
    <>
      <div id="profile-image-section" className="relative w-fit h-fit mx-auto">
        <input
          id="profile-image-select"
          onChange={handleImageChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          type="file"
        />
        <label htmlFor="profile-image-select" className="cursor-pointer">
          <ResourceImage
            src={(profileImg as string) || "/p1.png"}
            alt={t("profilePopover.profileImageAlt")}
            width={80}
            height={80}
            className={cn(
              "avatar-img w-20 h-20",
              reviewTone && REVIEW_RING_CLASS[reviewTone],
            )}
          />
          <span className="absolute bottom-0 right-0 bg-main flex items-center justify-center w-7.5 h-7.5 rounded-full">
            <CameraFill className="w-4.5 h-4.5" />
          </span>
        </label>
      </div>
      {renderReviewNotice()}
    </>
  );
};

export default ProfileImageField;
