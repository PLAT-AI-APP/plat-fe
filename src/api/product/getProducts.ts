"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import type { Product } from "@/type/product";

/** plat-fe는 웹 클라이언트만 서빙하므로 플랫폼은 항상 WEB으로 고정합니다. */
const CLIENT_PLATFORM = "WEB";

// 백엔드 /products는 로그인 여부와 무관하게 조회를 허용합니다(SecurityPath.AUTHENTICATED_LIST 미포함).
const getProducts = async () => {
  const response = await axiosInstance.get<Product[]>("/products", {
    params: { platform: CLIENT_PLATFORM },
    headers: { "X-Client-Platform": CLIENT_PLATFORM },
  });

  return response.data;
};

/** 결제 상품 목록 조회. 비로그인 사용자도 둘러볼 수 있어야 하므로 로그인 여부와 무관하게 조회합니다. */
export const useProductsQuery = () => {
  return useQuery<Product[], AppError>({
    queryKey: ["get-products"],
    queryFn: getProducts,
    // 상품 구성은 자주 바뀌지 않아 재조회 주기를 길게 둡니다.
    staleTime: 1000 * 60 * 10,
  });
};
