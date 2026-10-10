"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAdultMode } from "@/hooks/data/useAdultAccess";
import { homeQueryKeys } from "./queryKeys";

/** 메인 최상단 캐러셀 한 장. 문구는 없고 이미지와 이동 링크만 내려옵니다. */
export interface HomeBanner {
  mainBannerId: string;
  imageUrl: string;
  linkUrl: string | null;
}

const getBanners = async (authenticated: boolean) => {
  // 성인 세계관으로 가는 배너를 섞을지 서버가 토큰으로 판단하므로, 로그인했으면 토큰을 싣는다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<HomeBanner[]>("/home/banners");

  return response.data;
};

/** 홈 메인 배너 목록 조회. 배열 순서가 곧 노출 순서입니다. */
export const useHomeBannersQuery = () => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  const authenticated = useAuthReady();
  const adultMode = useAdultMode();

  return useQuery<HomeBanner[], AppError>({
    queryKey: homeQueryKeys.banners(locale, adultMode),
    queryFn: () => getBanners(authenticated),
  });
};
