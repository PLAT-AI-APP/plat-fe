import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useAdultAccess } from "@/hooks/data/useAdultAccess";
import { hashtagQueryKeys } from "./queryKeys";

export type HashtagCategory =
  | "GENRE"
  | "BACKGROUND"
  | "RACE"
  | "CHARACTER"
  | "APPEARANCE"
  | "PERSONALITY"
  | "RELATIONSHIP"
  | "NARRATIVE"
  | "OCCUPATION"
  | "MOOD"
  | "SPECIAL";

export interface Hashtag {
  id: string;
  category: HashtagCategory;
  label: string;
  /** 성인 태그. 성인인증이 유효한 유저에게만 내려오고, 성인 세계관에만 붙일 수 있다. */
  isAdult: boolean;
}

export interface GetHashtagListResponse {
  lang: string;
  isAdult: boolean;
  tags: Hashtag[];
}

const getHashtagList = async () => {
  const response = await authAxios.get<GetHashtagListResponse>(`/hashtag/list`);

  return response.data;
};

/** 해시태그 목록 조회 */
export const useHashtagListQuery = (enabled = true) => {
  // 언어가 바뀌면 Accept-Language 헤더로 나가는 응답도 달라지므로 캐시 키에 반영합니다.
  const locale = useLocaleStore((state) => state.locale);
  const adultAccess = useAdultAccess();

  return useQuery<GetHashtagListResponse, AppError>({
    queryKey: hashtagQueryKeys.list(locale, adultAccess),
    queryFn: getHashtagList,
    enabled,
  });
};
