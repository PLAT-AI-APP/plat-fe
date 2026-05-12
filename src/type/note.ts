/** 노트 사용내역 item 타입정의 */
export interface UsageHistoryItemType {
  type: "USE" | "PURCHASE" | "REFUND" | "EVENT" | "ADMIN_GRANT" | "EXPIRE";
  transactionId: number;
  transactionHash: string;
  amount: number;
  balanceAfter: number;
  description: string;
  detailDescription: string;
  relatedCharacterName: string;
  createdAt: string;
}
