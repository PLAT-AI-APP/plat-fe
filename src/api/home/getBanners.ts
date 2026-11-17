"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios, axiosInstance } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { useAdultMode } from "@/hooks/data/useAdultAccess";
import { homeQueryKeys } from "./queryKeys";

/**
 * 배너를 그리는 틀. 지금은 이벤트형 하나이고, 캐릭터 소개형이 생기면 값이 늘어난다.
 * 모르는 값이 와도 화면은 이벤트형으로 그린다.
 */
export type BannerTemplateType = "EVENT";

/** 메인 최상단 캐러셀 한 장. 배경 이미지 위에 templateType 의 배치로 문구를 얹습니다. */
export interface HomeBanner {
  mainBannerId: string;
  templateType: BannerTemplateType;
  title: string;
  description: string | null;
  /** 제목 위 뱃지 라벨. 색은 라벨에서 만든다(lib/badgeColor). */
  badges: string[];
  /** 설명 아래 태그. # 없이 온다. */
  tags: string[];
  /** 배경 이미지. 줄이지 않은 원본 크기 webp(sc10). */
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
