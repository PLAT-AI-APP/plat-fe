"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MAINTENANCE_PATH } from "@/api";
import { useMaintenanceStatusQuery } from "@/api/system/getMaintenanceStatus";
import { useMaintenanceTimeFormat } from "@/lib/maintenanceTime";

/**
 * 서버 점검 예고 띠. 운영자가 점검을 예약하면(NOTICE) 시작 시각을, 소프트 종료가 시작되면(DRAINING)
 * 새 채팅·결제를 지금 시작할 수 없다는 것을 알린다.
 *
 * 닫기 버튼을 두지 않는다. 결제나 긴 대화를 시작하기 전에 봐야 하는 안내이고, 점검이 지나면 저절로 사라진다.
 * 점검 중(CLOSED)에는 요청이 모두 막혀 axios 가 점검 화면으로 보내므로 여기서 다루지 않는다.
 */
const MaintenanceBanner = () => {
  const t = useTranslations("maintenanceBanner");
  const formatTime = useMaintenanceTimeFormat();
  const pathname = usePathname();
  const { data: status } = useMaintenanceStatusQuery();

  if (
    pathname === MAINTENANCE_PATH ||
    !status ||
    (status.phase !== "NOTICE" && status.phase !== "DRAINING") ||
    !status.drainStartsAt
  ) {
    return null;
  }

  const isDraining = status.phase === "DRAINING";
  const start = formatTime(status.drainStartsAt);
  const summary = isDraining
    ? t("draining")
    : status.expectedEndsAt
      ? t("noticeWithEnd", { start, end: formatTime(status.expectedEndsAt) })
      : t("notice", { start });

  return (
    <div
      role="status"
      aria-label={t("label")}
      className="body-6 mb-3 rounded-xl border border-warning/30 bg-warning-bg px-4 py-2 text-font-1"
    >
      <p className="min-w-0 break-keep">
        <span className="font-semibold text-warning">
          {t(isDraining ? "badgeDraining" : "badge")}
        </span>{" "}
        {summary}
        {status.message && (
          <span className="text-font-2"> {status.message}</span>
        )}
      </p>
    </div>
  );
};

export default MaintenanceBanner;
