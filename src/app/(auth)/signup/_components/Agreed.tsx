"use client";

import React from "react";
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
    title: "이용약관 동의 (필수)",
  },
  {
    id: "isPrivacyAgreed",
    title: "개인정보 처리방침 (필수)",
  },
] as const;

const Agreed = () => {
  const { control, setValue } = useFormContext<AuthFormValues>();

  // 상태 및 데이터: 약관 동의 여부 감시
  const isTermsAgreed = useWatch({ control, name: "isTermsAgreed" });
  const isPrivacyAgreed = useWatch({ control, name: "isPrivacyAgreed" });

  // 데이터: 모든 필수 약관 동의 여부 계산
  const isAllAgree = !!(isTermsAgreed && isPrivacyAgreed);

  // 로직: 전체 동의 토글 함수
  const toggleIsAllAgree = () => {
    const nextState = !isAllAgree;
    setValue("isTermsAgreed", nextState, { shouldValidate: true });
    setValue("isPrivacyAgreed", nextState, { shouldValidate: true });
  };

  // 로직: 개별 항목 토글 함수
  const toggleItem = (name: "isTermsAgreed" | "isPrivacyAgreed") => {
    const currentValue =
      name === "isTermsAgreed" ? isTermsAgreed : isPrivacyAgreed;
    setValue(name, !currentValue, { shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-3 px-3">
      {/* 전체 약관 동의 영역 */}
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

      {/* 개별 약관 리스트 영역 */}
      <ul id="agreement-list" className="flex flex-col gap-4">
        {AGREEMENT_ITEMS.map(({ id, title }) => {
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

              <button
                type="button"
                className="p-0.5 rounded-lg hover:bg-btn-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  // 약관 상세 보기 로직이 필요하다면 여기에 추가
                }}
              >
                <ArrowRight className="h-3 w-3 text-font-2" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default React.memo(Agreed);
