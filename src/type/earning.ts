import type { PageWith, SliceWith } from "@/type/api";

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

/** 노트 전환은 바로 ISSUED 로 남는다. REQUESTED 는 상품권 발송 대기. */
export type RewardRedemptionStatus = "REQUESTED" | "ISSUED" | "REJECTED";

/** 제작자 등급. DUST~GALAXY 는 직접 승급하는 사다리, ORIGIN 은 관리자가 지정하는 공식 크리에이터. */
export type CreatorTierCode =
  "NONE" | "DUST" | "COMET" | "PLANET" | "NOVA" | "GALAXY" | "ORIGIN";

/**
 * 수익 요약. 교환 가능 포인트(1P = 1원), 전환 대기(pending, 등급 보류 기간이 안 지난 적립분), 내일 정산 예정
 * (오늘 자정이 지나면 교환 가능해지는 보류분), 30일 안에 소멸될 포인트, 현재 등급, 노트 1개당 전환 포인트,
 * 상품권 교환에 필요한 본인인증 여부.
 */
export interface EarningSummary {
  available: number;
  pending: number;
  settleTomorrow: number;
  expiringSoon: number;
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

/** 관리자가 올린 등급의 연출. from 은 직전 등급, giftNotes 는 그 등급을 처음 얻었을 때의 축하 노트. */
export interface PendingTierCelebration {
  from: CreatorTierCode;
  giftNotes: number;
}

/** 제작자 등급 화면. baseShareBps·baseHoldDays 는 등급이 없을 때의 값, originShareBps 는 오리진 고정 비율. celebration 은 연출 대기가 없으면 null. */
export interface CreatorTierStatus {
  currentTier: CreatorTierCode;
  locked: boolean;
  celebration: PendingTierCelebration | null;
  canPromote: boolean;
  publicUniverses: number;
  paidTurns: number;
  followers: number;
  baseShareBps: number;
  baseHoldDays: number;
  originShareBps: number;
  tiers: CreatorTierInfo[];
}

/** 승급 결과. giftNotes 는 처음 오른 등급이면 지급한 축하 노트. */
export interface TierPromotionResult {
  from: CreatorTierCode;
  to: CreatorTierCode;
  giftNotes: number;
}

/** 전환 내역 한 줄(교환 · 소멸 · 운영 지급/차감). 교환이면 교환 번호 · 종류 · 상품명 · 전환 노트 · 현재 상태 · 반려 사유. */
export interface EarningLedgerItem {
  ledgerId: string;
  type: EarningLedgerType;
  amount: number;
  balanceAfter: number;
  redemptionNo: string | null;
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
  redemptionNo: string;
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

/** 상품권 받는 방법. 서버가 고를 수 있는 것만 내려준다(지금은 SMS 뿐). */
export type RewardDeliveryChannel = "SMS" | "EMAIL" | "KAKAO_ALIMTALK";

/** 받는 방법 선택지. 휴대폰으로 받는 방법은 본인인증 번호(가린 값)로 보낸다. */
export interface RewardDeliveryOptions {
  channels: RewardDeliveryChannel[];
  verifiedPhone: string | null;
  /** 신청 때 동의받는 상품권 발송 개인정보 수집·이용 동의서. 게시된 것이 없으면 null(신청 불가). */
  consent: { documentId: string; version: string; content: string } | null;
}

/** 교환 상세. 받는 곳은 가운데가 가려져 온다. 단계는 상태와 신청 · 처리 시각으로 그린다. */
export interface RedemptionDetail {
  redemptionNo: string;
  type: RewardType;
  productName: string;
  pointAmount: number;
  noteAmount: number | null;
  status: RewardRedemptionStatus;
  deliveryChannel: RewardDeliveryChannel | null;
  recipient: string | null;
  requestedAt: string;
  processedAt: string | null;
  rejectReason: string | null;
}

/** 수익 캘린더 하루. date 는 노트를 쓴 날(KST), settled 면 교환 가능 포인트로 바뀌었다. */
export interface EarningCalendarDay {
  date: string;
  points: number;
  settled: boolean;
  availableAt: string;
}

export interface EarningCalendar {
  month: string;
  total: number;
  days: EarningCalendarDay[];
}

/** 캐릭터 이름 · 썸네일. title 이 없으면 파기된 캐릭터, active 가 false 면 지워진 캐릭터. */
export interface EarningUniverseLabel {
  universeId: string;
  title: string | null;
  imageUrl: string | null;
  active: boolean;
}

/** 고른 날 캐릭터 한 줄. */
export interface EarningDayUniverse extends EarningUniverseLabel {
  points: number;
  paidTurns: number;
}

export interface EarningCalendarDayUniverses {
  items: EarningDayUniverse[];
  hasNext: boolean;
}

/** 캐릭터별 수익 표 정렬 기준. */
export type UniverseEarningSort = "YESTERDAY" | "WEEK" | "MONTH" | "TOTAL";

export interface EarningUniverseRow extends EarningUniverseLabel {
  yesterday: number;
  week: number;
  month: number;
  total: number;
  totalPaidTurns: number;
}

export type EarningUniverseListResponse = PageWith<EarningUniverseRow>;

export interface EarningUniverseSummary extends EarningUniverseLabel {
  week: number;
  month: number;
  total: number;
  totalPaidTurns: number;
}

export interface EarningUniverseDay {
  date: string;
  points: number;
  paidTurns: number;
  settled: boolean;
  availableAt: string;
}

export interface RedeemGiftCardRequest {
  productId: string;
  deliveryChannel: RewardDeliveryChannel;
  /** 이메일처럼 받는 곳을 적는 방법만. 휴대폰으로 받는 방법은 서버가 본인인증 번호를 쓴다. */
  recipient?: string;
  /** 동의한 상품권 발송 개인정보 수집·이용 동의서 ID. */
  consentDocumentId: string;
}

export interface NoteConversionRequest {
  notes: number;
}
