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

/** 수익 요약. 교환 가능 포인트(1P = 1원)와 노트 1개당 전환 포인트. */
export interface EarningSummary {
  available: number;
  noteUnitPrice: number;
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
