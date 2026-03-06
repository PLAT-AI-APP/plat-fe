"use client";
import { Global } from "@/icons";
import React, { useState } from "react";
import { ModalLayout } from "../ModalLayout";

const LanguageSelector = () => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const [currentLanguage, setCurrentLanguage] = useState<string>("KR");
  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    setIsActive(false);
  };

  const LanguageArray = [
    { code: "KR", name: "한국어", eng: "Korean" },
    { code: "EN", name: "English", eng: "English" },
    { code: "JP", name: "日本語", eng: "Japanese" },
    { code: "CN", name: "中文", eng: "Chinese" },
    { code: "TH", name: "ภาษาไทย", eng: "Thailand" },
    { code: "VN", name: "Tiếng Việt", eng: "Vietnamese" },
  ];
  return (
    <div className="relative flex justify-between w-15.25">
      <div
        onClick={() => setIsActive(!isActive)}
        className="flex cursor-pointer items-center gap-1 bg-btn-hover rounded-lg p-1.25 pr-2.5"
      >
        <Global className="text-font-2" />
        <span className="text-font-2 text-sm">{currentLanguage}</span>
      </div>

      {isActive && (
        <ModalLayout
          onClose={() => setIsActive(!isActive)}
          className="translate-y-2 top-full right-0 w-50 px-2 py-3"
        >
          {LanguageArray.map((lang) => (
            <div
              key={lang.code}
              className={`${currentLanguage === lang.code && "bg-(--brand-opacity) text-(--brand)"}
              cursor-pointer rounded-lg px-2.5 py-2 flex justify-between
              hover:bg-btn-hover
              `}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className="flex gap-1 text-sm items-center">
                {lang.name}
                <span className="text-xs text-font-2">{lang.eng}</span>
              </div>
              {/* 추후 체크표시 자리 */}
              {/* {currentLanguage === lang.code && (
                <div className="w-4 h-4 rounded-full bg-(--brand)"></div>
              )} */}
            </div>
          ))}
        </ModalLayout>
      )}
    </div>
  );
};

export default LanguageSelector;
