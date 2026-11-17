import type { BannerBadge } from "@/api/home/getBanners";

/**
 * 배너 뱃지 바탕색(흰 글자). 관리자 미리보기(plat-admin-fe 의 BANNER_BADGES)와 같아야 화면이 같다.
 */
export const BANNER_BADGE_COLORS: Record<BannerBadge, string> = {
  EVENT: "oklch(0.58 0.19 25)",
  NOTICE: "oklch(0.5 0.02 260)",
  NEW: "oklch(0.58 0.15 150)",
  UPDATE: "oklch(0.56 0.16 255)",
  HOT: "oklch(0.6 0.18 50)",
};
