import React from "react";

interface PersonaFooterProps {
  toggleIsAddModal?: () => void;
}

const PersonaFooter = ({ toggleIsAddModal }: PersonaFooterProps) => {
  return (
    <footer className="pt-9 font-medium">
      <p className="text-sm text-font-2 text-center">
        페르소나는 최대 5개까지 만들 수 있어요.
      </p>
      <button
        onClick={toggleIsAddModal}
        className="mt-3 py-3 w-full rounded-xl bg-bg-darkest border border-border-main hover:bg-btn-hover transition-colors"
      >
        페르소나 추가
      </button>
    </footer>
  );
};

export default PersonaFooter;
