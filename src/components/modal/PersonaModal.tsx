import React, { useState, useCallback } from "react";
import { PersonaType } from "@/type/user";
import PersonaHeader from "./persona/PersonaHeader";
import PersonaItem from "./persona/PersonaItem";
import PersonaFooter from "./persona/PersonaFooter";
import { ModalLayout } from "../ModalLayout";

const PERSONA_LIST: PersonaType[] = [
  {
    id: "persona-1",
    name: "이름",
    description:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...",
    isDefault: true,
    isSelected: false,
  },
  {
    id: "persona-2",
    name: "이름",
    description:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...",
    isDefault: false,
    isSelected: false,
  },
  {
    id: "persona-3",
    name: "이름",
    description:
      "내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...",
    isDefault: false,
    isSelected: true,
  },
];

interface PersonaModalProps {
  closeModal: () => void;
}

const PersonaModal = ({ closeModal }: PersonaModalProps) => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>(
    PERSONA_LIST[0],
  );

  const handleCurrentPersona = useCallback((persona: PersonaType) => {
    setCurrentPersona(persona);
  }, []);

  return (
    <ModalLayout
      onClose={() => null}
      className="w-screen max-w-125 h-fit whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-bg-dark"
    >
      <PersonaHeader onClose={closeModal} />

      <div>
        <ul className="flex flex-col gap-4">
          {PERSONA_LIST.map((persona) => (
            <PersonaItem
              key={persona.id}
              persona={persona}
              isActive={currentPersona.id === persona.id}
              onSelect={handleCurrentPersona}
            />
          ))}
        </ul>

        <PersonaFooter />
      </div>
    </ModalLayout>
  );
};

export default React.memo(PersonaModal);
