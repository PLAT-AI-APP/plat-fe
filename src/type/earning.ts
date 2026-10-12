import type { SliceWith } from "@/type/api";

/** 수익 포인트 원장 유형. 문구는 화면이 유형으로 만든다. */
export type EarningLedgerType =
  | "ACCRUE"
  | "REDEEM"
  | "REDEEM_CANCEL"
  | "EXPIRE"
  | "WITHDRAW_FORFEIT"
  | "ADMIN_DEDUCT"
  | "ADMIN_GRANT";

/** 교환 종류. 상품권은 받는 번호가 필요하고, 노트는 원하는 만큼 바로 전환된다. */
export type RewardType = "GIFT_CARD" | "NOTE";

/** GRANTING 은 노트 지급 대기. 화면에는 드러내지 않는다. */
export type RewardRedemptionStatus =
  "REQUESTED" | "GRANTING" | "ISSUED" | "REJECTED";

/** 제작자 등급. DUST~GALAXY 는 직접 승급하는 사다리, ORIGIN 은 관리자가 지정하는 공식 크리에이터. */
export type CreatorTierCode =
  "NONE" | "DUST" | "COMET" | "PLANET" | "NOVA" | "GALAXY" | "ORIGIN";

/**
 * 수익 요약. 교환 가능 포인트(1P = 1원), 보류 중 포인트(등급 보류 기간이 안 지난 적립분), 현재 등급,
 * 노트 1개당 전환 포인트, 상품권 교환에 필요한 본인인증 여부.
 */
export interface EarningSummary {
  available: number;
  pending: number;
  tier: CreatorTierCode;
  noteUnitPrice: number;
  identityVerified: boolean;
}

export interface TierBenefit {
  label: string;
  value: string;
}

/** 사다리 등급 하나. 비율은 bps(1100 = 11%), achievedAt 은 그 등급에 오른 마지막 시각. */
export interface CreatorTierInfo {
  code: Exclude<CreatorTierCode, "NONE" | "ORIGIN">;
  sortOrder: number;
  minPublicUniverses: number;
  minPaidTurns: number;
  minFollowers: number;
  shareBps: number;
  boostBps: number;
  holdDays: number;
  giftNotes: number;
  benefits: TierBenefit[];
  achievedAt: string | null;
}

/** 제작자 등급 화면. baseShareBps·baseHoldDays 는 등급이 없을 때의 값. */
export interface CreatorTierStatus {
  currentTier: CreatorTierCode;
  locked: boolean;
  celebrationPending: boolean;
  canPromote: boolean;
  publicUniverses: number;
  paidTurns: number;
  followers: number;
  baseShareBps: number;
  baseHoldDays: number;
  tiers: CreatorTierInfo[];
}

/** 승급 결과. giftNotes 는 처음 오른 등급이면 지급한 축하 노트. */
export interface TierPromotionResult {
  from: CreatorTierCode;
  to: CreatorTierCode;
  giftNotes: number;
}

export interface EarningLedgerItem {
  ledgerId: string;
  type: EarningLedgerType;
  amount: number;
  balanceAfter: number;
  /** 교환·반려 환불이면 교환 종류·상품명·전환 노트·현재 상태·반려 사유 */
  rewardType: RewardType | null;
  productName: string | null;
  noteAmount: number | null;
  redemptionStatus: RewardRedemptionStatus | null;
  rejectReason: string | null;
  createdAt: string;
}

/** 교환 상품(상품권) */
export interface RewardProduct {
  productId: string;
  name: string;
  imageUrl: string | null;
  pointPrice: number;
}

export interface RewardRedemption {
  redemptionId: string;
  productName: string;
  type: RewardType;
  pointAmount: number;
  noteAmount: number | null;
  status: RewardRedemptionStatus;
  requestedAt: string;
  processedAt: string | null;
  rejectReason: string | null;
}

export type EarningLedgerListResponse = SliceWith<EarningLedgerItem>;

export interface RedeemGiftCardRequest {
  productId: string;
  recipientPhone: string;
}

export interface NoteConversionRequest {
  notes: number;
}
