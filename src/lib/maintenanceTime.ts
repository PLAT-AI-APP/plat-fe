import { useLocaleStore } from "@/store/useLocaleStore";
import { INTL_LOCALE_BY_APP_LOCALE } from "@/i18n/config";

/**
 * 점검 시각을 사용자 시간대로 짧게 쓴다. 예: "10월 2일 오전 02:00".
 * 서버는 UTC 로 주고, 점검 안내는 연도가 없어도 헷갈리지 않는다.
 */
export const useMaintenanceTimeFormat = () => {
  const locale = useLocaleStore((state) => state.locale);
  const formatter = new Intl.DateTimeFormat(INTL_LOCALE_BY_APP_LOCALE[locale], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (iso: string) => formatter.format(new Date(iso));
};
