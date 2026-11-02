import type { ReviewImage } from "@/type/card";

/** 화면이 번역하는 반려 사유. 나머지 코드는 fallback 문구로 보인다. */
const IMAGE_REASON_CODES = [
  "IMAGE_EXPLICIT_SEXUAL",
  "IMAGE_MINOR_SEXUAL",
  "IMAGE_GRAPHIC_VIOLENCE",
  "MANUAL_REJECTION",
] as const;

export type ImageReasonKey =
  | (typeof IMAGE_REASON_CODES)[number]
  | "ADULT_SETTING_REQUIRED"
  | "fallback";

/** imageReview.reasons 아래의 번역 키. 검수 중이면 상태 라벨로 충분해 사유를 따로 쓰지 않는다. */
export const getImageReasonKey = (
  image: Pick<ReviewImage, "status" | "reasonCode">,
): ImageReasonKey | null => {
  if (image.status === "PENDING") return null;
  if (image.status === "ADULT_SETTING_REQUIRED") return "ADULT_SETTING_REQUIRED";
  return IMAGE_REASON_CODES.find((code) => code === image.reasonCode) ?? "fallback";
};

/** 반려·성인 설정 필요처럼 사용자가 고쳐야 공개되는 상태 */
export const isBlockingImage = (image: Pick<ReviewImage, "status">) =>
  image.status !== "PENDING";

/** 수정 화면이 열 탭과 칸을 가리키는 값(reviewFocus 쿼리) */
export const getReviewFocus = (image: Pick<ReviewImage, "usage" | "fileId">) => {
  if (image.usage === "UNIVERSE_PROFILE") return "profile";
  if (image.usage === "CHARACTER_PROFILE") return "character";
  return `asset:${image.fileId}`;
};

export const withReviewFocus = (href: string, focus: string) =>
  `${href}${href.includes("?") ? "&" : "?"}reviewFocus=${encodeURIComponent(focus)}`;

/** 수정 화면 에셋 항목의 id. reviewFocus 로 그 칸을 찾아 스크롤한다. */
export const getAssetReviewElementId = (fileId: string | number) => `asset-review-${fileId}`;
