"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";

/** 메인 최상단 캐러셀 한 장. 문구는 없고 이미지와 이동 링크만 내려옵니다. */
export interface HomeBanner {
  mainBannerId: string;
  imageUrl: string;
  linkUrl: string | null;
}

const getBanners = async () => {
  const response = await axiosInstance.get<HomeBanner[]>("/home/banners");

  return response.data;
};

/** 홈 메인 배너 목록 조회. 배열 순서가 곧 노출 순서입니다. */
export const useHomeBannersQuery = () => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);

  return useQuery<HomeBanner[], AppError>({
    queryKey: ["get-home-banners", locale],
    queryFn: getBanners,
    staleTime: 1000 * 60 * 5,
  });
};
