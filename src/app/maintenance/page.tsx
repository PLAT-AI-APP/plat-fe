"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import StateScene from "@/components/state/StateScene";
import ButtonLink from "@/components/ui/ButtonLink";
import { useMaintenanceStatusQuery } from "@/api/system/getMaintenanceStatus";
import { useMaintenanceTimeFormat } from "@/lib/maintenanceTime";
import { toSafeReturnPath } from "@/lib/safePath";

/** env 로 켠 점검(배포 단위)은 서버 점검 예약과 따로 돈다. 이때는 "끝났어요"를 보이면 안 된다. */
const IS_ENV_MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "on";


/**
 * 점검 안내.
 *
 * 두 경로로 온다.
 * - 배포 env(`NEXT_PUBLIC_MAINTENANCE_MODE=on`) 이면 src/proxy.ts 가 모든 화면 요청을 여기로 돌린다.
 * - 서버 점검 예약으로 요청이 503 SERVICE_MAINTENANCE 를 받으면 axios 가 여기로 보낸다(`?from=` 원래 화면).
 *
 * 서버 점검이면 15초마다 상태를 다시 읽어, 운영자가 점검을 끝내면 원래 화면으로 돌아갈 버튼을 띄운다.
 */
const MaintenanceNotice = () => {
  const t = useTranslations("errorPage");
  const formatTime = useMaintenanceTimeFormat();
  const searchParams = useSearchParams();
  const { data: status } = useMaintenanceStatusQuery({
    refetchInterval: 15_000,
  });

  const returnPath = toSafeReturnPath(searchParams.get("from"));
  const isOver = !IS_ENV_MAINTENANCE && status?.phase === "OPEN";

  if (isOver) {
    return (
      <StateScene
        mood="wave"
        title={t("maintenanceOverTitle")}
        description={t("maintenanceOverDescription")}
        actions={
          <ButtonLink href={returnPath} size="lg" fullWidth>
            {t("maintenanceBack")}
          </ButtonLink>
        }
      />
    );
  }

  const isDraining = status?.phase === "DRAINING";
  const details = [
    status?.message,
    status?.expectedEndsAt &&
      t("maintenanceExpectedEnd", { time: formatTime(status.expectedEndsAt) }),
  ].filter(Boolean);

  return (
    <StateScene
      mood="dizzy"
      title={t(isDraining ? "maintenanceDrainingTitle" : "maintenanceTitle")}
      description={t(
        isDraining ? "maintenanceDrainingDescription" : "maintenanceDescription",
      )}
      actions={
        details.length > 0 && (
          <div className="body-5 rounded-xl bg-card-hover px-4 py-3 text-font-1 break-keep">
            {details.map((line) => (
              <p key={line as string}>{line}</p>
            ))}
          </div>
        )
      }
    />
  );
};

const MaintenancePage = () => (
  <section className="flex flex-1 flex-col items-center justify-center py-16">
    <Suspense>
      <MaintenanceNotice />
    </Suspense>
  </section>
);

export default MaintenancePage;
