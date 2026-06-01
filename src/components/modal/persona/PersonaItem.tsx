import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import CheckCircle from "@/icons/CheckCircle";
import { Dots } from "@/icons";
import { Persona } from "@/type/persona";
import { useDeletePersonaMutation } from "@/api/persona/deletePersona";
import PersonaMenuPopover from "@/components/popover/PersonaMenuPopover";
import useToggle from "@/hooks/useToggle";
import { useModalStore } from "@/store/useModalStore";

interface PersonaItemProps {
  persona: Persona;
  isActive: boolean;
  onSelect: (personaId: string) => void;
}

const PersonaItem = ({ persona, isActive, onSelect }: PersonaItemProps) => {
  const { name, description, isDefault } = persona;

  const { mutate: deletePersona } = useDeletePersonaMutation();

  const triggerRef = useRef(null);

  const { isOpen, close, toggle } = useToggle();

  const { openModal } = useModalStore();
  return (
    <li
      onClick={() => onSelect(persona.personaId)}
      className={cn(
        "cursor-pointer w-full flex flex-col rounded-2xl gap-2 px-4 py-3 bg-card hover:bg-card-hover transition-colors",
        isActive && "border border-font-1",
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {isDefault && (
            <span className="caption-2 px-1.5 py-0.75 bg-brand-opacity rounded-lg text-brand border border-brand">
              기본
            </span>
          )}
          <span className="title-3">{name}</span>
          {isActive && <CheckCircle className="-ml-2" />}
        </div>
        <div ref={triggerRef} className="relative">
          <Dots
            className="w-6 h-6 text-font-2 cursor-pointer hover:text-font-1"
            onClick={toggle}
          />

          {isOpen && (
            <PersonaMenuPopover
              onClose={close}
              triggerRef={triggerRef}
              onDelete={() => deletePersona(persona.personaId)}
              onEdit={() =>
                openModal("PERSONA_ADD", {
                  isEditMode: true,
                  personaId: persona.personaId,
                  name,
                  description,
                })
              }
            />
          )}
        </div>
      </div>
      <p className="line-clamp-1 whitespace-break-spaces body-4 text-font-2">
        {description}
      </p>
    </li>
  );
};

export default PersonaItem;
