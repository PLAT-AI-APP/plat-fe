import { create } from "zustand";
import type { WalletBalance } from "@/type/wallet";

interface WalletState {
  balance: WalletBalance | null;
  setBalance: (balance: WalletBalance) => void;
  clearBalance: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,

  // 서버에서 받은 최신 지갑 잔액을 전역에서 공유합니다.
  setBalance: (balance) => set({ balance }),

  // 로그아웃 또는 회원탈퇴 시 잔액 노출을 초기화합니다.
  clearBalance: () => set({ balance: null }),
}));
