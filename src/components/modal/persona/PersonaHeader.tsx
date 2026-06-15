import React from "react";
import { useTranslations } from "next-intl";
import { Persona, Close } from "@/icons";

interface PersonaHeaderProps {
  onClose: () => void;
}

const PersonaHeader = ({ onClose }: PersonaHeaderProps) => {
  const t = useTranslations("modalUi.personaList");
  const commonT = useTranslations("modalUi.common");

  return (
    <header className="pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Persona className="h-6 w-6" />
          <h2 className="title-1">{t("title")}</h2>
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label={commonT("close")}
          className="h-5.5 w-5.5 rounded-lg p-1 hover:bg-btn-hover"
        >
          <Close className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="body-4 pt-2 text-font-2">{t("description")}</p>
    </header>
  );
};

export default PersonaHeader;
