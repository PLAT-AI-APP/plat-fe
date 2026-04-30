import React from "react";
import PersonaAddModal from "../PersonaAddModal";
import useToggle from "@/hooks/useToggle";

const PersonaFooter = () => {
  const personaAddModal = useToggle();

  return (
    <footer className="pt-9 font-medium">
      <p className="text-sm text-font-2 text-center">
        페르소나는 최대 5개까지 만들 수 있어요.
      </p>

      <button
        onClick={personaAddModal.toggle}
        type="button"
        className="mt-3 py-3 w-full rounded-xl bg-bg-darkest border border-border-main hover:bg-btn-hover transition-colors"
      >
        페르소나 추가
      </button>

      {personaAddModal.isOpen && (
        <PersonaAddModal toggleIsAddModal={personaAddModal.toggle} />
      )}
    </footer>
  );
};

export default React.memo(PersonaFooter);
