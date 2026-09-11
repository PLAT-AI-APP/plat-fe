"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { Product } from "@/type/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";

/** plat-fe는 웹 클라이언트만 서빙하므로 플랫폼은 항상 WEB으로 고정합니다. */
const CLIENT_PLATFORM = "WEB";

const getProducts = async () => {
  // X-Client-Platform은 서버가 CORS 허용 헤더 목록에 올려두지 않아 preflight가 막힌다.
  // 서버도 이 헤더를 선택값(required=false)으로 받고 platform 쿼리파라미터로 이미 같은
  // 정보를 보내므로, 헤더 없이도 요청은 그대로 성립한다.
  const response = await authAxios.get<Product[]>("/products", {
    params: { platform: CLIENT_PLATFORM },
  });

  return response.data;
};

/** 결제 상품 목록 조회 */
export const useProductsQuery = () => {
  const authReady = useAuthReady();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Product[], AppError>({
    queryKey: ["get-products"],
    queryFn: getProducts,
    // 상품 구성은 자주 바뀌지 않아 재조회 주기를 길게 둡니다.
    staleTime: 1000 * 60 * 10,
    enabled: authReady && !!accessToken,
  });
};
