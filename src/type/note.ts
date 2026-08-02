export type WalletLedgerType =
  | "CHARGE"
  | "USE"
  | "REFUND"
  | "EVENT"
  | "ADMIN_GRANT"
  | "EXPIRE";

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
  description: string;
  createdAt: string;
}
