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

/** 뱃지 코드. 글자는 home.bannerBadge 번역, 색은 constants/bannerBadge 가 정한다. */
export type BannerBadge = "EVENT" | "NOTICE" | "NEW" | "UPDATE" | "HOT";

/** 메인 최상단 캐러셀 한 장. 배경 이미지 위에 전경 이미지와 templateType 의 배치로 문구를 얹습니다. */
export interface HomeBanner {
  bannerId: string;
  templateType: BannerTemplateType;
  title: string;
  description: string | null;
  /** 제목 위 뱃지 코드. 모르는 코드는 화면이 건너뛴다. */
  badges: BannerBadge[];
  /** 설명 아래 태그. # 없이 온다. */
  tags: string[];
  /** 넓게 까는 배경 이미지. 줄이지 않은 원본 크기 webp(sc10). */
  backgroundImageUrl: string;
  /** 배경 위 오른쪽에 얹어 강조하는 이미지(투명 배경 webp, sc10). 없으면 배경만 그린다. */
  foregroundImageUrl: string | null;
  linkUrl: string | null;
}

const getBanners = async (authenticated: boolean) => {
  // 성인 세계관으로 가는 배너를 섞을지 서버가 토큰으로 판단하므로, 로그인했으면 토큰을 싣는다.
  const client = authenticated ? authAxios : axiosInstance;
  const response = await client.get<{ banners: HomeBanner[] }>("/home/banners");

  return response.data.banners;
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
