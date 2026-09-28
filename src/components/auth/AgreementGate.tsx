"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  type AgreementType,
  useAgreeMutation,
  useAgreementStatusQuery,
} from "@/api/agreement/agreements";
import { useLogoutMutation } from "@/api/auth/logout";
import Button from "@/components/ui/Button";
import { LEGAL_LINKS } from "@/constants/legal";
import { ArrowRight } from "@/icons";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { showAppToast } from "@/lib/toast";
import { useDialogStore } from "@/store/useDialogStore";
import type { AgreementResultItem } from "@/type/dialog";

type RequiredType = Exclude<AgreementType, "MARKETING">;

const RESULT_TYPE: Record<AgreementType, AgreementResultItem["type"]> = {
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

/**
 * 밀린 필수 동의를 받는 화면. 소셜 가입 직후(계정이 동의보다 먼저 생긴다)와 약관 개정 뒤에 뜬다.
 *
 * 모달 스토어를 쓰지 않는다 — 화면 이동·모달 정리가 이 화면을 닫으면 동의 없이 서비스를 쓰게 된다.
 * 닫기 버튼도 없다. 동의하거나 로그아웃하는 두 길만 둔다.
 */
const AgreementGate = () => {
  const t = useTranslations("auth");
  const { data: status } = useAgreementStatusQuery();
  const { mutate: agree, isPending: isAgreeing } = useAgreeMutation();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const [checked, setChecked] = useState<
    Partial<Record<AgreementType, boolean>>
  >({});

  const pending = status?.pending ?? [];
  const isOpen = pending.length > 0;

  // 뒤 화면이 스크롤되지 않게 막는다.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!status || !isOpen) return null;

  // 마케팅은 첫 동의(소셜 가입 마무리)에서만 함께 묻는다. 개정 재동의 때 다시 묻지 않는다.
  const types: AgreementType[] = [
    ...pending.map((item) => item.type),
    ...(status.firstConsent ? (["MARKETING"] as const) : []),
  ];
  const requiredDone = pending.every((item) => checked[item.type]);
  const allChecked = types.every((type) => checked[type]);

  const toggle = (type: AgreementType) =>
    setChecked((prev) => ({ ...prev, [type]: !prev[type] }));
  const toggleAll = () =>
    setChecked(Object.fromEntries(types.map((type) => [type, !allChecked])));

  const submit = () =>
    agree(
      {
        termsOfService: !!checked.TERMS_OF_SERVICE,
        privacyPolicy: !!checked.PRIVACY_POLICY,
        ageOver14: !!checked.AGE_OVER_14,
        ...(status.firstConsent && { marketing: !!checked.MARKETING }),
      },
      {
        // 무엇에 언제 동의했는지 바로 알린다. 창이 닫히기 전에 목록을 만들어 둔다.
        onSuccess: () =>
          openDialog("AGREEMENT_RESULT", {
            processedAt: new Date().toISOString(),
            items: types.map((type) => ({
              type: RESULT_TYPE[type],
              agreed: !!checked[type],
              version: versionOf(type),
            })),
          }),
        onError: () => showAppToast("error", t("agreementGate.failed")),
      },
    );

  const versionOf = (type: AgreementType) =>
    pending.find((item) => item.type === type)?.version;

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
            {t(
              status.firstConsent
                ? "agreementGate.firstTitle"
                : "agreementGate.revisedTitle",
            )}
          </h2>
          <p className="body-5 text-font-2">
            {t(
              status.firstConsent
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
              const version = versionOf(type);
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
                      {version && (
                        <span className="ml-1 text-font-2">
                          {t("agreementGate.version", { version })}
                        </span>
                      )}
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
            disabled={!requiredDone || isAgreeing}
            isPending={isAgreeing}
            onClick={submit}
          >
            {t("agreementGate.submit")}
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            disabled={isLoggingOut}
            onClick={() => logout()}
          >
            {t("agreementGate.logout")}
          </Button>
        </footer>
      </section>
    </div>
  );
};

export default AgreementGate;
