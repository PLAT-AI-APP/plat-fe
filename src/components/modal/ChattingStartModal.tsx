import React from "react";
import { ModalLayout } from "../ModalLayout";
import { Close, Message, User } from "@/icons";
import ActiveButton from "../ActiveButton";
import SmartInput from "../SmartInput";
import useToggle from "@/hooks/useToggle";
import ScenarioSelectPopover from "../popover/ScenarioSelectPopover";

interface ChattingStartModalProps {
  onClose: () => void;
}
const ChattingStartModal = ({ onClose }: ChattingStartModalProps) => {
  const { isOpen, open, toggle } = useToggle();
  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="p-5 max-w-125 w-full"
    >
      <header className="flex justify-between pb-9">
        <div className="flex gap-3 items-center">
          <Message />
          대화 시작하기
        </div>
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg p-1 hover:bg-btn-hover"
        >
          <Close className="w-3.5 h-3.5" />
        </button>
      </header>

      <section className="flex flex-col gap-6">
        <SmartInput
          label="내 페르소나"
          description="대화 속에서 당신은 어떤 인물인가요? 당신의 이름, 직업, 특징을 설정해 보세요."
          fontSize="lg"
          leftElement={<User className="w-5 h-5 text-font-2" />}
          rightElement={
            <button className="text-xs text-font-2 rounded-sm py-1 px-3 bg-card hover:bg-card-hover">
              변경
            </button>
          }
          disabled
        />

        <SmartInput
          label="시나리오"
          description="어떤 테마로 대화를 시작할까요? 준비된 시나리오 중 하나를 골라보세요."
          fontSize="lg"
          type="modal"
          isOpen={isOpen}
          toggleIsOpen={toggle}
          // leftElement={<User className="w-5 h-5 text-font-2" />}
          // rightElement={
          //   <button className="text-xs text-font-2 rounded-sm py-1 px-3 bg-card hover:bg-card-hover">
          //     변경
          //   </button>
          // }
          disabled
          // modalComponents={<ScenarioSelectPopover />}
        />
      </section>

      <ActiveButton text="시작하기" isActive className="mt-12" />
    </ModalLayout>
  );
};

export default ChattingStartModal;
