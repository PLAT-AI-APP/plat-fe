"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

export interface AssetPreviewItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  isNew: boolean;
  isOfficial: boolean;
  // 채팅수 뱃지 노출용. 백엔드 응답에 추후 추가될 예정이라 우선 옵셔널로 선언.
  chatCount?: number;
}

interface GetAssetPreviewParams {
  page?: number;
  size?: number;
}

const getAssetPreview = async ({
  lang,
  page = 0,
  size = 10,
}: GetAssetPreviewParams & { lang: string }) => {
  const response = await authAxios.get<AssetPreviewItem[]>(
    "/home/asset-preview",
    {
      params: {
        lang,
        page,
        size,
      },
    },
  );

  return response.data;
};

/** 홈 화면 상황 에셋이 많은 캐릭터 미리보기 목록 조회 */
export const useAssetPreviewQuery = (params: GetAssetPreviewParams = {}) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<AssetPreviewItem[], AppError>({
    queryKey: ["get-asset-preview", lang, params.page, params.size],
    queryFn: () => getAssetPreview({ lang, ...params }),
    staleTime: 1000 * 60 * 5,
  });
};
