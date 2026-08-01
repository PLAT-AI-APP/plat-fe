/** 지갑 잔액 응답 */
export interface WalletBalance {
  balance: number;
  lockedBalance: number;
  availableBalance: number;
}
