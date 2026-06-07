import React from "react";
import { useModalStore } from "@/store/useModalStore";
import { cn } from "@/lib/utils";
import { Plus } from "@/icons";

interface PersonaFooterProps {
  isMaxPersona: boolean;
}
const PersonaFooter = ({ isMaxPersona }: PersonaFooterProps) => {
  const { openModal } = useModalStore();

  return (
    <footer className="pt-9">
      <p className="body-6 text-font-2 text-center">
        페르소나는 최대 5개까지 만들 수 있어요.
      </p>

      <button
        onClick={() => !isMaxPersona && openModal("PERSONA_ADD")}
        type="button"
        className={cn(
          "group flex items-center justify-center gap-2 mt-3 py-3 w-full h-12 title-3 rounded-xl bg-bg-dark border border-card-hover",
          isMaxPersona && "bg-card text-font-2",
          "hover:bg-brand/10 hover:text-brand-dark hover:border-none",
        )}
      >
        <Plus className="size-4.5 text-font-2 group-hover:text-brand-dark" />
        페르소나 추가
      </button>
    </footer>
  );
};

export default React.memo(PersonaFooter);
