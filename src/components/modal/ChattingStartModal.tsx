import React from "react";
import { ModalLayout } from "../ModalLayout";

interface ChattingStartModalProps {
  onClose: () => void;
}
const ChattingStartModal = ({ onClose }: ChattingStartModalProps) => {
  return (
    <ModalLayout onClose={onClose}>
      <div></div>
    </ModalLayout>
  );
};

export default ChattingStartModal;
