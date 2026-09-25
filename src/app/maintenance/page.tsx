"use client";

import { useTranslations } from "next-intl";
import StateScene from "@/components/state/StateScene";

/** 점검 안내. 점검 모드일 때 src/proxy.ts 가 모든 화면 요청을 여기로 돌린다. */
const MaintenancePage = () => {
  const t = useTranslations("errorPage");

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-16">
      <StateScene
        mood="dizzy"
        title={t("maintenanceTitle")}
        description={t("maintenanceDescription")}
      />
    </section>
  );
};

export default MaintenancePage;
