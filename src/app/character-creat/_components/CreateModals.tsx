"use client";

import { useEffect } from "react";
import { useDialogStore } from "@/store/useDialogStore";

type ModalType = "OVERWRITE" | "RESUME" | "SAVE_OVERWRITE" | "UNSAVED" | null;

interface CreateModalsProps {
  activeModal: ModalType;
  closeModal: () => void;
  handleConfirmExit: () => void;
  rejectNavigation: () => void;
  handleLoadDraft: () => void;
  handleSaveOverwrite: () => void;
}

const CreateModals = ({
  activeModal,
  closeModal,
  handleConfirmExit,
  rejectNavigation,
  handleLoadDraft,
  handleSaveOverwrite,
}: CreateModalsProps) => {
  const openDialog = useDialogStore((state) => state.openDialog);

  useEffect(() => {
    if (activeModal === null) return;

    const handleStay = () => {
      closeModal();
      rejectNavigation();
    };

    if (activeModal === "UNSAVED") {
      openDialog("UNSAVED_CHANGES", {
        onCancel: handleStay,
        onLeave: handleConfirmExit,
      });
    } else if (activeModal === "OVERWRITE" || activeModal === "RESUME") {
      // OVERWRITE(불러오기 버튼 클릭)와 RESUME(진입 시 초안 존재 자동 감지) 둘 다
      // 초안을 불러오는 같은 동작이라 같은 다이얼로그를 띄웁니다.
      openDialog("DRAFT_OVERWRITE", {
        onCancel: closeModal,
        onConfirm: handleLoadDraft,
      });
    } else if (activeModal === "SAVE_OVERWRITE") {
      openDialog("DRAFT_SAVE_OVERWRITE", {
        onCancel: closeModal,
        onConfirm: handleSaveOverwrite,
      });
    }

    /*
     * activeModal은 "이 다이얼로그를 한 번 띄워라"는 일회성 신호일 뿐, 다이얼로그가
     * 떠 있는 동안 계속 유지해야 하는 상태가 아니다(그건 useDialogStore가 따로 갖고 있다).
     * 값을 안 지우면, onConfirm(handleLoadDraft 등)이 비동기라 처리되는 동안 부모가
     * 다시 렌더될 때마다 콜백 참조가 바뀌어 이 effect가 다시 실행되고, 그때마다
     * openDialog를 또 호출해 다이얼로그가 계속 다시 떠 버린다(확인을 눌러도 안 닫기는
     * 것처럼 보이는 원인).
     */
    closeModal();
  }, [
    activeModal,
    closeModal,
    handleConfirmExit,
    handleLoadDraft,
    handleSaveOverwrite,
    openDialog,
    rejectNavigation,
  ]);

  return null;
};

export default CreateModals;
