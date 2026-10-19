import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import type { AppError } from "@/type/api";

/**
 * 관리자 콘솔에서 바꾸는 사이트 설정(사업자 정보·고객센터).
 * 문자열 칸이 빈 문자열이면 표시하지 않는다는 뜻이다.
 */
export interface SiteSettings {
  companyName: string;
  representative: string;
  businessNumber: string;
  mailOrderNumber: string;
  address: string;
  phone: string;
  email: string;
  supportHours: string;
  privacyOfficer: string;
  privacyOfficerContact: string;
}

export const siteSettingsQueryKey = ["system", "site-settings"] as const;

const getSiteSettings = async () => {
  const response = await axiosInstance.get<SiteSettings>(
    "/system/site-settings",
  );

  return response.data;
};

/**
 * 사이트 설정. 로그인 없이 부른다.
 *
 * 자주 바뀌지 않아 10분 동안 다시 받지 않는다. 실패해도 화면을 막지 않는다 —
 * 푸터가 번역 문구·상수로 대신 그린다.
 */
export const useSiteSettingsQuery = () =>
  useQuery<SiteSettings, AppError>({
    queryKey: siteSettingsQueryKey,
    queryFn: getSiteSettings,
    staleTime: 10 * 60_000,
    retry: false,
    meta: { silent: true },
  });
