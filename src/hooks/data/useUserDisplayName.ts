"use client";

import { useTranslations } from "next-intl";
import { useUserStore } from "@/store/useUserStore";

/** {{user}} 자리에 채워 넣을 표시용 이름. 닉네임이 없으면 일반 대체 문구로 대신합니다. */
export const useUserDisplayName = () => {
  const t = useTranslations();
  const nickname = useUserStore((state) => state.user?.nickname);

  return nickname || t("profile.defaultName");
};
