"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Product } from "@/type/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocaleStore } from "@/store/useLocaleStore";

/** 상품 번호가 이미 플랫폼을 특정하므로 단건 조회는 platform을 보내지 않습니다. */
const getProductDetail = async (productId: string) => {
  const response = await authAxios.get<Product>(`/products/${productId}`);

  return response.data;
};

/** 결제 상품 단건 조회 */
export const useProductDetailQuery = (productId?: string) => {
  const locale = useLocaleStore((state) => state.locale);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  return useQuery<Product, AppError>({
    queryKey: ["get-product-detail", productId, locale],
    queryFn: () => getProductDetail(productId ?? ""),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(productId) && isAuthReady && isLoggedIn,
  });
};
