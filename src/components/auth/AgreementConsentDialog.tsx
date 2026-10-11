"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { AgreementType } from "@/api/agreement/agreements";
import Button from "@/components/ui/Button";
import { LEGAL_LINKS } from "@/constants/legal";
import { ArrowRight } from "@/icons";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import type { AgreementResultItem } from "@/type/dialog";

type RequiredType = Exclude<AgreementType, "MARKETING">;

export type AgreementChecks = Partial<Record<AgreementType, boolean>>;

export const AGREEMENT_RESULT_TYPE: Record<AgreementType, AgreementResultItem["type"]> = {
  TERMS_OF_SERVICE: "termsOfService",
  PRIVACY_POLICY: "privacyPolicy",
  AGE_OVER_14: "ageOver14",
  MARKETING: "marketing",
};

const ITEMS: Record<RequiredType, { labelKey: string; link: string }> = {
  TERMS_OF_SERVICE: { labelKey: "termsOfService", link: LEGAL_LINKS.terms },
  PRIVACY_POLICY: { labelKey: "privacyPolicy", link: LEGAL_LINKS.privacy },
  AGE_OVER_14: { labelKey: "ageOver14", link: LEGAL_LINKS.ageOver14 },
};

interface AgreementConsentDialogProps {
  /** 처음 받는 동의(가입 마무리)인지, 약관 개정 뒤 다시 받는 동의인지. 제목·설명이 갈린다. */
  firstConsent: boolean;
  /** 받아야 하는 필수 동의. 마케팅(선택)은 첫 동의일 때만 함께 묻는다. */
  required: RequiredType[];
  isSubmitting: boolean;
  onSubmit: (checked: AgreementChecks, types: AgreementType[]) => void;
  /** 동의하지 않고 나가는 길(로그아웃·가입 취소). */
  secondaryLabel: string;
  isSecondaryPending?: boolean;
  onSecondary: () => void;
}

/**
 * 약관 동의 창. 소셜 가입 마무리(계정은 동의해야 생긴다)와 약관 개정 재동의가 같은 모양을 쓴다.
 *
 * 모달 스토어를 쓰지 않는다 — 화면 이동·모달 정리가 이 화면을 닫으면 동의 없이 서비스를 쓰게 된다.
 * 닫기 버튼도 없다. 동의하거나 보조 버튼(로그아웃·가입 취소)으로 나가는 두 길만 둔다.
 */
const AgreementConsentDialog = ({
  firstConsent,
  required,
  isSubmitting,
  onSubmit,
  secondaryLabel,
  isSecondaryPending = false,
  onSecondary,
}: AgreementConsentDialogProps) => {
  const t = useTranslations("auth");
  const [checked, setChecked] = useState<AgreementChecks>({});

  // 뒤 화면이 스크롤되지 않게 막는다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const types: AgreementType[] = [
    ...required,
    ...(firstConsent ? (["MARKETING"] as const) : []),
  ];
  const requiredDone = required.every((type) => checked[type]);
  const allChecked = types.every((type) => checked[type]);

  const toggle = (type: AgreementType) =>
    setChecked((prev) => ({ ...prev, [type]: !prev[type] }));
  const toggleAll = () =>
    setChecked(Object.fromEntries(types.map((type) => [type, !allChecked])));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agreement-gate-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
    >
      <section className="flex w-full max-w-[420px] flex-col gap-5 rounded-2xl bg-card p-6">
        <header className="flex flex-col gap-2">
          <h2 id="agreement-gate-title" className="title-5 text-font-1">
            {t(firstConsent ? "agreementGate.firstTitle" : "agreementGate.revisedTitle")}
          </h2>
          <p className="body-5 text-font-2">
            {t(
              firstConsent
                ? "agreementGate.firstDescription"
                : "agreementGate.revisedDescription",
            )}
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {types.length > 1 && (
            <>
              <button
                type="button"
                onClick={toggleAll}
                className="flex cursor-pointer items-center gap-2 text-left"
              >
                {allChecked ? <Checkbox /> : <CheckboxEmpty />}
                <span className="body-3 text-font-1">
                  {t("signup.agreeAll")}
                </span>
              </button>
              <hr className="border-main" />
            </>
          )}

          <ul className="flex flex-col gap-3">
            {types.map((type) => {
              const item = type === "MARKETING" ? null : ITEMS[type];
              return (
                <li
                  key={type}
                  className="flex items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    onClick={() => toggle(type)}
                    aria-pressed={!!checked[type]}
                    className="flex cursor-pointer items-center gap-2 text-left"
                  >
                    {checked[type] ? <Checkbox /> : <CheckboxEmpty />}
                    <span className="body-5 text-font-1">
                      {t(`signup.${item ? item.labelKey : "marketing"}`)}
                    </span>
                  </button>
                  {item && (
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`signup.${item.labelKey}`)}
                    >
                      <ArrowRight className="h-3 w-3 text-font-2" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!requiredDone || isSubmitting}
            isPending={isSubmitting}
            onClick={() => onSubmit(checked, types)}
          >
            {t("agreementGate.submit")}
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            disabled={isSecondaryPending || isSubmitting}
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        </footer>
      </section>
    </div>
  );
};

export default AgreementConsentDialog;
