import React from "react";
import { useModalStore } from "@/store/useModalStore";
import { cn } from "@/lib/utils";

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
          "mt-3 py-3 w-full title-3 rounded-xl bg-brand/10 text-brand-dark",
          isMaxPersona && "bg-card text-font-2",
        )}
      >
        페르소나 추가
      </button>
    </footer>
  );
};

export default React.memo(PersonaFooter);
