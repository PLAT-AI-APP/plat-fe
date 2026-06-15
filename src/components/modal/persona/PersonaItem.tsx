import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Dots } from "@/icons";
import { Persona } from "@/type/persona";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import PersonaMenuPopover from "@/components/popover/PersonaMenuPopover";
import { useDeletePersonaMutation } from "@/api/persona/deletePersona";

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
  const { name, description, isDefault } = persona;
  const { openModal } = useModalStore();
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

  const handleDeleteConfirm = () => {
    deletePersona(persona.personaId, {
      onSuccess: closeDialog,
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
                  {commonT("defaultBadge")}
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
              aria-label={t("menuAria", { name })}
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
                onDelete={() =>
                  openDialog("PERSONA_DELETE", {
                    personaName: name,
                    onConfirm: handleDeleteConfirm,
                  })
                }
              />
            )}
          </div>
        </div>
      </li>
    </>
  );
};

export default PersonaItem;
