"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { useResponseFormatsQuery } from "@/api/responseFormat/getResponseFormats";
import { cn } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";
import { CharacterCreateFormValues } from "@/schema/character.schema";

/** 형식을 고르지 않은 시나리오가 쓰는 형식. 서버도 같은 값을 쓴다. */
const DEFAULT_FORMAT = "NOVEL";

interface ScenarioResponseFormatFieldProps {
  scenarioIndex: number;
}

/**
 * 시나리오의 응답 형식(채팅형·소설형 등). 채팅방에서 고를 수 있는 형식(허용)과, 고르지 않았을 때 쓰는 형식(기본)을 정한다.
 * 노트는 쓴 토큰만큼 빠지므로 짧은 형식일수록 사용자가 적게 낸다. 형식 이름·설명은 운영이 정하는 값이라 서버가 준 대로 쓴다.
 */
const ScenarioResponseFormatField = ({ scenarioIndex }: ScenarioResponseFormatFieldProps) => {
  const t = useTranslations("characterCreate.scenario");
  const { control, setValue } = useFormContext<CharacterCreateFormValues>();
  const { data: formats = [] } = useResponseFormatsQuery();

  const allowedValue = useWatch({ control, name: `scenarios.${scenarioIndex}.allowedResponseFormats` });
  const defaultValue = useWatch({ control, name: `scenarios.${scenarioIndex}.defaultResponseFormat` });
  // 정하지 않은 시나리오는 소설형 하나만 허용한 것과 같다.
  const allowed = allowedValue && allowedValue.length > 0 ? allowedValue : [DEFAULT_FORMAT];
  const defaultFormat = defaultValue && allowed.includes(defaultValue) ? defaultValue : allowed[0];

  if (formats.length === 0) return null;

  const update = (nextAllowed: string[], nextDefault: string) => {
    // 서버가 노출 순서를 기준으로 보여 주므로 목록 순서로 맞춰 둔다.
    const ordered = formats.map((format) => format.code).filter((code) => nextAllowed.includes(code));
    setValue(`scenarios.${scenarioIndex}.allowedResponseFormats`, ordered, { shouldDirty: true });
    setValue(`scenarios.${scenarioIndex}.defaultResponseFormat`, nextDefault, { shouldDirty: true });
  };

  const toggleAllowed = (code: string) => {
    if (!allowed.includes(code)) {
      update([...allowed, code], defaultFormat);
      return;
    }
    if (allowed.length === 1) {
      showAppToast("warning", t("responseFormatMinAlert"));
      return;
    }
    const nextAllowed = allowed.filter((candidate) => candidate !== code);
    update(nextAllowed, code === defaultFormat ? nextAllowed[0] : defaultFormat);
  };

  const allowedFormats = formats.filter((format) => allowed.includes(format.code));
  const currentDefault = formats.find((format) => format.code === defaultFormat);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <span className="title-3">{t("responseFormatLabel")}</span>
        <p className="body-6 text-font-2">{t("responseFormatGuide")}</p>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("responseFormatLabel")}>
        {formats.map((format) => {
          const isAllowed = allowed.includes(format.code);

          return (
            <button
              key={format.code}
              type="button"
              aria-pressed={isAllowed}
              onClick={() => toggleAllowed(format.code)}
              className={cn(
                "body-5 flex h-8 items-center rounded-full px-3 transition-colors",
                isAllowed ? "bg-brand/10 text-brand-dark" : "bg-card text-font-2 hover:bg-card-hover",
              )}
            >
              {format.name}
            </button>
          );
        })}
      </div>

      {allowedFormats.length > 1 && (
        <div className="flex flex-col gap-1">
          <span className="body-5 text-font-1">{t("defaultResponseFormatLabel")}</span>
          <div role="radiogroup" aria-label={t("defaultResponseFormatLabel")} className="flex items-center gap-1 rounded-xl bg-darkest p-2">
            {allowedFormats.map((format) => {
              const isActive = format.code === defaultFormat;

              return (
                <button
                  key={format.code}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => update(allowed, format.code)}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-center transition-colors",
                    isActive ? "title-5 bg-brand-opacity text-brand-dark" : "body-5 text-font-disabled hover:text-font-2",
                  )}
                >
                  {format.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentDefault && <p className="body-6 text-font-2">{currentDefault.description}</p>}
    </div>
  );
};

export default ScenarioResponseFormatField;
