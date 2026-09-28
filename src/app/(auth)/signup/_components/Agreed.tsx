"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/schema/auth.schema";

// Icons
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import CheckboxFill from "@/icons/CheckboxFill";
import { ArrowRight } from "@/icons";
import { LEGAL_LINKS } from "@/constants/legal";

const AGREEMENT_ITEMS = [
  {
    id: "isTermsAgreed",
    titleKey: "termsOfService",
    link: LEGAL_LINKS.terms,
  },
  {
    id: "isPrivacyAgreed",
    titleKey: "privacyPolicy",
    link: LEGAL_LINKS.privacy,
  },
  {
    id: "isAgeAgreed",
    titleKey: "ageOver14",
    link: LEGAL_LINKS.ageOver14,
  },
  // 선택 동의. 따로 문서가 없어 링크를 두지 않는다.
  {
    id: "isMarketingAgreed",
    titleKey: "marketing",
    link: null,
  },
] as const;

type AgreementField = (typeof AGREEMENT_ITEMS)[number]["id"];

const Agreed = () => {
  const t = useTranslations("auth.signup");
  const { control, setValue } = useFormContext<AuthFormValues>();

  const isTermsAgreed = useWatch({ control, name: "isTermsAgreed" });
  const isPrivacyAgreed = useWatch({ control, name: "isPrivacyAgreed" });
  const isAgeAgreed = useWatch({ control, name: "isAgeAgreed" });
  const isMarketingAgreed = useWatch({ control, name: "isMarketingAgreed" });

  const agreementValues: Record<AgreementField, boolean | undefined> = {
    isTermsAgreed,
    isPrivacyAgreed,
    isAgeAgreed,
    isMarketingAgreed,
  };

  // 전체 동의는 선택 항목까지 켠다. 선택만 끄고 싶으면 그 줄을 다시 누르면 된다.
  const isAllAgree = AGREEMENT_ITEMS.every(({ id }) => agreementValues[id]);

  const toggleIsAllAgree = () => {
    const nextState = !isAllAgree;
    AGREEMENT_ITEMS.forEach(({ id }) =>
      setValue(id, nextState, { shouldValidate: true }),
    );
  };

  const toggleItem = (name: AgreementField) => {
    setValue(name, !agreementValues[name], { shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-3 px-3">
      <article
        className="flex items-center gap-2 cursor-pointer group"
        onClick={toggleIsAllAgree}
      >
        <div className="flex items-center justify-center h-6 w-6">
          {isAllAgree ? (
            <CheckboxFill className="text-brand" />
          ) : (
            <CheckboxEmpty />
          )}
        </div>
        <span className="text-font-1 body-3">{t("agreeAll")}</span>
      </article>

      <hr className="border-main" />

      <ul id="agreement-list" className="flex flex-col gap-4">
        {AGREEMENT_ITEMS.map(({ id, titleKey, link }) => {
          const checked = agreementValues[id];

          return (
            <li
              key={id}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleItem(id)}
            >
              <div className="flex gap-2 items-center">
                <div className="flex items-center justify-center h-6 w-6">
                  {checked ? <Checkbox /> : <CheckboxEmpty />}
                </div>
                <span className="body-5">{t(titleKey)}</span>
              </div>

              {link && (
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowRight className="h-3 w-3 text-font-2" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default React.memo(Agreed);
