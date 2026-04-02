import React, { useState, useCallback } from "react";
import PersonaAddModal from "../PersonaAddModal";

const PersonaFooter = () => {
  const [isAddModal, setIsModal] = useState(false);
  const toggleIsAddModal = useCallback(() => {
    setIsModal((prev) => !prev);
  }, []);

  return (
    <footer className="pt-9 font-medium">
      <p className="text-sm text-font-2 text-center">
        페르소나는 최대 5개까지 만들 수 있어요.
      </p>
      <button
        onClick={toggleIsAddModal}
        type="button"
        className="mt-3 py-3 w-full rounded-xl bg-bg-darkest border border-border-main hover:bg-btn-hover transition-colors"
      >
        페르소나 추가
      </button>
      {isAddModal && <PersonaAddModal toggleIsAddModal={toggleIsAddModal} />}
      {/* 추가 모달이 켜졌을 때 배경 차단 레이어 */}
      {isAddModal && (
        <div
          className="fixed inset-0 z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // 클릭 이벤트가 아래로 전파되는 것을 완벽히 차단
          }}
        />
      )}
    </footer>
  );
};

export default React.memo(PersonaFooter);
