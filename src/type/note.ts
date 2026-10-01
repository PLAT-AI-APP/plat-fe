export type WalletLedgerType =
  "CHARGE" | "USE" | "REFUND" | "EXPIRE" | "ADMIN_DEDUCT";

/** 지갑 장부 목록의 페이지 정보 */
export interface WalletLedgerPageInfo {
  number: number;
  size: number;
  numberOfElements: number;
  hasNext: boolean;
  first: boolean;
  last: boolean;
}

/** 지갑 장부 목록 응답 */
export interface WalletLedgerListResponse {
  page: WalletLedgerPageInfo;
  content: UsageHistoryItemType[];
}

/** 노트 사용내역 item 타입정의 */
export interface UsageHistoryItemType {
  ledgerId: string;
  amount: number;
  balanceAfter: number;
  type: WalletLedgerType;
  referenceType: string;
  referenceId: string;
  /** 사용자에게 보여도 되는 설명. 제목 매핑이 없는 항목의 제목, 그리고 상세설명으로 쓴다. */
  description: string;
  createdAt: string;
  /**
   * 이 지급분이 사라지는 때(ISO-8601 UTC). 충전·지급성 항목만 값이 있고 사용 항목은 null 이다.
   * 무료·관리자 지급은 기간이 결제와 다를 수 있어 서버 값을 그대로 쓴다(BE↔FE 계약 3번).
   */
  expiresAt?: string | null;
}
