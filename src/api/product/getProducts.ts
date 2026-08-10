"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Product } from "@/type/product";
import { useAuthStore } from "@/store/useAuthStore";

const getProducts = async () => {
  const response = await authAxios.get<Product[]>("/products");

  return response.data;
};

/** 결제 상품 목록 조회 */
export const useProductsQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Product[], AppError>({
    queryKey: ["get-products"],
    queryFn: getProducts,
    // 상품 구성은 자주 바뀌지 않아 재조회 주기를 길게 둡니다.
    staleTime: 1000 * 60 * 10,
    enabled: isAuthReady && isLoggedIn && !!accessToken,
  });
};
