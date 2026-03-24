"use client";
import { Global } from "@/icons";
import React, { useRef, useState } from "react";
import { ModalLayout } from "../ModalLayout";

const LanguageSelector = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const [currentLanguage, setCurrentLanguage] = useState<string>("KR");
  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    setIsActive(!isActive);
  };

  const LanguageArray = [
    { code: "KR", name: "한국어", eng: "Korean" },
    { code: "EN", name: "English", eng: "English" },
    { code: "JP", name: "日本語", eng: "Japanese" },
    { code: "CN", name: "中文", eng: "Chinese" },
    { code: "TH", name: "ภาษาไทย", eng: "Thailand" },
    { code: "VN", name: "Tiếng Việt", eng: "Vietnamese" },
  ];

  const triggerRef = useRef<HTMLButtonElement>(null); // 버튼을 위한 ref
  return (
    <div
      id="language-selector-wrapper"
      className="relative flex justify-between w-15.25"
    >
      <button
        id="language-selector-trigger"
        type="button"
        ref={triggerRef}
        onClick={() => setIsActive((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isActive}
        className="flex cursor-pointer items-center gap-1 bg-btn-hover rounded-lg p-1.25 pr-2.5 border-none outline-none"
      >
        <Global id="icon-global-lang" className="text-font-2" />
        <span id="current-lang-label" className="text-font-2 text-sm">
          {currentLanguage}
        </span>
      </button>

      {isActive && (
        <ModalLayout
          triggerRef={triggerRef || null}
          onClose={() => setIsActive(false)}
          className="translate-y-3.5 top-full right-0 w-50 px-2 py-3"
        >
          {/* 언어 선택 목록 */}
          <ul
            id="language-options-list"
            className="flex flex-col list-none p-0 m-0 gap-1"
          >
            {LanguageArray.map((lang) => (
              <li
                key={lang.code}
                id={`lang-option-${lang.code}`}
                role="option"
                aria-selected={currentLanguage === lang.code}
                className={`${currentLanguage === lang.code && "bg-brand-opacity text-brand"}
                cursor-pointer rounded-lg px-2.5 py-2 flex justify-between
                hover:bg-btn-hover
                `}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex gap-1 text-sm items-center pointer-events-none">
                  <span id={`lang-name-${lang.code}`}>{lang.name}</span>
                  <span
                    id={`lang-eng-${lang.code}`}
                    className="text-xs text-font-2"
                  >
                    {lang.eng}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </ModalLayout>
      )}
    </div>
  );
};

export default LanguageSelector;
