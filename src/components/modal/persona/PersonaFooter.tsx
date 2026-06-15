import React from "react";
import { useTranslations } from "next-intl";
import { useModalStore } from "@/store/useModalStore";
import { cn } from "@/lib/utils";
import { Plus } from "@/icons";

interface PersonaFooterProps {
  isMaxPersona: boolean;
}

const PersonaFooter = ({ isMaxPersona }: PersonaFooterProps) => {
  const t = useTranslations("modalUi.personaList");
  const { openModal } = useModalStore();

  return (
    <footer className="pt-9">
      <p className="body-6 text-center text-font-2">{t("helper")}</p>

      <button
        onClick={() => !isMaxPersona && openModal("PERSONA_ADD")}
        type="button"
        className={cn(
          "group mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-card-hover bg-bg-dark py-3 title-3",
          isMaxPersona && "bg-card text-font-2",
          !isMaxPersona &&
            "hover:border-none hover:bg-brand/10 hover:text-brand-dark",
        )}
      >
        <Plus className="size-4.5 group-hover:text-brand-dark" />
        {t("add")}
      </button>
    </footer>
  );
};

export default React.memo(PersonaFooter);
