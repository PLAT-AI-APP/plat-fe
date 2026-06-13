"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowDown } from "@/icons";
import SettingLanguageSelect from "./SettingLanguageSelect";
import SettingRow from "./SettingRow";
import SettingSection from "./SettingSection";
import SettingToggle from "./SettingToggle";

const SettingsContents = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isLightMode = resolvedTheme === "light";

  const handleThemeChange = (checked: boolean) => {
    // 스위치 checked 값을 실제 next-themes 테마 값으로 변환합니다.
    setTheme(checked ? "light" : "dark");
  };

  return (
    <section className="flex min-h-full w-full justify-center bg-bg-dark px-6">
      <div className="flex w-[592px] max-w-full flex-col gap-6 pt-[30px]">
        <header className="flex w-full items-center py-4">
          <h1 className="heading-2 text-font-1">설정</h1>
        </header>

        <div className="flex w-full flex-col gap-5">
          <SettingSection title="환경설정">
            <SettingRow title="화면모드">
              <SettingToggle
                checked={isLightMode}
                label="화면모드"
                onChange={handleThemeChange}
              />
            </SettingRow>

            <SettingRow title="선호언어">
              <SettingLanguageSelect />
            </SettingRow>
          </SettingSection>

          <hr className="w-full border-border-main" />

          <SettingSection title="알림 및 콘텐츠 관리">
            <SettingRow title="차단 관리">
              <button
                type="button"
                aria-label="차단 관리로 이동"
                className="flex size-[18px] items-center justify-center text-font-2 transition-colors hover:text-font-1"
              >
                <ArrowDown className="size-[18px] -rotate-90" />
              </button>
            </SettingRow>
          </SettingSection>

          <hr className="w-full border-border-main" />

          <Link
            href="/withdrawal"
            className="body-3 flex w-full items-center py-3 text-font-2 underline underline-offset-2"
          >
            회원탈퇴
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SettingsContents;
