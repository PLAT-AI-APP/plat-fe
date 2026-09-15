/** 지갑 관련 캐시 키의 단일 출처. */
export const walletQueryKeys = {
  balance: () => ["get-wallet-balance"] as const,
};
