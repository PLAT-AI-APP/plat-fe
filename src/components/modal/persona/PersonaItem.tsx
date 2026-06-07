import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Dots } from "@/icons";
import { Persona } from "@/type/persona";
import { useModalStore } from "@/store/useModalStore";
import PersonaMenuPopover from "@/components/popover/PersonaMenuPopover";
import { useDeletePersonaMutation } from "@/api/persona/deletePersona";
import Dialog from "@/components/Dialog";

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
  const { name, description, isDefault } = persona;
  const { openModal } = useModalStore();
  const { mutate: deletePersona } = useDeletePersonaMutation();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDimmed = hasSelectedPersona && !isActive;

  const openEditModal = () => {
    openModal("PERSONA_ADD", {
      isEditMode: true,
      personaId: persona.personaId,
      name,
      description,
    });
  };

  const handleDeleteConfirm = () => {
    deletePersona(persona.personaId, {
      onSuccess: () => setIsDeleteDialogOpen(false),
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
          isDimmed && "bg-font-4",
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
                    "caption-2 shrink-0 rounded-lg px-1.5 py-0.75 text-brand",
                    isDimmed ? "bg-card" : "bg-font-4",
                  )}
                >
                  기본
                </span>
              )}
            </div>
            {description && (
              <p className="body-4 line-clamp-1 min-w-full whitespace-nowrap text-font-2">
                {description}
              </p>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              ref={menuTriggerRef}
              type="button"
              aria-label={`${name} 페르소나 메뉴 열기`}
              aria-expanded={isMenuOpen}
              className="flex items-center text-font-2 transition-colors hover:text-brand-dark"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
            >
              <Dots className="size-6 -rotate-90" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <PersonaMenuPopover
                triggerRef={menuTriggerRef}
                onClose={() => setIsMenuOpen(false)}
                onEdit={openEditModal}
                onDelete={() => setIsDeleteDialogOpen(true)}
              />
            )}
          </div>
        </div>
      </li>

      {isDeleteDialogOpen && (
        <Dialog
          onClose={() => setIsDeleteDialogOpen(false)}
          cancelFn={() => setIsDeleteDialogOpen(false)}
          cancelText="취소하기"
          confirmText="확인하기"
          label="페르소나를 삭제할까요?"
          description={`'${name}'이 없어지며 다시 되돌릴 수 없어요`}
          confirmFn={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default PersonaItem;
