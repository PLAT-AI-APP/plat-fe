"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ArrowDown } from "@/icons";
import { useAuthStore } from "@/store/useAuthStore";
import SettingLanguageSelect from "./SettingLanguageSelect";
import SettingRow from "./SettingRow";
import SettingSection from "./SettingSection";
import SettingToggle from "./SettingToggle";

const SettingsContents = () => {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLightMode = resolvedTheme === "light";

  const handleThemeChange = (checked: boolean) => {
    // 스위치 checked 값을 실제 next-themes 테마 값으로 변환합니다.
    setTheme(checked ? "light" : "dark");
  };

  return (
    <section className="flex min-h-full w-full justify-center bg-dark px-6">
      <div className="flex w-[592px] max-w-full flex-col gap-6 pt-[30px]">
        <header className="flex w-full items-center py-4">
          <h1 className="heading-2 text-font-1">{t("settings.title")}</h1>
        </header>

        <div className="flex w-full flex-col gap-5">
          <SettingSection title={t("settings.sections.environment")}>
            <SettingRow title={t("settings.rows.theme")}>
              <SettingToggle
                checked={isLightMode}
                label={t("settings.rows.theme")}
                onChange={handleThemeChange}
              />
            </SettingRow>

            <SettingRow title={t("settings.rows.language")}>
              <SettingLanguageSelect />
            </SettingRow>
          </SettingSection>

          {/* 비회원 설정 화면은 피그마 기준으로 환경설정만 노출하고, 계정 전용 항목은 숨깁니다. */}
          {isLoggedIn && (
            <>
              <hr className="w-full border-main" />

              <SettingSection title={t("settings.sections.notifications")}>
                <SettingRow title={t("settings.rows.blockedUsers")}>
                  <button
                    type="button"
                    aria-label={t("settings.actions.goToBlockedUsers")}
                    className="flex size-[18px] items-center justify-center text-font-2 transition-colors hover:text-font-1"
                  >
                    <ArrowDown className="size-[18px] -rotate-90" />
                  </button>
                </SettingRow>
              </SettingSection>

              <hr className="w-full border-main" />

              <Link
                href="/withdrawal"
                className="body-3 flex w-full items-center py-3 text-font-2 underline underline-offset-2"
              >
                {t("settings.actions.withdrawal")}
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SettingsContents;
