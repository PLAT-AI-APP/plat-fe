import React from "react";
import { useModalStore } from "@/store/useModalStore";

const PersonaFooter = () => {
  const { openModal } = useModalStore();

  return (
    <footer className="pt-9 font-medium">
      <p className="text-sm text-font-2 text-center">
        페르소나는 최대 5개까지 만들 수 있어요.
      </p>

      <button
        onClick={() => openModal("PERSONA_ADD")}
        type="button"
        className="mt-3 py-3 w-full rounded-xl bg-bg-darkest border border-border-main hover:bg-btn-hover transition-colors"
      >
        페르소나 추가
      </button>
    </footer>
  );
};

export default React.memo(PersonaFooter);
