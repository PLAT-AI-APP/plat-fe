"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { WalletBalance } from "@/type/wallet";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { walletQueryKeys } from "./queryKeys";

const GetWalletBalance = async () => {
  const response = await authAxios.get<WalletBalance>("/wallet/balance");

  return response.data;
};

/** 지갑 잔액 조회 */
export const useWalletBalanceQuery = () => {
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setBalance = useWalletStore((state) => state.setBalance);

  const query = useQuery<WalletBalance, AppError>({
    queryKey: walletQueryKeys.balance(),
    queryFn: GetWalletBalance,
    enabled: authReady && !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      setBalance(query.data);
    }
  }, [query.data, setBalance]);

  return query;
};
