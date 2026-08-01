"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { WalletBalance } from "@/type/wallet";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";

const GetWalletBalance = async () => {
  const response = await authAxios.get<WalletBalance>("/wallet/balance");

  return response.data;
};

/** 지갑 잔액 조회 */
export const useWalletBalanceQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setBalance = useWalletStore((state) => state.setBalance);

  const query = useQuery<WalletBalance, AppError>({
    queryKey: ["get-wallet-balance"],
    queryFn: GetWalletBalance,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthReady && isLoggedIn && !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      setBalance(query.data);
    }
  }, [query.data, setBalance]);

  return query;
};
