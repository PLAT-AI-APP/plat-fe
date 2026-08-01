import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { WalletBalance } from "@/type/wallet";

const mockWalletBalance: WalletBalance = {
  balance: 1234,
  lockedBalance: 0,
  availableBalance: 1234,
};

export const walletHandlers = [
  http.get(endpoint("/wallet/balance"), () => {
    return HttpResponse.json(mockWalletBalance);
  }),
];
