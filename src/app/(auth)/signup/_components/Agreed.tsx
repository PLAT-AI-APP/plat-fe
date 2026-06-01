"use client";

import React from "react";
import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/schema/auth.schema";

// Icons
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import CheckboxFill from "@/icons/CheckboxFill";
import { ArrowRight } from "@/icons";

const AGREEMENT_ITEMS = [
  {
    id: "isTermsAgreed",
    title: "서비스이용약관 동의 (필수)",
    link: "https://bloom-shawl-3f7.notion.site/PLAT-36f1c900ce3e8073805de6e7e8e6cfbf?source=copy_link",
  },
  {
    id: "isPrivacyAgreed",
    title: "개인정보 처리방침 (필수)",
    link: "https://bloom-shawl-3f7.notion.site/PLAT-3721c900ce3e800bac34c38d68e1a682?source=copy_link",
  },
  {
    id: "isAgeAgreed",
    title: "만 14세 이상입니다. (필수)",
    link: "https://bloom-shawl-3f7.notion.site/PLAT-3721c900ce3e80c3bb36c3e32a0f08b1?source=copy_link",
  },
] as const;

const Agreed = () => {
  const { control, setValue } = useFormContext<AuthFormValues>();

  const isTermsAgreed = useWatch({ control, name: "isTermsAgreed" });
  const isPrivacyAgreed = useWatch({ control, name: "isPrivacyAgreed" });

  const isAllAgree = !!(isTermsAgreed && isPrivacyAgreed);

  const toggleIsAllAgree = () => {
    const nextState = !isAllAgree;
    setValue("isTermsAgreed", nextState, { shouldValidate: true });
    setValue("isPrivacyAgreed", nextState, { shouldValidate: true });
  };

  const toggleItem = (
    name: "isTermsAgreed" | "isPrivacyAgreed" | "isAgeAgreed",
  ) => {
    const currentValue =
      name === "isTermsAgreed" ? isTermsAgreed : isPrivacyAgreed;
    setValue(name, !currentValue, { shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-3 px-3">
      <article
        className="flex items-center gap-2 cursor-pointer group"
        onClick={toggleIsAllAgree}
      >
        <div className="flex items-center justify-center h-6 w-6">
          {isAllAgree ? (
            <CheckboxFill className="text-red-white" />
          ) : (
            <CheckboxEmpty />
          )}
        </div>
        <span className="text-font-1 body-2">약관 전체 동의</span>
      </article>

      <hr className="border-border-main" />

      <ul id="agreement-list" className="flex flex-col gap-4">
        {AGREEMENT_ITEMS.map(({ id, title, link }) => {
          const checked =
            id === "isTermsAgreed" ? isTermsAgreed : isPrivacyAgreed;
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
                <span className="body-4">{title}</span>
              </div>

              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowRight className="h-3 w-3 text-font-2" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default React.memo(Agreed);
