import React from "react";
import { useTranslations } from "next-intl";
import { Persona, Close } from "@/icons";
import IconButton from "@/components/ui/IconButton";

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
        <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
          <Close className="size-3.5" />
        </IconButton>
      </div>
      <p className="body-5 pt-2 text-font-2">{t("description")}</p>
    </header>
  );
};

export default PersonaHeader;
