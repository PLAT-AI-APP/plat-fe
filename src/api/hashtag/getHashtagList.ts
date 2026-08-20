import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { API_LANG_BY_APP_LOCALE } from "@/i18n/config";
import { useLocaleStore } from "@/store/useLocaleStore";

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
  isAdult: boolean;
}

export interface GetHashtagListResponse {
  lang: string;
  isAdult: boolean;
  tags: Hashtag[];
}

const getHashtagList = async (lang: string) => {
  const response = await authAxios.get<GetHashtagListResponse>(`/hashtag/list`, {
    params: {
      lang,
    },
  });

  return response.data;
};

/** 해시태그 목록 조회 */
export const useHashtagListQuery = (enabled = true) => {
  const locale = useLocaleStore((state) => state.locale);
  const lang = API_LANG_BY_APP_LOCALE[locale];

  return useQuery<GetHashtagListResponse, AppError>({
    queryKey: ["get-hashtag-list", lang],
    queryFn: () => getHashtagList(lang),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
