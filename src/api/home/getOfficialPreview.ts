"use client";

import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Tendency, useTendencyStore } from "@/store/useTendencyStore";

export interface OfficialPreviewScenario {
  episodeNo: number;
  title: string;
  content: string;
}

export interface OfficialPreviewItem {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  tags: string[];
  chatCount: number;
  remainingFreeChatCount: number;
  scenarios: OfficialPreviewScenario[];
}

/** 대화량순 / 찜순. 서버가 universes 의 누적 카운터로 줄 세웁니다. */
export type OfficialSort = "CHAT" | "LIKE";

interface GetOfficialPreviewParams {
  tendency?: Tendency;
  sort?: OfficialSort;
  page?: number;
  size?: number;
}

const getOfficialPreview = async ({
  page = 0,
  size = 10,
  tendency = "ALL",
  sort = "CHAT",
}: GetOfficialPreviewParams) => {
  const response = await authAxios.get<OfficialPreviewItem[]>(
    "/home/official-preview",
    {
      params: {
        tendency,
        sort,
        page,
        size,
      },
    },
  );

  return response.data;
};

/*
 * MVP 에서 화면을 내린 섹션이라 지금은 부르는 곳이 없다. 서버도 같은 이유로 경로를 떼어 뒀으므로
 * 지금 부르면 404 다 — 공식 탭은 /ranking?scope=OFFICIAL 로 옮겼다.
 */
/** 홈 화면 공식 캐릭터 미리보기 목록 조회 */
export const useOfficialPreviewQuery = (
  params: GetOfficialPreviewParams = {},
) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  // 성향이 바뀌면 목록도 달라지므로 캐시를 분리합니다.
  const tendency = useTendencyStore((state) => state.tendency);

  return useQuery<OfficialPreviewItem[], AppError>({
    queryKey: [
      "get-official-preview",
      locale,
      tendency,
      params.sort,
      params.page,
      params.size,
    ],
    queryFn: () => getOfficialPreview({ ...params, tendency }),
  });
};
