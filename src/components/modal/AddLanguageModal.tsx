import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ModalLayout } from "../ModalLayout";
import { Close, Global } from "@/icons";
import { LANGUAGE_LIST } from "@/constants/language";
import ActiveButton from "../ActiveButton";
import Check from "@/icons/Check";
import { cn } from "@/lib/utils";
import { AddLanguageModalProps } from "@/type/modal";

const AddLanguageModal = ({ onClose }: AddLanguageModalProps) => {
  const t = useTranslations("modalUi.addLanguage");
  const commonT = useTranslations("modalUi.common");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const toggleLanguage = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-screen max-w-[calc(100vw-40px)] sm:max-w-92.5 rounded-3xl border border-border-main p-5"
    >
      <header className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3 text-[20px] font-semibold">
          <Global className="h-6 w-6" /> {t("title")}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={commonT("close")}
          className="flex h-5.5 w-5.5 items-center justify-center rounded-lg p-1 hover:bg-btn-hover"
        >
          <Close className="h-3.5 w-3.5" />
        </button>
      </header>

      <ul className="mb-9 mt-6 flex flex-col gap-2.5">
        {LANGUAGE_LIST.map(({ code, eng, name }) => {
          const isSelected = selectedCodes.includes(code);

          return (
            <li
              key={code}
              onClick={() => toggleLanguage(code)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg p-2",
                !isSelected && "hover:bg-btn-hover",
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border border-font-disabled",
                  isSelected && "bg-font-1",
                )}
              >
                <Check className="h-3.5 w-3.5 text-font-disabled" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-1">
                <span className="text-sm whitespace-nowrap">{name}</span>
                <span className="text-xs text-font-2">{eng}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <ActiveButton
        isActive={selectedCodes.length > 0}
        text={t("confirm")}
        onClick={onClose}
        className="float-end h-11.5 min-w-25 px-5"
      />
    </ModalLayout>
  );
};

export default AddLanguageModal;
