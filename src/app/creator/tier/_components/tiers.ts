import type {
  CreatorTierCode,
  CreatorTierInfo,
  TierBenefit,
} from "@/type/earning";
import { CREATOR_TIER_BADGE } from "@/constants/creatorTier";

/**
 * 제작자 등급 화면 모델. 등급 자체(이름·뱃지·색)는 고정이라 화면 상수로 두고, 조건·비율·혜택·달성일은 서버 값을 쓴다.
 * 승급 조건은 세 지표를 모두 채우는 것이고, 한 단계씩 직접 신청해 올라간다.
 */
export type LadderCode = Exclude<CreatorTierCode, "NONE" | "ORIGIN">;
export type TierCode = CreatorTierCode;

export const LADDER: LadderCode[] = [
  "DUST",
  "COMET",
  "PLANET",
  "NOVA",
  "GALAXY",
];

/** 등급 색은 뱃지와 카드 뒤 은은한 빛·승급 연출에만 쓴다. */
const VISUAL: Record<TierCode, { color: string; badge: string | null }> = {
  // 등급 없음은 뱃지가 없다.
  NONE: { color: "#8590A6", badge: null },
  DUST: { color: "#8590A6", badge: CREATOR_TIER_BADGE.DUST },
  COMET: { color: "#19B26B", badge: CREATOR_TIER_BADGE.COMET },
  PLANET: { color: "#2E6FF0", badge: CREATOR_TIER_BADGE.PLANET },
  NOVA: { color: "#7C44F5", badge: CREATOR_TIER_BADGE.NOVA },
  GALAXY: { color: "#FF7A00", badge: CREATOR_TIER_BADGE.GALAXY },
  ORIGIN: { color: "#A98BFF", badge: CREATOR_TIER_BADGE.ORIGIN },
};

export interface Tier {
  code: TierCode;
  name: string;
  color: string;
  badge: string | null;
  /** 수익률(%) */
  rate: number;
  /** 신작 부스트(%), 공개 후 30일 */
  boost: number;
  holdDays: number;
  /** 최초 승급 때 한 번 주는 노트 */
  giftNotes: number;
  publicCharacters: number;
  paidChats: number;
  followers: number;
  benefits: TierBenefit[];
  achievedAt: string | null;
  /** 오리진(공식 크리에이터). 사다리 밖이고 운영진 지정·계약으로만 된다. */
  official?: boolean;
}

export const bpsToPercent = (bps: number) => bps / 100;

/**
 * 등급 없음. 사다리 앞에 두어, 등급이 없을 때의 수익률(정책 기본)·보류 기간을 보여 준다.
 * 신작 부스트는 등급이 있어야 붙으므로 없다(서버 AccrualTerms 와 같다).
 */
export const toNone = (
  name: string,
  shareBps: number,
  holdDays: number,
): Tier => ({
  code: "NONE",
  name,
  ...VISUAL.NONE,
  rate: bpsToPercent(shareBps),
  boost: 0,
  holdDays,
  giftNotes: 0,
  publicCharacters: 0,
  paidChats: 0,
  followers: 0,
  benefits: [],
  achievedAt: null,
});

export const toTier = (info: CreatorTierInfo, name: string): Tier => ({
  code: info.code,
  name,
  ...VISUAL[info.code],
  rate: bpsToPercent(info.shareBps),
  boost: bpsToPercent(info.boostBps),
  holdDays: info.holdDays,
  giftNotes: info.giftNotes,
  publicCharacters: info.minPublicUniverses,
  paidChats: info.minPaidTurns,
  followers: info.minFollowers,
  benefits: info.benefits,
  achievedAt: info.achievedAt,
});

/** 오리진은 사다리 밖이라 신작 부스트 없는 고정 비율이고, 보류는 최고 등급(갤럭시)과 같다. */
export const toOrigin = (
  galaxy: Tier,
  name: string,
  shareBps: number,
): Tier => ({
  ...galaxy,
  code: "ORIGIN",
  name,
  ...VISUAL.ORIGIN,
  rate: bpsToPercent(shareBps),
  boost: 0,
  giftNotes: 0,
  achievedAt: null,
  official: true,
});

export interface CreatorStats {
  publicCharacters: number;
  paidChats: number;
  followers: number;
}

export const meetsTier = (stats: CreatorStats, tier: Tier) =>
  stats.publicCharacters >= tier.publicCharacters &&
  stats.paidChats >= tier.paidChats &&
  stats.followers >= tier.followers;

/** 52만, 523K 처럼 짧게 */
export const formatCount = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);

/** 혜택 한 줄. key 가 같으면 등급을 넘길 때 같은 자리의 값이 비교된다. */
export interface BenefitLine {
  key: string;
  label: string;
  value: string;
}

export interface BenefitLabels {
  rate: string;
  boost: string;
  hold: (days: number) => string;
  holdLabel: string;
  giftLabel: string;
  gift: (count: number) => string;
}

/** 수익률·신작 부스트·보류·축하 노트 다음에 관리자가 정한 그 밖의 혜택을 순서대로. */
export const benefitLinesOf = (
  tier: Tier,
  labels: BenefitLabels,
): BenefitLine[] => {
  const lines: BenefitLine[] = [
    { key: "rate", label: labels.rate, value: `${tier.rate}%` },
  ];
  // 오리진은 부스트 없는 고정 비율, 등급 없음은 부스트가 없어 줄을 두지 않는다.
  if (!tier.official && tier.code !== "NONE") {
    lines.push({ key: "boost", label: labels.boost, value: `+${tier.boost}%` });
  }
  lines.push({
    key: "hold",
    label: labels.holdLabel,
    value: labels.hold(tier.holdDays),
  });
  if (tier.giftNotes > 0) {
    lines.push({
      key: "gift",
      label: labels.giftLabel,
      value: labels.gift(tier.giftNotes),
    });
  }
  tier.benefits.forEach((benefit) =>
    lines.push({
      key: `benefit:${benefit.label}`,
      label: benefit.label,
      value: benefit.value,
    }),
  );
  return lines;
};
