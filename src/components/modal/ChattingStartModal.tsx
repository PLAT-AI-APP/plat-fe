"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ActiveButton from "../ActiveButton";
import { ModalLayout } from "../ModalLayout";
import ScenarioSelectPopover from "../popover/ScenarioSelectPopover";
import SmartInput from "@/components/smart-input";
import useToggle from "@/hooks/useToggle";
import { Close, Message, User } from "@/icons";
import { CharacterScenario } from "@/type/character";
import { ChattingStartModalProps } from "@/type/modal";

const ChattingStartModal = ({
  onClose,
  scenarioList,
  currentScenario,
  setCurrentScenario,
}: ChattingStartModalProps) => {
  const t = useTranslations();
  const [localScenario, setLocalScenario] = useState(currentScenario);
  const { isOpen, close, toggle } = useToggle();
  const triggerRef = useRef<HTMLElement>(null);

  const handleSelect = (scenario: CharacterScenario) => {
    // 모달 안의 선택값과 부모 상태를 같이 갱신해 닫힌 뒤에도 선택 결과가 유지되게 합니다.
    setLocalScenario(scenario);
    setCurrentScenario(scenario);
  };

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-full max-w-125 p-5"
    >
      <header className="flex justify-between pb-9">
        <div className="title-1 flex items-center gap-3">
          <Message />
          {t("chattingStart.title")}
        </div>
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg p-1 hover:bg-btn-hover"
        >
          <Close className="h-3.5 w-3.5" />
        </button>
      </header>

      <section className="flex flex-col gap-6">
        <SmartInput
          label={t("chattingStart.personaLabel")}
          description={t("chattingStart.personaDescription")}
          leftElement={<User className="h-5 w-5 text-font-2" />}
          rightElement={
            <button
              type="button"
              className="body-6 rounded-sm bg-card px-3 py-1 text-font-2 hover:bg-card-hover"
            >
              {t("chattingStart.change")}
            </button>
          }
          disabled
          value={t("chattingStart.personaValue")}
          descFontSize="body-4"
        />

        <SmartInput
          label={t("chattingStart.scenarioLabel")}
          description={t("chattingStart.scenarioDescription")}
          type="modal"
          isOpen={isOpen}
          toggleIsOpen={toggle}
          // SmartInput은 input ref 타입을 기대하지만, modal 타입에서는 실제 트리거 요소를
          // 팝오버 기준점으로만 사용하므로 공통 ref 객체를 캐스팅해 재사용합니다.
          ref={triggerRef as unknown as React.Ref<HTMLInputElement>}
          value={localScenario?.name}
          disabled
          modalComponents={
            <ScenarioSelectPopover
              scenarioList={scenarioList}
              currentScenario={localScenario}
              handleCurrentScenario={handleSelect}
              onClose={close}
              triggerRef={triggerRef}
            />
          }
          descFontSize="body-4"
        />
      </section>

      <ActiveButton
        text={t("chattingStart.submit")}
        isActive
        className="mt-12"
      />
    </ModalLayout>
  );
};

export default ChattingStartModal;
