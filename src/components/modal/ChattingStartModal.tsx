"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ActiveButton from "../ActiveButton";
import { ModalLayout } from "../ModalLayout";
import ScenarioSelectPopover from "../popover/ScenarioSelectPopover";
import SmartInput from "@/components/smart-input";
import useToggle from "@/hooks/common/useToggle";
import { Close, Message, User } from "@/icons";
import { usePostRoomMutation } from "@/api/room/postRoom";
import { useMePersonasQuery } from "@/api/persona/mePersonas";
import { useModalStore } from "@/store/useModalStore";
import { CharacterScenario } from "@/type/character";
import { ChattingStartModalProps } from "@/type/modal";
import { Persona } from "@/type/persona";
import IconButton from "@/components/ui/IconButton";

const ChattingStartModal = ({
  onClose,
  universeId,
  scenarioList,
  currentScenario,
}: ChattingStartModalProps) => {
  const t = useTranslations();
  const commonT = useTranslations("modalUi.common");
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const { data: personas } = useMePersonasQuery();
  const { mutate: createRoom, isPending } = usePostRoomMutation();

  const [localScenario, setLocalScenario] = useState(currentScenario);
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(
    undefined,
  );
  const {
    isOpen: isScenarioOpen,
    close: closeScenario,
    toggle: toggleScenario,
  } = useToggle();
  const scenarioTriggerRef = useRef<HTMLElement>(null);

  // 사용자가 아직 고르지 않았다면 기본 페르소나(없으면 첫 번째)를 보여줍니다.
  // 리렌더마다 다시 계산되므로, 목록이 나중에 도착해도 useEffect 없이 자연스럽게 반영됩니다.
  const activePersona =
    selectedPersona ??
    personas?.find((persona) => persona.isDefault) ??
    personas?.[0];

  const handleSelectScenario = (scenario: CharacterScenario) => {
    setLocalScenario(scenario);
  };

  const handleChangePersona = () => {
    openModal("PERSONA", {
      onSelectPersona: setSelectedPersona,
      currentPersonaId: activePersona?.personaId,
    });
  };

  const canSubmit = Boolean(activePersona && localScenario) && !isPending;

  const handleSubmit = () => {
    if (!activePersona || !localScenario) return;

    createRoom(
      {
        universeId,
        personaId: activePersona.personaId,
        scenarioId: localScenario.scenarioId,
      },
      {
        onSuccess: ({ roomId }) => {
          onClose();
          router.push(`/chatting-room?roomId=${roomId}`);
        },
      },
    );
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
        <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
          <Close className="size-3.5" />
        </IconButton>
      </header>

      <section className="flex flex-col gap-6">
        <SmartInput
          label={t("chattingStart.personaLabel")}
          description={t("chattingStart.personaDescription")}
          leftElement={<User className="h-5 w-5 text-font-2" />}
          type="modal"
          toggleIsOpen={handleChangePersona}
          value={activePersona?.name}
          placeholder={t("chattingStart.personaPlaceholder")}
          modalActionLabel={t("chattingStart.personaChange")}
          disabled
          descFontSize="body-5"
        />

        <SmartInput
          label={t("chattingStart.scenarioLabel")}
          description={t("chattingStart.scenarioDescription")}
          type="modal"
          isOpen={isScenarioOpen}
          toggleIsOpen={toggleScenario}
          ref={scenarioTriggerRef as unknown as React.Ref<HTMLInputElement>}
          value={localScenario?.name}
          disabled
          modalComponents={
            <ScenarioSelectPopover
              scenarioList={scenarioList}
              currentScenario={localScenario}
              handleCurrentScenario={handleSelectScenario}
              onClose={closeScenario}
              triggerRef={scenarioTriggerRef}
            />
          }
          descFontSize="body-5"
        />
      </section>

      <ActiveButton
        text={t(isPending ? "chattingStart.submitting" : "chattingStart.submit")}
        isActive={canSubmit}
        onClick={handleSubmit}
        className="mt-12"
      />
    </ModalLayout>
  );
};

export default ChattingStartModal;
