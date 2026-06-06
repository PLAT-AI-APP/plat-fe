import React from "react";
import { cn } from "@/lib/utils";
import { Pen } from "@/icons";
import { Persona } from "@/type/persona";
import { useModalStore } from "@/store/useModalStore";

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

  const isDimmed = hasSelectedPersona && !isActive;

  return (
    <li
      onClick={() => onSelect(persona.personaId)}
      className={cn(
        "group flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl border px-4 py-3 transition-colors",
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

        <button
          type="button"
          aria-label={`${name} 페르소나 수정`}
          className="shrink-0 text-font-2 transition-colors hover:text-brand-dark"
          onClick={(event) => {
            event.stopPropagation();
            openModal("PERSONA_ADD", {
              isEditMode: true,
              personaId: persona.personaId,
              name,
              description,
            });
          }}
        >
          <Pen className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default PersonaItem;
