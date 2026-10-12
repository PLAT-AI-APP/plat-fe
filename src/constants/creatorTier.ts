import type { CreatorTierCode } from "@/type/earning";

/** 뱃지가 있는 제작자 등급. 등급이 없으면(NONE) 뱃지 대신 '@' 를 쓴다. */
export type BadgeTierCode = Exclude<CreatorTierCode, "NONE">;

/** 제작자 등급 뱃지. 등급은 고정이라 화면 상수로 둔다. */
export const CREATOR_TIER_BADGE: Record<BadgeTierCode, string> = {
  DUST: "/images/creator-tier/1-dust.svg",
  COMET: "/images/creator-tier/2-comet.svg",
  PLANET: "/images/creator-tier/3-planet.svg",
  NOVA: "/images/creator-tier/4-nova.svg",
  GALAXY: "/images/creator-tier/5-galaxy.svg",
  ORIGIN: "/images/creator-tier/6-origin.svg",
};
