"use client";

import React, { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AuthFormValues } from "@/type/auth";

// Icons
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import CheckboxFill from "@/icons/CheckboxFill";
import { ArrowRight } from "@/icons";

const Agreed = () => {
  const { control, setValue } = useFormContext<AuthFormValues>();

  // 개별 약관 상태
  const isTermsAgreed = useWatch({ control, name: "isTermsAgreed" });
  const isPrivacyAgreed = useWatch({ control, name: "isPrivacyAgreed" });

  const isAllAgree = !!(isTermsAgreed && isPrivacyAgreed);

  /** 전체 동의 토글 함수 */
  const toggleIsAllAgree = () => {
    const nextState = !isAllAgree;
    // setValue를 호출하면 useWatch가 이를 감지하여 컴포넌트를 리렌더링합니다.
    setValue("isTermsAgreed", nextState);
    setValue("isPrivacyAgreed", nextState);
  };

  /** 개별 약관 토글 함수 */
  const toggleItem = (name: "isTermsAgreed" | "isPrivacyAgreed") => {
    const currentValue =
      name === "isTermsAgreed" ? isTermsAgreed : isPrivacyAgreed;
    setValue(name, !currentValue);
  };

  // 렌더링용 데이터 배열
  const agreementList = [
    {
      id: "isTermsAgreed",
      title: "이용약관 동의 (필수)",
      checked: isTermsAgreed,
    },
    {
      id: "isPrivacyAgreed",
      title: "개인정보 처리방침 (필수)",
      checked: isPrivacyAgreed,
    },
  ] as const;

  return (
    <section className="flex flex-col gap-3 px-3">
      {/* 전체 약관 동의 */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={toggleIsAllAgree}
      >
        <button type="button" aria-label="전체 동의">
          {isAllAgree ? <CheckboxFill className="text-white" /> : <Checkbox />}
        </button>
        <span className="text-font-1">약관 전체 동의</span>
      </div>

      <hr className="border-border-main" />

      {/* 개별 약관 리스트 */}
      <div className="flex flex-col gap-4">
        {agreementList.map(({ checked, id, title }) => (
          <div
            key={id}
            className="flex justify-between items-center"
            onClick={() => toggleItem(id)}
          >
            <div className="flex gap-2 items-center">
              <button type="button" aria-label={title}>
                {checked ? <Checkbox /> : <CheckboxEmpty />}
              </button>
              <span className="text-sm">{title}</span>
            </div>

            <button
              type="button"
              className="p-0.5 rounded-lg hover:bg-btn-hover"
            >
              <ArrowRight className="h-3 w-3 text-font-2" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Agreed);
