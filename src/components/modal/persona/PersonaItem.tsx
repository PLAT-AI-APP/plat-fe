import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CheckCircle from "@/icons/CheckCircle";
import { Dots } from "@/icons";
import { Persona } from "@/type/persona";
import PersonaAddModal from "../PersonaAddModal";
import { useDeletePersonaMutation } from "@/api/persona/deletePersona";
import PersonaMenuPopover from "@/components/popover/PersonaMenuPopover";

interface PersonaItemProps {
  persona: Persona;
  isActive: boolean;
  onSelect: (personaId: number) => void;
}

const PersonaItem = ({ persona, isActive, onSelect }: PersonaItemProps) => {
  const { name, description, isDefault } = persona;

  const [isEdit, setIsEdit] = useState(false);

  const { mutate: deletePersona } = useDeletePersonaMutation();

  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };
  const triggerRef = useRef(null);

  const [isEditModal, setIsEditModal] = useState(false);
  const toggleisEditModal = () => {
    setIsEditModal(!isEditModal);
  };
  return (
    <li
      onClick={() => onSelect(persona.personaId)}
      className={cn(
        "cursor-pointer w-full flex flex-col rounded-2xl gap-2 px-4 py-3 bg-card hover:bg-card-hover transition-colors",
        isActive && "border border-font-1",
      )}
    >
      {isEditModal && (
        <PersonaAddModal
          personaId={persona.personaId}
          toggleIsAddModal={toggleisEditModal}
          isEditMode={true}
        />
      )}

      <div className="flex justify-between font-medium">
        <div className="flex items-center gap-3">
          {isDefault && (
            <span className="px-1.5 py-0.75 bg-brand-opacity rounded-lg text-[12px] text-brand border border-brand">
              기본
            </span>
          )}
          <span>{name}</span>
          {isActive && <CheckCircle className="-ml-2" />}
        </div>
        <div ref={triggerRef} className="relative">
          <Dots
            className="w-6 h-6 text-font-2 cursor-pointer hover:text-font-1"
            onClick={(e) => {
              e.stopPropagation();
              toggleIsEdit();
            }}
          />

          {isEdit && (
            <PersonaMenuPopover
              onClose={() => setIsEdit(false)}
              triggerRef={triggerRef}
              onDelete={() => deletePersona(persona.personaId)}
              onEdit={() => setIsEditModal(true)}
            />
          )}
        </div>
      </div>
      <p className="line-clamp-1 whitespace-break-spaces text-sm text-font-2">
        {description}
      </p>
    </li>
  );
};

export default PersonaItem;
