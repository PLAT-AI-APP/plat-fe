import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Dots } from "@/icons";
import { Persona } from "@/type/persona";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import PersonaMenuPopover from "@/components/popover/PersonaMenuPopover";
import { useDeletePersonaMutation } from "@/api/persona/deletePersona";
import { isAppError, resolveErrorMessage } from "@/lib/apiError";

/** 채팅방이 쓰고 있는 페르소나는 지울 수 없습니다(PersonaService.deletePersona). */
const PERSONA_IN_USE_CODE = "PERSONA_IN_USE";

interface PersonaItemProps {
  persona: Persona;
  isActive: boolean;
  hasSelectedPersona: boolean;
  onSelect: (personaId: string) => void;
}

const PersonaItem = ({
  persona,
  isActive,
  hasSelectedPersona,
  onSelect,
}: PersonaItemProps) => {
  const t = useTranslations("modalUi.personaList");
  const commonT = useTranslations("modalUi.common");
  const deleteDialogT = useTranslations("dialog.personaDelete");
  const { name, description, isDefault } = persona;
  const openModal = useModalStore((state) => state.openModal);
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const { mutate: deletePersona } = useDeletePersonaMutation();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDimmed = hasSelectedPersona && !isActive;

  const openEditModal = () => {
    openModal("PERSONA_ADD", {
      isEditMode: true,
      personaId: persona.personaId,
      name,
      description,
    });
  };

  /**
   * 서버 메시지는 한국어 한 벌만 내려오므로(messages_ko.properties), 미리 아는 사유는
   * 프론트 번역으로 바꿔 말하고 나머지만 서버 문구를 그대로 씁니다.
   */
  const resolveDeleteErrorMessage = (error: unknown) =>
    isAppError(error) && error.code === PERSONA_IN_USE_CODE
      ? deleteDialogT("inUse")
      : resolveErrorMessage(error);

  const handleDeleteConfirm = () => {
    deletePersona(persona.personaId, {
      onSuccess: closeDialog,
      // 확인 다이얼로그까지 거친 흐름이라, 실패하면 닫지 않고 그 자리에서 이유를 말합니다.
      onError: (error) =>
        openDialog("PERSONA_DELETE", {
          personaName: name,
          errorMessage: resolveDeleteErrorMessage(error),
          onConfirm: handleDeleteConfirm,
        }),
    });
  };

  return (
    <>
      <li
        onClick={() => onSelect(persona.personaId)}
        className={cn(
          "group flex w-full cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-3 transition-colors",
          isActive
            ? "border-brand-dark bg-brand-opacity"
            : "border-transparent bg-card hover:bg-brand-opacity",
          isDimmed && "bg-darkest",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "title-3 truncate transition-colors",
                  isActive ? "text-brand-dark" : "text-font-1",
                )}
              >
                {name}
              </span>
              {isDefault && (
                <span
                  className={cn(
                    "caption-2 shrink-0 rounded-lg px-1.5 py-1 text-brand",
                    isDimmed ? "bg-card" : "bg-dark",
                  )}
                >
                  {commonT("defaultBadge")}
                </span>
              )}
            </div>
            {description && (
              <p className="body-5 line-clamp-1 min-w-full whitespace-nowrap text-font-2">
                {description}
              </p>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              ref={menuTriggerRef}
              type="button"
              aria-label={t("menuAria", { name })}
              aria-expanded={isMenuOpen}
              className="flex items-center text-font-2 transition-colors hover:text-brand-dark"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
            >
              <Dots className="size-4 -rotate-90" aria-hidden="true" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <PersonaMenuPopover
                  triggerRef={menuTriggerRef}
                  onClose={() => setIsMenuOpen(false)}
                  onEdit={openEditModal}
                  onDelete={() =>
                    openDialog("PERSONA_DELETE", {
                      personaName: name,
                      onConfirm: handleDeleteConfirm,
                    })
                  }
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </li>
    </>
  );
};

export default PersonaItem;
