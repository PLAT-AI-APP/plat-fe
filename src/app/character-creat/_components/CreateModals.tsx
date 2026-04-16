"use client";

import React from "react";
import Dialog from "@/components/Dialog";

type ModalType = "OVERWRITE" | "RESUME" | "UNSAVED" | null;

interface CreateModalsProps {
  activeModal: ModalType;
  closeModal: () => void;
  handleConfirmExit: () => void;
  rejectNavigation: () => void;
}

const CreateModals = ({
  activeModal,
  closeModal,
  handleConfirmExit,
  rejectNavigation,
}: CreateModalsProps) => {
  return (
    <>
      {activeModal === "UNSAVED" && (
        <Dialog
          label="저장되지 않은 변경사항이 있습니다."
          description="지금 나가시면 수정된 내용은 저장되지 않습니다."
          confirmText="나가기"
          confirmFn={handleConfirmExit}
          onClose={() => {
            closeModal();
            rejectNavigation();
          }}
          cancelFn={() => {
            closeModal();
            rejectNavigation();
          }}
        />
      )}
      {activeModal === "OVERWRITE" && (
        <Dialog
          label={
            <p className="text-white text-lg font-medium text-center">
              임시저장된 데이터를 <span className="text-brand">불러</span>
              올까요?
            </p>
          }
          description="저장하지 않은 데이터는 모두 사라집니다."
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default CreateModals;
