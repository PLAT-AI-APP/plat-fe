"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
// import { ArrowDown } from "@/icons"; // [차단 관리] 후순위로 보류
import {
  useAgreementStatusQuery,
  useMarketingAgreementMutation,
} from "@/api/agreement/agreements";
import { showAppToast } from "@/lib/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useDialogStore } from "@/store/useDialogStore";
import SettingLanguageSelect from "./SettingLanguageSelect";
import SettingRow from "./SettingRow";
import SettingSection from "./SettingSection";
import Switch from "@/components/ui/Switch";

const subscribeToNothing = () => () => {};

/**
 * 하이드레이션이 끝났는지 여부.
 * 서버 렌더 시점에는 저장된 테마를 알 수 없어 next-themes의 resolvedTheme이
 * undefined다. 그대로 스위치에 넘기면 첫 프레임이 항상 다크로 그려졌다가 튄다.
 */
const useIsHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

const SettingsContents = () => {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const isLightMode = useIsHydrated() && resolvedTheme === "light";

  const { data: agreementStatus } = useAgreementStatusQuery();
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: changeMarketing, isPending: isChangingMarketing } =
    useMarketingAgreementMutation();
  const handleMarketingChange = (agreed: boolean) =>
    changeMarketing(agreed, {
      // 광고성 정보 수신 동의·철회는 처리 결과(일자·내용)를 알려야 한다.
      onSuccess: () =>
        openDialog("AGREEMENT_RESULT", {
          processedAt: new Date().toISOString(),
          items: [{ type: "marketing", agreed, withdrawn: !agreed }],
        }),
      onError: () =>
        showAppToast("error", t("settings.actions.marketingFailed")),
    });

  const handleThemeChange = (checked: boolean) => {
    // 스위치 checked 값을 실제 next-themes 테마 값으로 변환합니다.
    setTheme(checked ? "light" : "dark");
  };

  return (
    <section className="flex min-h-full w-full justify-center bg-dark">
      <div className="flex w-[592px] max-w-full flex-col gap-6 pt-6">
        <header className="flex w-full items-center py-4">
          <h1 className="heading-2 text-font-1">{t("settings.title")}</h1>
        </header>

        <div className="flex w-full flex-col gap-5">
          <SettingSection title={t("settings.sections.environment")}>
            <SettingRow title={t("settings.rows.theme")}>
              <Switch
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
              {/* [차단 관리] 후순위로 보류: 이 섹션에는 차단 관리 한 줄뿐이라 섹션째 뺀다.
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
              */}

              <hr className="w-full border-main" />

              {/* 광고성 정보 수신 동의는 언제든 철회할 수 있어야 한다(정보통신망법 제50조). */}
              <SettingSection title={t("settings.sections.consent")}>
                <SettingRow title={t("settings.rows.marketing")}>
                  <Switch
                    checked={!!agreementStatus?.marketingAgreed}
                    label={t("settings.rows.marketing")}
                    onChange={handleMarketingChange}
                    themeIcon={false}
                    disabled={!agreementStatus || isChangingMarketing}
                  />
                </SettingRow>
              </SettingSection>

              <hr className="w-full border-main" />

              <Link
                href="/withdrawal"
                className="body-4 flex w-full items-center py-3 text-font-2 underline underline-offset-2"
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
